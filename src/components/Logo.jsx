import logo from '../assets/img/logo.png'

// Mark is ~1.36:1; size sets its height.
export default function Logo({ size = 34 }) {
  return (
    <a href="#home" className="logo" aria-label="WOLVO home">
      <img src={logo} alt="" height={size} width={Math.round(size * 1.36)} />
      <span>WOLVO</span>
    </a>
  )
}
