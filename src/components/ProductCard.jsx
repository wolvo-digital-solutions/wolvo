import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ProductCard({ name, sub, tag, img }) {
  return (
    <motion.article className="product-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <div className="product-img"><img src={img} alt={`${name} app screens`} loading="lazy" /></div>
      <div className="product-body">
        <h3>{name}</h3>
        <p>{sub}</p>
        <div className="product-foot">
          <span className="pill">{tag}</span>
          <motion.a href="#portfolio" aria-label={`View ${name}`} whileHover={{ x: 3 }}><ArrowRight size={13} /></motion.a>
        </div>
      </div>
    </motion.article>
  )
}
