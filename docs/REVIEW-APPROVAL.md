# Recenze — schválení jedním kliknutím

## Chování

- Dotazník nejprve uloží soukromou odpověď a přesné znění obou souhlasů do `photo_feedback`. Potom zkusí odeslat e-mail. Výpadek e-mailu nevymaže uloženou odpověď.
- Po přihlášení do `/administrace/galerie` je záložka **Recenze a souhlasy**. Záznamy se stránkují po 50, je vidět souhlas s fotografiemi i recenzí a stav e-mailu.
- **Zveřejnit na webu** vyžaduje neprázdnou recenzi a výslovný souhlas s recenzí se jménem. Souhlas s fotografiemi je nezávislý. **Stáhnout z webu** publikaci zruší. Obě akce vyžadují existující přihlášení správce a kontrolu originu.
- Úvodní stránka načítá nejnovějších 100 schválených recenzí přes necachovaný `/api/reviews`. Veřejný výstup obsahuje pouze ID, jméno a text. Stávající ručně vložené recenze zůstávají. Změna se projeví po novém načtení stránky.
- Odpovědi dříve zaslané jen e-mailem se zpětně neimportují. Formulář neověřuje totožnost odesílatele, proto schválení zůstává ruční.

## Databáze

Nová tabulka má RLS, bez práv pro `anon` a `authenticated`, zápis i čtení provádí server. Databázový CHECK brání zveřejnění bez souhlasu nebo textu. Idempotentní vložení stejného ID nepřepisuje původní souhlasy; odlišný obsah se stejným ID vrací konflikt.

Referenční SQL je `supabase/feedback-schema.sql`, jeho kopie pro release je `db/feedback-schema.sql`. Bez změn stávajících galerií. Primární SQL konektor Supabase nebyl dostupný, proto je připraven volitelný bootstrap `db/setup-reviews.mjs` uvnitř Vercelu. Spustí se **pouze** s build proměnnou `REVIEW_DB_SETUP=1`; běžný build databázi neotevírá. Používá nativní `POSTGRES_URL_NON_POOLING`/`POSTGRES_URL`, přísné TLS s veřejnou Supabase CA, transakci a rollback syntetického testu publikace, stažení a nesouhlasu. Při chybě build selže. CA pochází z `https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt`.

## Ověření a aktuální blokace — 2026-11-03

- `test:feedback` PASS: validace, selhání databáze, zachování uložené odpovědi při nedostupném e-mailu, limit.
- `test:reviews` PASS: soukromý výchozí stav, konflikt ID, nezávislé souhlasy, publikace a stažení, veřejná projekce bez privátních dat, opakování e-mailu, autentizace a origin.
- Typová kontrola a izolovaný produkční Next build PASS. Opravené zbytky chybného merge v Footer/Navbar byly nutné pro sestavení (duplicitní deklarace a zavírací tag, neexistující `entered`).
- Lokální vizuální QA administrace na 390 a 1280 px PASS se syntetickými daty a zachycenými HTTP požadavky. Kliknutí na publikaci změnilo stav i tlačítko; recenze bez souhlasu má publikaci zablokovanou. Nejde o živou databázovou integraci.
- Supabase SQL konektor opakovaně končí connection timeoutem. Advisory dotaz také skončil timeoutem. Přímý PostgreSQL přístup z Vercelu po správném TLS vrací serverovou chybu `XX000`; nezávislý REST test stávajících galerií skončil timeoutem.
- Metadata projektu hlásí ACTIVE_HEALTHY. Pokus o obnovení bez pozastavení vrátil, že projekt není pozastavený a může být ještě v obnovování. Projekt nebyl pozastaven ani restartován; je sdílený i s jinými aplikacemi.
- Produkční domény nebyly přepnuté. Neúspěšné buildy neměnily stávající web. Tabulka nebyla potvrzeně vytvořená, živá publikace ani e-mail nejsou ověřené.

Po obnovení databázové dostupnosti: ověřit schéma, spustit opt-in bootstrap, přečíst RLS/granty, otestovat skutečný REST dotaz na veřejnou projekci, dokončit Vercel build bez přepnutí domény a teprve potom provést promotion. Restart sdíleného projektu vyžaduje samostatné potvrzení kvůli krátkému výpadku ostatních aplikací.
