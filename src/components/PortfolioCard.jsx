import { motion } from 'framer-motion'

export default function PortfolioCard({ name, sub, img }) {
  return (
    <motion.article className="work-card" whileHover="hover" initial="rest" animate="rest" variants={{ rest: { y: 0 }, hover: { y: -6 } }}>
      <div className="work-img">
        <motion.img src={img} alt={`${name} project preview`} loading="lazy" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.5 }} />
      </div>
      <div className="work-body"><h3>{name}</h3><p>{sub}</p></div>
    </motion.article>
  )
}
