import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Button({ children, variant = 'primary', href = '#', arrow = true, icon, type, onClick, className = '' }) {
  const Tag = type ? motion.button : motion.a
  return (
    <Tag
      href={type ? undefined : href}
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      initial="rest"
      animate="rest"
      variants={{ rest: { y: 0 }, hover: { y: -2 } }}
    >
      {icon}
      <span>{children}</span>
      {arrow && (
        <motion.span className="btn-arrow" variants={{ rest: { x: 0 }, hover: { x: 4 } }}>
          <ArrowRight size={14} strokeWidth={2.2} />
        </motion.span>
      )}
    </Tag>
  )
}
