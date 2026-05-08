import Image from "next/image";
import { Button } from "@/components/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { featuredWork } from "@/lib/work";

const services = [
  {
    title: "Photo & Video Content",
    text: "Campaign imagery, launch assets, reels, and refined detail shots shaped for beauty audiences."
  },
  {
    title: "Social Media Visuals",
    text: "Consistent visual systems for Instagram, TikTok, salon launches, and product-led storytelling."
  },
  {
    title: "Premium Brand Storytelling",
    text: "Editorial direction that makes hair, skin, fragrance, and service rituals feel cinematic and desirable."
  }
];

export default function Home() {
  return (
    <>
      <Hero />
      <Section eyebrow="Featured work" title="Selected beauty stories">
        <GalleryGrid items={featuredWork} featured />
      </Section>
      <Section className="border-y border-white/10 bg-white/[0.02]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
            <Image
              src="https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1300&q=86"
              alt="Portrait of a beauty content creator"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-2xl lg:pl-10">
            <p className="mb-4 text-xs uppercase tracking-luxe text-gold">About Hana</p>
            <h2 className="font-display text-4xl uppercase leading-none tracking-wider text-ivory sm:text-6xl">
              Beauty visuals with editorial restraint
            </h2>
            <p className="mt-7 text-base leading-8 text-ash">
              Hana Brabcova creates polished photo and video content for beauty brands that want their online presence to feel
              elevated, tactile, and unmistakably premium. Her work balances clean composition with soft cinematic light.
            </p>
            <Button href="/about" variant="ghost" className="mt-9">
              Meet Hana
            </Button>
          </div>
        </div>
      </Section>
      <Section eyebrow="Services" title="Made for premium beauty">
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="bg-ink p-7 sm:p-9">
              <h3 className="font-display text-2xl uppercase tracking-wider text-ivory">{service.title}</h3>
              <p className="mt-5 text-sm leading-7 text-ash">{service.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="border-y border-gold/40 py-16 text-center">
          <p className="text-xs uppercase tracking-luxe text-gold">Now booking</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl uppercase leading-tight tracking-wider text-ivory sm:text-6xl">
            Create a visual world your clients can feel
          </h2>
          <Button href="/contact" className="mt-9">
            Start a project
          </Button>
        </div>
      </Section>
    </>
  );
}
