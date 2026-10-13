import { useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/types/content';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useCarousel } from '@/hooks/useCarousel';
import { testimonials } from '@/data/testimonials';
import { initials } from '@/lib/format';
import { CarouselControls } from '@/components/ui/CarouselControls';
import { SectionHeading } from '@/components/ui/SectionHeading';
import './Testimonials.css';

function Rating({ value }: { value: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="review-card__rating" role="img" aria-label={`Rated ${rounded} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} strokeWidth={1.6} className={i < rounded ? 'is-filled' : ''} aria-hidden="true" />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={`review-card${testimonial.placeholder ? ' is-placeholder' : ''}`} data-reveal-item data-carousel-item>
      <div className="review-card__top">
        <Quote className="review-card__icon" strokeWidth={1.5} aria-hidden="true" />
        {typeof testimonial.rating === 'number' && <Rating value={testimonial.rating} />}
      </div>
      <blockquote className="review-card__quote">
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption className="review-card__author">
        <span className="review-card__avatar" aria-hidden="true">
          {testimonial.avatar ? <img src={testimonial.avatar} alt="" loading="lazy" /> : initials(testimonial.name)}
        </span>
        <span className="review-card__person">
          <strong>{testimonial.name}</strong>
          <span>
            {testimonial.role}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carousel = useCarousel(trackRef);
  useSectionMotion(ref);

  return (
    <section id="reviews" ref={ref} className="reviews section" aria-labelledby="reviews-title">
      <span className="reviews__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          id="reviews-title"
          index="06"
          eyebrow="Client Stories"
          title={
            <>
              What Our Clients <span className="text-gradient">Say</span>
            </>
          }
          description="Straightforward feedback from the businesses, founders and creators we work with."
        />
      </div>

      <div ref={trackRef} className="reviews__track" data-reveal="stagger">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      {carousel.canScroll && (
        <div className="container">
          <CarouselControls
            className="reviews__controls"
            label="review"
            index={carousel.index}
            count={carousel.count}
            progress={carousel.progress}
            atStart={carousel.atStart}
            atEnd={carousel.atEnd}
            onPrev={carousel.prev}
            onNext={carousel.next}
          />
        </div>
      )}
    </section>
  );
}
