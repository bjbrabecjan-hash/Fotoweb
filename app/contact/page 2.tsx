import { Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Contact | Hana Brabcová"
};

export default function ContactPage() {
  return (
    <Section className="min-h-screen pt-32 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 text-xs uppercase tracking-luxe text-gold">Contact</p>
          <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ivory sm:text-7xl lg:text-8xl">
            Start a beauty story
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-ash">
            Share the brand, campaign, salon, or launch you are shaping. Hana will respond with availability, direction, and the
            right content format for your goals.
          </p>
          <div className="mt-10 space-y-5 text-sm text-ash">
            <a className="flex items-center gap-4 transition hover:text-gold" href="mailto:hello@hanabrabcova.com">
              <Mail size={18} />
              hello@hanabrabcova.com
            </a>
            <a className="flex items-center gap-4 transition hover:text-gold" href="https://instagram.com/" target="_blank">
              <Instagram size={18} />
              @hanabrabcova
            </a>
            <p className="flex items-center gap-4">
              <MapPin size={18} />
              Prague and destination shoots
            </p>
          </div>
        </div>
        <form className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="grid gap-6">
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              Name
              <input
                className="h-12 border border-white/10 bg-ink px-4 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                name="name"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              Email
              <input
                className="h-12 border border-white/10 bg-ink px-4 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                type="email"
                name="email"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              Project
              <textarea
                className="min-h-36 resize-y border border-white/10 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                name="message"
              />
            </label>
            <Button type="submit" className="w-full">
              Send inquiry
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
