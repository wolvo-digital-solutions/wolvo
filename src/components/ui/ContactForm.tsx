"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { budgetRanges, contactSchema, projectTypes } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-2 w-full rounded-[4px] border bg-navy-950/60 px-4 py-3 text-ink placeholder:text-faint transition-colors focus:border-sky focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.18em] text-muted">
        {label} {optional && <span className="normal-case tracking-normal text-faint">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-cyan">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const collect = () => Object.fromEntries(new FormData(formRef.current!).entries());

  const validateField = (name: string) => {
    const result = contactSchema.safeParse(collect());
    const issue = result.success ? undefined : result.error.issues.find((i) => i.path[0] === name);
    setErrors((e) => ({ ...e, [name]: issue?.message }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(collect());
    if (!result.success) {
      const next: Errors = {};
      for (const i of result.error.issues) next[String(i.path[0])] ??= i.message;
      setErrors(next);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      formRef.current?.querySelector<HTMLElement>(`[name="${String(result.error.issues[0].path[0])}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setErrors(body.fieldErrors ?? {});
        setStatus("error");
        setMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
      setMessage(
        body.delivered === false
          ? "Enquiry received (development mode — email delivery is not configured yet)."
          : "Thank you — your enquiry is on its way. We'll be in touch soon.",
      );
      formRef.current?.reset();
      setErrors({});
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  const err = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    // Re-validate while typing once a field has an error, so messages clear
    // before the user reaches the submit button (no layout shift on click).
    onInput: () => errors[name] !== undefined && validateField(name),
    onChange: () => errors[name] !== undefined && validateField(name),
  });
  const border = (name: string) => (errors[name] ? "border-cyan" : "border-line");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6 md:grid-cols-2" aria-describedby="form-status">
      <Field id="name" label="Name" error={errors.name}>
        <input id="name" name="name" autoComplete="name" required className={cn(field, border("name"))} {...err("name")} />
      </Field>
      <Field id="company" label="Company" optional error={errors.company}>
        <input id="company" name="company" autoComplete="organization" className={cn(field, border("company"))} {...err("company")} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required className={cn(field, border("email"))} {...err("email")} />
      </Field>
      <Field id="phone" label="Phone" optional error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={cn(field, border("phone"))} {...err("phone")} />
      </Field>
      <Field id="projectType" label="Project type" error={errors.projectType}>
        <select id="projectType" name="projectType" required defaultValue="" className={cn(field, border("projectType"))} {...err("projectType")}>
          <option value="" disabled>
            Select a service
          </option>
          {projectTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field id="budget" label="Budget" optional error={errors.budget}>
        <select id="budget" name="budget" defaultValue="" className={cn(field, border("budget"))} {...err("budget")}>
          <option value="">Prefer not to say</option>
          {budgetRanges.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field id="message" label="Tell us about your idea" error={errors.message}>
          <textarea id="message" name="message" rows={5} required className={cn(field, "resize-y", border("message"))} {...err("message")} />
        </Field>
      </div>
      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p id="form-status" role="status" aria-live="polite" className={cn("text-sm", status === "sent" ? "text-sky" : "text-cyan")}>
          {status === "sent" && <Check aria-hidden className="mr-2 inline size-4" />}
          {message}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[4px] bg-electric px-7 font-display text-[0.8rem] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-sky disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {status === "sending" ? "Sending" : "Send enquiry"}
          {status !== "sending" && <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
        </button>
      </div>
    </form>
  );
}
