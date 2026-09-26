import logo from '../assets/img/logo.png'

export default function Logo({ size = 34 }) {
  return (
    <a href="#home" className="logo" aria-label="WOLVO home">
      <img src={logo} alt="" width={size} height={size} />
      <span>WOLVO</span>
    </a>
  )
}
