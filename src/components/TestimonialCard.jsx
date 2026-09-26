const initials = (name) => name.replace(/^Dr\.\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('')

export default function TestimonialCard({ quote, name, role, img, hidden }) {
  return (
    <figure className="t-card" aria-hidden={hidden || undefined}>
      <blockquote>“{quote}”</blockquote>
      <figcaption>
        {img
          ? <img src={img} alt="" loading="lazy" width="36" height="36" />
          : <span className="t-avatar" aria-hidden="true">{initials(name)}</span>}
        <div><strong>{name}</strong><span>{role}</span></div>
      </figcaption>
    </figure>
  )
}
