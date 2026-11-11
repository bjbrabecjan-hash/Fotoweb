# Smlouvy a dohody

## Zapojení do současného webu

Základ: aktuální GitHub `main`, commit `b3bf0954681f47e2c19cf35594537a03572fab0b`, Next.js App Router 15, React 19, Tailwind. Místní původní kopie je starší a galerie neobsahuje; připravený zdroj je proto ve složce `dohody-release`. Původní soubory mimo tuto složku nebyly přepsány.

- `/pro-klienty`: dvě části pod sebou, galerie a dohody.
- `/pro-klienty/galerie`: existující ClientProofing, původní API, galerie, cookies a úložiště beze změny. Starší odkaz `/pro-klienty` vede na rozcestník, odkud je galerie dostupná jedním kliknutím. Nově kopírované pozvánky ke galerii používají přímou cestu.
- `/pro-klienty/dohody`: e-mail + heslo, individuální odkaz `?dohoda=<id>` pouze předvybírá dokument.
- `/administrace/galerie`: po přihlášení třetí záložka **Smlouvy a dohody**, přímo za **Galerie** a **Recenze a souhlasy**. Správa dohod je vložená do stejného pracovního prostoru bez další hlavičky a patičky.
- `/pro-klienty/dohody/sprava`: stávající serverové přihlášení `/api/proofing/admin/login`, stejná HttpOnly cookie a stejné administrátorské heslo. Není zaveden druhý účet ani nové heslo HANA_ADMIN_PASSWORD, protože aktuální web už vhodné přihlášení má.

## Databáze a konfigurace před spuštěním

Používá se stávající Supabase připojení z webu; podle dokumentace projektu jde o projekt `bwrnvlxsrquvxicjzfvu` (`supabase-violet-flower`). Žádný nový databázový projekt ani placená služba nejsou potřeba. Schéma přidává pouze `client_agreements`, `agreement_login_limits` a dvě RPC. Stávající tabulky a galerie se nemění.

1. Použít `supabase/agreements-schema.sql`. Obsahuje RLS, odebrání veřejných oprávnění a přístup pouze přes serverový service_role; zakládá první koncept Napoletano bez hesla a bez vymyšlených kontaktů. Opakované spuštění nevytváří další první koncept.
2. Spustit `supabase/agreements-verification.sql`: kontrola oprávnění, atomických revizí, neměnnosti potvrzeného znění a limitu přihlášení; všechna testovací data vrací ROLLBACK.
3. Ověřit existující serverové proměnné ve Vercelu: `SUPABASE_URL` (nebo současný URL fallback), `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY`, `PROOFING_ADMIN_PASSWORD` (alespoň 12 znaků), `PROOFING_SESSION_SECRET` (alespoň 32 znaků), `PROOFING_PUBLIC_URL` (ostrá HTTPS adresa), `RESEND_API_KEY`, `PROOFING_EMAIL_FROM` (případně `RESEND_FROM_EMAIL`, ověřená doména). Žádná z tajných hodnot nesmí mít prefix NEXT_PUBLIC_.
4. Nasadit kód na Vercel až po schématu a jeho ověření. Existující build skript před buildem spouští správu recenzí; lokálně byl přímo ověřen `next build`, bez zásahů do recenzí.
5. Přihlásit se do správy, otevřít Napoletano, doplnit jednající osobu/e-mail/telefon, uložit, vygenerovat heslo, případně zkopírovat a odeslat pozvánku. Žádná pozvánka skutečnému klientovi nebyla během vývoje odeslána.

## Hesla a relace

Server generuje 24 kryptograficky náhodných bajtů (192 bitů) a v databázi uchovává SHA-256 digest. Jde o neuhodnutelný strojově generovaný přístupový token, nikoliv lidské heslo s nízkou entropií. Heslo je pouze v jedné odpovědi serveru a dočasném React stavu správy, nikdy v localStorage, URL nebo logu. Při odchodu, obnovení, odhlášení nebo odeslání pozvánky se přestane zobrazovat.

