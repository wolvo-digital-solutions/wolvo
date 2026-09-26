import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { revealSection } from './gsapAnimations'

export default function useReveal() {
  const ref = useRef(null)
  useGSAP(() => revealSection(ref.current), { scope: ref })
  return ref
}
