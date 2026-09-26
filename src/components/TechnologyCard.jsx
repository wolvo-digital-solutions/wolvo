export default function TechnologyCard({ name, logo, hidden }) {
  return (
    <div className="tech-card" aria-hidden={hidden || undefined}>
      <img src={logo} alt={hidden ? '' : `${name} logo`} width="30" height="30" loading="lazy" />
      <span>{name}</span>
    </div>
  )
}
