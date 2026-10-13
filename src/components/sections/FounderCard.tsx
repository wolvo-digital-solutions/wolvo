import { UserRound } from 'lucide-react';
import type { Founder } from '@/types/content';
import { SocialList } from '@/components/ui/SocialIcon';

export function FounderCard({ founder }: { founder: Founder }) {
  return (
    <article className="founder-card" data-founder>
      <div className="founder-card__media">
        {founder.image ? (
          <img src={founder.image} alt={founder.imageAlt ?? `Portrait of ${founder.name}`} loading="lazy" decoding="async" />
        ) : (
          <div className="founder-card__placeholder" role="img" aria-label={`Portrait of ${founder.name} — photo coming soon`}>
            <UserRound strokeWidth={1} aria-hidden="true" />
            <span>Photo coming soon</span>
          </div>
        )}
      </div>
      <div className="founder-card__body">
        <p className="founder-card__role">{founder.role}</p>
        <h4 className="founder-card__name">{founder.name}</h4>
        <p className="founder-card__bio">{founder.bio}</p>
        <SocialList links={founder.socialLinks} className="socials founder-card__socials" />
      </div>
    </article>
  );
}
