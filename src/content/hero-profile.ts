/**
 * AI_NOTE:
 * Role: canonical content source for the hero profile list.
 * Time-sensitive profile details should be updated here, not inline inside components.
 */

export type HeroProfileItem = {
  label: string;
  value: string;
  href?: string;
};

export const HERO_PROFILE_ITEMS: readonly HeroProfileItem[] = [
  {
    label: "생년월일",
    value: "2000.03.30 (만 26세)",
  },
  {
    label: "이메일",
    value: "kimjk4031@naver.com",
    href: "mailto:kimjk4031@naver.com",
  },
  {
    label: "연락처",
    value: "010-9127-4031",
    href: "tel:01091274031",
  },
] as const;
