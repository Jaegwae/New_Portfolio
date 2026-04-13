/**
 * AI_NOTE:
 * Role: presentational renderer for hero profile items.
 * Content source of truth lives in src/content/hero-profile.ts.
 */

import { HERO_PROFILE_ITEMS } from "@/content/hero-profile";

export function HeroProfile() {
  // AI_CONTEXT:
  // This renderer is intentionally dumb.
  // Update labels/order/links in the content file first unless the semantic HTML contract changes.
  return (
    <dl className="hero-profile">
      {HERO_PROFILE_ITEMS.map((item) => (
        <div className="hero-profile__item" key={item.label}>
          <dt className="hero-profile__label">{item.label}</dt>
          <dd className="hero-profile__value">
            {item.href ? (
              <a className="hero-profile__link" href={item.href}>
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
