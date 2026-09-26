import { motion } from 'framer-motion'

export default function ServiceCard({ icon: Icon, title, text }) {
  return (
    <motion.article className="service-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <motion.span className="svc-icon" whileHover={{ scale: 1.1 }}><Icon size={20} strokeWidth={1.8} /></motion.span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.article>
  )
}
