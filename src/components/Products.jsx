import useReveal from '../animations/useReveal'
import Button from './Button'
import ProductCard from './ProductCard'
import { products } from '../data/content'

export default function Products() {
  const ref = useReveal()
  return (
    <section className="section products light" id="products" ref={ref}>
      <div className="container products-grid">
        <div className="products-copy">
          <p className="kicker" data-reveal>Our Products</p>
          <h2 data-reveal>Innovative Products<br />Built for Real People</h2>
          <p className="muted" data-reveal>
            We develop and maintain products that solve everyday problems with technology. Explore our featured
            products and experience the difference.
          </p>
          <div data-reveal><Button variant="outline" href="#portfolio">View All Products</Button></div>
        </div>
        <div className="product-list" data-stagger>
          {products.map((p) => <ProductCard key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  )
}
