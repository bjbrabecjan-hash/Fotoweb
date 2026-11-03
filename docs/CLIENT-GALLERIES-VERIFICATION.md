# Ověření první verze — 19. října 2026

Tento dokument zachycuje původní lokální verzi. Následné připojení skutečného Supabase, stav preview a aktuální omezení popisuje `SUPABASE-VERIFICATION.md`.

## Implementováno

Klientská sekce `/pro-klienty`, administrace `/administrace/galerie`, chráněné API, ukládání na disk, vodoznaky, export názvů a připravený transport e-mailů přes Resend. Postup nastavení a provozní omezení popisuje `CLIENT-GALLERIES.md`.

## Technicky ověřeno

- TypeScript: `tsc --noEmit`, exit 0.
- Integrační test: `node scripts/test-proofing.mjs`, exit 0. Skutečný Next server na loopback adrese, dočasná databáze a testovací fotografie. Vytvoření alba, přihlášení kódem, kontrola soukromí souborů, oddělení alb, uložení, konflikt dvou verzí výběru, potvrzení, uzamčení, opakované potvrzení, uchování dat po restartu, změna kódu, uzavření, CSRF a odhlášení.
- Produkční build: `npm run build`, exit 0, bez lintovacích varování. Next.js 15.5.18 z projektového `package-lock.json`. Nové stránky a dynamické API se objevily v seznamu sestavených rout.
- Kontroly proběhly v izolované kopii se stejnými zdroji a přesnými závislostmi z lockfilu. Část původních `node_modules` je v iCloudu jako `compressed,dataless` a blokovala čtení. Existující projektové závislosti nebyly nahrazeny a žádná nová produkční závislost nebyla přidána.

## Vizuálně a interakcí ověřeno

V lokálním prohlížeči: přihlášení administrace, vytvoření galerie, dávkové nahrání šesti fotografií z již veřejného portfolia projektu, náhledy s vodoznakem, vstup klientským kódem, označení dvou fotek, zvětšení snímku, poznámka a potvrzení výběru. Administrace poté ukázala přesně vybrané dvě fotografie a stejnou poznámku. Stažený textový export byl přečten a obsahoval přesné původní názvy obou snímků.

Responzivní zobrazení bylo navíc prohlédnuto v rámci prohlížeče při šířce 390 px. Nejde o ověření na fyzickém telefonu.

Náhledy jsou v `output/proofing/`. Jsou pořízené z lokální testovací galerie, nikoli z nových zákaznických dat. Ukázkové texty a kódy patří pouze této dočasné galerii.

## Původní stav před připojením Supabase

- Připojení trvalého cloudového úložiště a databáze. Supabase a Cloudflare R2 byly pouze porovnány, nejsou zapojené. Diskový adaptér odmítá prostředí Vercel, aby nedošlo k tichému ukládání na dočasný disk.
- Konfigurace odesílatele a API klíče Resend. Ověřen je pouze stav nenastavené služby a zachování výběru. Reálný e-mail nebyl odeslán; doručení není ověřeno.
- Produkční přihlašovací údaje, HTTPS, zálohy, limity na proxy a skutečné nasazení. Žádný cloudový projekt, účet ani služba nebyly vytvořeny či změněny.