Z hashe nelze zrekonstruovat heslo pro pozdější e-mail. Pozvánku lze odeslat s právě zobrazeným heslem; pro další pozvánku po opuštění stránky je nutné vygenerovat nové. Tím se ihned zneplatní staré heslo i staré klientské relace.

Klientská relace: HMAC, samostatná HttpOnly cookie, Secure v produkci, SameSite=Strict, 8 hodin. Každý přístup ověřuje ID a aktuální verzi přístupu z databáze. Administrace využívá současnou relaci (8 hodin). Změny chrání kontrola Origin. Přihlášení má atomické trvalé limity 8 pokusů/e-mail, 30/IP a 300 celkem za 15 minut, počítají se i úspěšné pokusy. Klíče limitů jsou hashe. Globální limit brání obcházení vymyšlenými hlavičkami; může ale dočasně omezit všechny klienty během útoku. Doplňkový WAF limit na Vercelu lze zavést podle návštěvnosti.

## Potvrzení, stav a doručování

Revize brání potvrzení starého znění i přepsání souběžných změn. Po odeslání se uloží celý text, všechny volby, jedinečné číslo, verze podmínek a serverový UTC okamžik; datum v dokumentu se formátuje Europe/Prague. Povinné volby začínají nezaškrtnuté, portfolio je samostatné a dobrovolné. E-mail vyplňujícího musí odpovídat přiřazenému přihlášení.

Potvrzený text i údaje stran jsou dále neměnné také v databázovém commit RPC. Stavy vyplněno a připraveno k podpisu se zapisují do historie atomicky. Podepsání označuje Hanka až po skutečném podpisu. Archivace zruší klientský přístup. Změna nepotvrzených podmínek uloží koncept a ruší starý přístup; je potřeba nové heslo a nová pozvánka.

Resend posílá kompletní přesné znění v těle e-mailu samostatně oběma stranám. Úspěch se eviduje pro každého příjemce, chybu lze ve správě zopakovat. Uložená dohoda nezávisí na úspěchu e-mailu; opakované klientské odeslání nevytváří druhou dohodu. Idempotency-Key omezuje duplicity v rámci platnosti idempotence Resendu; po delší nejednoznačné chybě transportu nelze vyloučit duplicitní e-mail, dokument zůstává jediný.

PDF příloha není implementována. Pro tisk i uložení do PDF se používá nativní tisk prohlížeče s českou diakritikou. E-maily obsahují úplný text bez přílohy. Dokumenty se neukládají na disk Vercelu.

## Ověření provedená při přípravě

- TypeScript bez chyb.
- `next build`: úspěšná kompilace, lint i generování všech 21 stránek, bez nových varování. Místní Node vyžadoval oficiální SWC WASM místo nativního modulu a internet pro již používaná písma; jde pouze o testovací prostředí, nikoli změnu produkční konfigurace.
- `node scripts/test-agreements.cjs`: izolované API testy (mock pouze Supabase transport a Resend): přístup správce, CSRF, validace, hash-only hesla, izolace dohod, cookies a falšování podpisu, rotace, revize, povinná potvrzení, snapshot, chyba e-mailu a opakování, idempotentní potvrzení, podpis, archivace, limit přihlášení a odhlášení.
- Prohlížeč: rozcestník, přechod do klientského přihlášení, správní přihlášení. Ověřen desktopový vzhled; samostatný mobilní screenshot ani tiskový dialog zatím neověřeny.
- Živé databázové schéma a skutečné doručování zatím neověřeny. Pokus o migraci přes nástroj Supabase skončil vypršením jeho potvrzení, následný readback potvrdil, že nové tabulky nevznikly. Pro nasazení je třeba znovu potvrdit databázovou migraci, spustit její SQL testy a dokončit Vercel nasazení.

Technické podklady: https://supabase.com/docs/guides/database/postgres/row-level-security a https://resend.com/docs/api-reference/emails/send-email.
