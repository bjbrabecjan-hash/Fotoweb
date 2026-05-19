import { ExternalLink, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Kontakt | Hana Brabcová"
};

export default function ContactPage() {
  return (
    <Section className="min-h-screen pt-32 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 text-xs uppercase tracking-luxe text-gold">Contact</p>
          <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ivory sm:text-7xl lg:text-8xl">
            Začněme beauty příběh
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-ash">
            Napište značku, salon, focení obsahu nebo launch, který připravujete. Hana se ozve s dostupností a vhodným
            vizuálním formátem pro vaše cíle.
          </p>
          <div className="mt-10 space-y-5 text-sm text-ash">
            <a className="flex items-center gap-4 transition hover:text-gold" href="mailto:fotohanabrabcova@gmail.com">
              <Mail size={18} />
              fotohanabrabcova@gmail.com
            </a>
            <a className="flex items-center gap-4 transition hover:text-gold" href="tel:+420734548996">
              <Phone size={18} />
              734 548 996
            </a>
            <a className="flex items-center gap-4 transition hover:text-gold" href="https://www.instagram.com/brabcovahana_content_/" target="_blank">
              <Instagram size={18} />
              @brabcovahana_content_
            </a>
            <a className="flex items-center gap-4 transition hover:text-gold" href="https://www.facebook.com/profile.php?id=61579648302684" target="_blank">
              <ExternalLink size={18} />
              Facebook
            </a>
            <p className="flex items-center gap-4">
              <MapPin size={18} />
              Plzeň, Praha a focení po domluvě
            </p>
          </div>
        </div>
        <form
          action="mailto:fotohanabrabcova@gmail.com?subject=Poptavka%20z%20webu%20Hana%20Brabcova"
          method="post"
          encType="text/plain"
          className="border border-white/10 bg-white/[0.025] p-6 sm:p-8"
        >
          <div className="grid gap-6">
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              Jméno
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
              Projekt / zpráva
              <textarea
                className="min-h-36 resize-y border border-white/10 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                name="message"
              />
            </label>
            <Button type="submit" className="w-full">
              Odeslat poptávku
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
