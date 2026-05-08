import Image from "next/image";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export const metadata = {
  title: "About | Hana Brabcová"
};

const values = ["Quiet luxury", "Soft cinematic light", "Beauty-first composition", "Social-ready delivery"];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32 lg:pt-40">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-luxe text-gold">About</p>
            <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ivory sm:text-7xl lg:text-8xl">
              Hana Brabcová
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-ash">
              Hana builds visual identities for beauty brands through polished photography, short-form video, and precise art
              direction. Her approach is minimal, elegant, and built for brands that understand the value of atmosphere.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
            <Image
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1300&q=86"
              alt="Elegant portrait for Hana Brabcova"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Section>
      <Section className="border-y border-white/10 bg-white/[0.02]" eyebrow="Direction" title="Luxury without noise">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <p className="text-base leading-8 text-ash">
            Every frame is planned around texture, touch, and the quiet confidence that makes a salon, product, or artist feel
            high-end before a client reads a single caption.
          </p>
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="bg-ink p-6 text-sm uppercase tracking-luxe text-ivory">
                {value}
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-3xl font-display text-4xl uppercase leading-tight tracking-wider text-ivory sm:text-6xl">
            Let the brand feel considered from the first glance
          </h2>
          <Button href="/contact">Contact</Button>
        </div>
      </Section>
    </>
  );
}
