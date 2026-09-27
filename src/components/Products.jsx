import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import useReveal from '../animations/useReveal'
import { products } from '../data/content'

export default function Products() {
  const ref = useReveal()
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % products.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section className="section products dark" id="products" ref={ref} style={{ padding: '140px 0', background: 'var(--color-bg-dark)', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Side: Text */}
        <div style={{ paddingRight: '20px' }}>
          <p className="kicker" data-reveal style={{ justifyContent: 'flex-start' }}>Our Products</p>
          <h2 data-reveal style={{ fontSize: 'clamp(36px, 4vw, 48px)', lineHeight: '1.2', marginBottom: '24px' }}>
            Innovative Products<br />Built for Real People
          </h2>
          <p data-reveal style={{ color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: '1.7', marginBottom: '40px' }}>
            We develop and maintain cutting-edge products that solve everyday problems with technology. Explore our featured apps and platforms designed to create real impact.
          </p>
          
          <div data-reveal style={{ display: 'flex', gap: '20px' }}>
            <button onClick={prev} aria-label="Previous product" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'background 0.3s, borderColor 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(43,123,255,0.5)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
              <ArrowLeft size={20} />
            </button>
            <button onClick={next} aria-label="Next product" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'background 0.3s, borderColor 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(43,123,255,0.5)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Coverflow Carousel */}
        <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px' }}>
          <AnimatePresence>
            {products.map((p, index) => {
              const offset = (index - activeIndex + products.length) % products.length
              const distance = offset > products.length / 2 ? offset - products.length : offset
              const isActive = distance === 0
              
              // Adjusted 3D math for the side-layout
              const rotateY = distance * -25
              const x = distance * 180
              const z = Math.abs(distance) * -140
              const scale = isActive ? 1 : 0.85
              const opacity = Math.abs(distance) > 1.5 ? 0 : 1 - Math.abs(distance) * 0.4

              return (
                <motion.div
                  key={p.name}
                  initial={false}
                  animate={{ rotateY, x, z, scale, opacity }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{
                    position: 'absolute',
                    width: '320px',
                    height: '420px',
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, rgba(16,28,48,0.95) 0%, rgba(8,16,30,0.95) 100%)',
                    border: '1px solid rgba(120,170,255,0.15)',
                    boxShadow: isActive ? '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 50px rgba(43,123,255,0.15)' : '0 20px 40px -10px rgba(0,0,0,0.5)',
                    zIndex: products.length - Math.abs(distance),
                    cursor: isActive ? 'default' : 'pointer',
                    overflow: 'hidden',
                    transformStyle: 'preserve-3d',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: opacity === 0 ? 'none' : 'auto'
                  }}
                  onClick={() => {
                    if (!isActive) setActiveIndex(index)
                  }}
                >
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', background: 'linear-gradient(0deg, rgba(16,28,48,0.95) 0%, transparent 100%)' }}></div>
                  </div>
                  <div style={{ padding: '0 32px 32px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '26px', color: '#fff', marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>{p.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{p.sub}</p>
                    <span style={{ marginTop: 'auto', alignSelf: 'flex-start', background: 'rgba(12,36,80,0.8)', border: '1px solid rgba(120,170,255,0.2)', color: '#8cb4ff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>{p.tag}</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          #products .container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          #products .kicker {
            justify-content: center !important;
          }
          #products .container > div:first-child {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}} />
    </section>
  )
}
