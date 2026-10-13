import { useId, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { CircleAlert, CircleCheck, Clock, LoaderCircle, Mail, MessagesSquare, Send } from 'lucide-react';
import { useUI, useUIState, type ContactRequest } from '@/context/UIContext';
import { useStickyValue } from '@/hooks/useStickyValue';
import { inquiryOptions, site } from '@/data/site';
import { serviceTitles } from '@/data/services';
import { EMAIL_PATTERN, PHONE_PATTERN, submitInquiry, type InquiryInput } from '@/lib/contact';
import { track } from '@/lib/track';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import './dialogs.css';

const NOT_SURE = 'Not sure yet';

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, optional, error, className = '', children }: FieldProps) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional ? <span className="field__optional">Optional</span> : <span className="field__required" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          <CircleAlert strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm({ request, onClose }: { request: ContactRequest; onClose: () => void }) {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const [result, setResult] = useState<'endpoint' | 'mailto' | 'spam' | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialService = request.service && serviceTitles.includes(request.service) ? request.service : '';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: initialService,
      budget: '',
      timeline: '',
      message: request.message ?? '',
      website: '',
    },
  });

  const onSubmit = async (data: InquiryInput) => {
    setServerError(null);
    const response = await submitInquiry(data);
    if (response.ok) {
      track('contact_submit', { service: data.service, via: response.via });
      setResult(response.via);
    } else {
      setServerError(response.error);
    }
  };

  const describedBy = (name: keyof InquiryInput) => (errors[name] ? `${fid(name)}-error` : undefined);

  if (result) {
    return (
      <div className="contact-success" role="status">
        <span className="contact-success__icon" aria-hidden="true">
          <CircleCheck strokeWidth={1.75} />
        </span>
        <h2 id="contact-title" className="contact-success__title">
          {result === 'mailto' ? 'Almost there — just hit send.' : 'Thanks — your message is on its way.'}
        </h2>
        <p className="contact-success__text">
          {result === 'mailto' ? (
            <>
              Your email app should have opened with your project details ready to send. If it didn’t, email us directly at{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </>
          ) : (
            <>We’ll review your project and get back to you with next steps. Keep an eye on your inbox.</>
          )}
        </p>
        <Button onClick={onClose} icon="none">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="contact">
      <aside className="contact__intro">
        <p className="eyebrow">
          <span className="eyebrow__line" aria-hidden="true" />
          Start a project
        </p>
        <h2 id="contact-title" className="contact__title">
          Tell us about your <span className="text-gradient">project</span>
        </h2>
        <p className="contact__lead">Share a few details and we’ll come back with clear next steps, a realistic timeline and an honest quote.</p>

        <ul className="contact__points" role="list">
          <li>
            <MessagesSquare strokeWidth={1.85} aria-hidden="true" />
            <span>
              <strong>Talk to the builders</strong>
              Direct communication with the people doing the work.
            </span>
          </li>
          <li>
            <Clock strokeWidth={1.85} aria-hidden="true" />
            <span>
              <strong>Clear next steps</strong>
              Scope, timeline and pricing explained in plain language.
            </span>
          </li>
          <li>
            <Mail strokeWidth={1.85} aria-hidden="true" />
            <span>
              <strong>Prefer email?</strong>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </span>
          </li>
        </ul>
        <StatusPill />
      </aside>

      <form className="contact__form" onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="contact-title">
        <div className="contact__grid">
          <Field id={fid('name')} label="Your name" error={errors.name?.message}>
            <input
              id={fid('name')}
              className="input"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={describedBy('name')}
              {...register('name', {
                required: 'Please enter your name.',
                minLength: { value: 2, message: 'Please enter at least 2 characters.' },
                maxLength: { value: 80, message: 'Please keep this under 80 characters.' },
              })}
            />
          </Field>

          <Field id={fid('email')} label="Email" error={errors.email?.message}>
            <input
              id={fid('email')}
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={describedBy('email')}
              {...register('email', {
                required: 'Please enter your email address.',
                pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
              })}
            />
          </Field>

          <Field id={fid('phone')} label="Phone" optional error={errors.phone?.message}>
            <input
              id={fid('phone')}
              className="input"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy('phone')}
              {...register('phone', {
                validate: (v) => !v || PHONE_PATTERN.test(v) || 'Please enter a valid phone number.',
              })}
            />
          </Field>

          <Field id={fid('service')} label="Service" error={errors.service?.message}>
            <select
              id={fid('service')}
              className="input select"
              aria-invalid={!!errors.service}
              aria-describedby={describedBy('service')}
              {...register('service', { required: 'Please choose a service.' })}
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
              <option value={NOT_SURE}>{NOT_SURE}</option>
            </select>
          </Field>

          <Field id={fid('budget')} label="Budget" optional>
            <select id={fid('budget')} className="input select" {...register('budget')}>
              <option value="">Select a range</option>
              {inquiryOptions.budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fid('timeline')} label="Timeline" optional>
            <select id={fid('timeline')} className="input select" {...register('timeline')}>
              <option value="">Select a timeline</option>
              {inquiryOptions.timelines.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fid('message')} label="Project details" error={errors.message?.message} className="field--full">
            <textarea
              id={fid('message')}
              className="input textarea"
              rows={5}
              placeholder="What are you building, who is it for and what does success look like?"
              aria-invalid={!!errors.message}
              aria-describedby={describedBy('message')}
              {...register('message', {
                required: 'Please tell us a little about your project.',
                minLength: { value: 20, message: 'A little more detail helps — at least 20 characters.' },
                maxLength: { value: 2000, message: 'Please keep this under 2000 characters.' },
              })}
            />
          </Field>

          {/* Honeypot — hidden from people, tempting for bots. */}
          <div className="contact__hp" aria-hidden="true">
            <label htmlFor={fid('website')}>Website</label>
            <input id={fid('website')} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </div>
        </div>

        {serverError && (
          <p className="contact__alert" role="alert">
            <CircleAlert strokeWidth={2} aria-hidden="true" />
            {serverError}
          </p>
        )}

        <div className="contact__footer">
          <p className="contact__privacy">We only use your details to reply to your inquiry.</p>
          <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting} aria-busy={isSubmitting}>
            <span className="btn__label">
              {isSubmitting ? 'Sending…' : 'Send inquiry'}
              {isSubmitting ? (
                <LoaderCircle className="btn__icon contact__spinner" aria-hidden="true" />
              ) : (
                <Send className="btn__icon btn__icon--arrow-right" aria-hidden="true" />
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ContactDialog() {
  const { contact } = useUIState();
  const { closeContact } = useUI();
  const request = useStickyValue(contact);

  return (
    <Modal open={contact !== null} onClose={closeContact} labelledBy="contact-title" size="lg">
      {request && <ContactForm key={request.nonce} request={request} onClose={closeContact} />}
    </Modal>
  );
}
