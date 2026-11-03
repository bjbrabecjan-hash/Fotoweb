# Supabase — ověření 19. října 2026

## Oprava testovacího e-mailu

Oprava nasazena v `dpl_GVyTfFLynLWHdNQL9iaFu3MNiBfG` (`fotoweb-ah8xy5o51-bjbrabecjan-hashs-projects.vercel.app`). Sledování buildu CLI skončilo přechodným „Not authorized“, ale následný `vercel inspect` potvrdil stav `Ready` a alias `hana-brabcova.vercel.app`. Test skutečného e-mailu po opravě nebyl spuštěn.

Produkční log ukázal požadavek `POST /api/proofing/admin/test-email` po úspěšném načtení administrace a fotografií. Kontrola kódu odhalila chybu: endpoint předával `admin-test-email` do RPC, které povoluje pouze `admin` a `client`. Oprava používá existující limit `admin` (sdílený s přihlášením, 20 pokusů za 15 minut). Parametry obou limitovacích funkcí jsou nově omezené TypeScriptem na tyto dvě role. Testovací Supabase server odmítá neplatné role stejně jako SQL schéma. Typecheck, Supabase kontrakty i lokální HTTP integrační testy prošly. Změna databázového schématu ani klíčů není potřeba. Skutečné doručení e-mailu zůstává k ověření po nasazení.

## Příjemce e-mailových upozornění

Nasazení s Resend klíčem a testovacím tlačítkem dokončeno: `fotoweb-2fub6qvzw-bjbrabecjan-hashs-projects.vercel.app`, alias `https://hana-brabcova.vercel.app`, CLI exit 0. Produkční build včetně typů a lintu prošel. Doručení e-mailu dosud nepotvrzeno.

Aktualizace: po potvrzení uživatelem byla přes metadata Vercelu ověřena přítomnost `RESEND_API_KEY` typu `sensitive` pro `production`. Pro `preview` klíč uložený není; preview tedy e-mail neodesílá. Hodnota klíče nebyla čtena ani vypsána. Vercel ji nezpřístupnil lokálnímu `env run`; test skutečného odeslání proto nebyl spuštěn z lokálního počítače. Administrace nově nabízí tlačítko „Poslat testovací e-mail“, chráněné přihlášením, kontrolou Origin a sdíleným limitem požadavků. Zpráva je označená jako test a nemění klientské galerie. Úspěšná odpověď značí převzetí Resendem, nikoli ověřené doručení. Typecheck a lokální integrační testy včetně odmítnutí anonymního/cizího Origin požadavku a chybějící konfigurace prošly. Skutečné odeslání a doručení zbývá potvrdit přes toto tlačítko po nasazení.

Uživatel určil příjemce `fotohanabrabcova@gmail.com` a potvrdil založení Resend účtu pod touto adresou. Pro produkci a preview je nastavena proměnná `PROOFING_EMAIL_TO` na tuto adresu a `PROOFING_EMAIL_FROM` na `Hana Brabcová <onboarding@resend.dev>`. Jde o testovací doménu Resend: dovoluje pouze doručení na adresu vlastníka účtu, nikoli obecné produkční odesílání. Odesílání nadále čeká na `RESEND_API_KEY`, který je potřeba uložit jako citlivou proměnnou přímo na Vercelu. E-mail nebyl odeslán. Nové proměnné prostředí se projeví až v následujícím nasazení; nasazení proběhne po doplnění klíče. Pro běžného produkčního odesílatele je potřeba ověřit vlastní doménu v Resendu a změnit `PROOFING_EMAIL_FROM`.

## Produkční nasazení na výslovný pokyn uživatele

Po následném požadavku „Nasaď na web“ byly doplněny chybějící produkční proměnné `PROOFING_STORAGE`, `PROOFING_PUBLIC_URL`, `PROOFING_ADMIN_PASSWORD` a `PROOFING_SESSION_SECRET`, všechny typu `sensitive`. Existující produkční Supabase proměnné byly předem ověřeny. Produkční heslo je oddělené od preview a uložené pouze v `.env.proofing-production-admin` (0600, Git ignore a `.vercelignore` ověřeny). Žádná hodnota nebyla vypsána do konverzace.

`vercel deploy --prod --yes --archive=tgz` sestavil stejné ověřené aplikační zdroje a potvrdil `Deployment completed` a `Aliased: https://hana-brabcova.vercel.app`. Build prošel kompilací, lintem, typy a vytvořením rout. Dříve popsaná upozornění lockfilu zůstala neblokující.

- Hlavní web: https://hana-brabcova.vercel.app
- Klientská galerie: https://hana-brabcova.vercel.app/pro-klienty
- Administrace: https://hana-brabcova.vercel.app/administrace/galerie
- Konkrétní produkční nasazení: https://fotoweb-j9hipshh5-bjbrabecjan-hashs-projects.vercel.app
- Detail: https://vercel.com/bjbrabecjan-hashs-projects/fotoweb/FauNCtbwhjhybnP7jXgL1EY5Xvbv

Nasazení a alias potvrzuje Vercel CLI. Živý průchod produkčním UI, cloudový upload snímku a skutečné doručení e-mailu nebyly tímto krokem ověřeny. Resend zůstává nenastavený. Níže uvedené odstavce o nepřepnuté produkční doméně a chybějících produkčních údajích zachycují dřívější preview checkpoint; tento odstavec je aktualizuje.

## Skutečně připojeno

- Použit uživatelem zvolený existující projekt `supabase-violet-flower`, ref `bwrnvlxsrquvxicjzfvu`, stávající region `us-east-1`. Byl obnoven z `INACTIVE` do `ACTIVE_HEALTHY`. Organizace je na tarifu Free; nový projekt ani placená větev nevznikly.
- Existující Vercel prostředek `store_GDPf93Il8UX7f2OK` byl připojen k projektu `fotoweb` (`prj_jCMFDrAzMyh4q1i2Vn11HET756D8`). API a CLI readback potvrdily toto konkrétní propojení.
- Proměnné nativního propojení Supabase jsou typu `sensitive` pro `production` a `preview`. Jejich hodnoty nebyly vypsány ani kopírovány do zdrojů.
- Aplikační `PROOFING_STORAGE`, náhodné `PROOFING_ADMIN_PASSWORD` a `PROOFING_SESSION_SECRET` byly doplněny výhradně pro **preview**, všechny jako `sensitive`. Produkční přihlašovací údaje galerie nevznikly. Preview heslo je v `.env.proofing-preview-admin` (0600, ověřeno ignorování Gitem i vyloučení z Vercel uploadu).
- Aplikována migrace `photo_proofing_galleries`: dvě vlastní tabulky, dvě RPC funkce, privátní bucket a restriktivní přístupová politika pro tento nový bucket. Bootstrap zdroj je v `supabase/proofing-schema.sql`.

## Živé databázové ověření

Readback přes připojený Supabase vrátil:

| Kontrola | Výsledek |
| --- | --- |
| RLS galerie / přihlašovací limity | `true` / `true` |
| Přímý SELECT galerie pro `anon` / `authenticated` | `false` / `false` |
| Spuštění commit RPC pro `anon` | `false` |
| Spuštění commit RPC pro `service_role` | `true` |
| Commit funkce používá SECURITY DEFINER | `false` |
| Bucket je soukromý | `true` |
| Velikostní limit objektu | `3145728` bytů |
| Restriktivní politika nového bucketu | přítomná pro `anon` a `authenticated` |

V transakci pod `SET LOCAL ROLE service_role` byl vytvořen vlastní testovací záznam, následně aktualizován s verzí 1. Opakovaný zápis se stejnou zastaralou verzí byl odmítnut. Readback ověřil uloženou poznámku a verzi 2. Ověřena také inicializace přihlašovacího limitu. Test skončil explicitním `ROLLBACK`; následná kontrola potvrdila **0 alb a 0 přihlašovacích limitů**. Žádné zákaznické údaje nebyly použity ani měněny.

## Lokální technické kontroly

- `test:proofing`: PASS. Skutečné HTTP API, vytvoření alba, soukromé obrázky, izolace klientů, ukládání, konflikty, potvrzení, uzamčení, restart, revokace kódu, uzavření, CSRF a odhlášení. Používá izolovaný diskový adaptér.
- `test:proofing:supabase`: PASS. REST/Storage kontrakty, cílené dotazy, stránkování, souběžné aktualizace, opakování po konfliktu, nejasný výsledek commitu, odmítnutí veřejného bucketu, klíče i diskového režimu na Vercelu. Tento test používá náhradní HTTP transport, **nejde o skutečný upload do Supabase Storage**.
- Produkční build po změně adaptéru: PASS, včetně TypeScriptu a lintu. Použity stejné uzamčené závislosti v izolované kopii kvůli iCloud zástupným souborům v původních `node_modules`. Nové produkční závislosti nebyly přidány.

## Kontrola sdíleného projektu

Supabase security advisors hlásí pro nové tabulky pouze informační `RLS Enabled No Policy`: klientské role nemají tabulková práva a server používá `service_role`, což je záměrný model. Živá kontrola výše potvrzuje jejich nepřístupnost klientům.

Ve starších objektech sdílené databáze advisors zároveň našel 12 tabulek bez RLS, jednu funkci s měnitelným search path a vypnutou kontrolu kompromitovaných hesel Supabase Auth. Jde o existující objekty jiných aplikací, nikoli o nové galerie. Jejich obsah nebyl čten a jejich chování nebylo měněno. Doporučená samostatná kontrola: [RLS v public schématu](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public), [search path funkcí](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable).

## Preview nasazení

Vercel CLI potvrdilo úspěšný cloudový build a dokončené nasazení:

- Preview: https://fotoweb-84co3ctlc-bjbrabecjan-hashs-projects.vercel.app
- Klientský vstup: https://fotoweb-84co3ctlc-bjbrabecjan-hashs-projects.vercel.app/pro-klienty
- Administrace: https://fotoweb-84co3ctlc-bjbrabecjan-hashs-projects.vercel.app/administrace/galerie
- Build detail: https://vercel.com/bjbrabecjan-hashs-projects/fotoweb/5GquKATtauHrYn2XWMWV2ihNdZZV

Původní jednotlivý upload se zastavil; opakování přes podporovaný `vercel deploy --yes --archive=tgz` dokončilo upload i build s exit 0. Cloudový build prošel kompilací, lintem, typy, generováním stránek a vytvořením serverless funkcí. Hlásil existující upozornění o SWC závislostech lockfilu a instalačních skriptech; nasazení přesto skončilo úspěšně. Stav dokládá výstup Vercel CLI, nikoli následný průchod nasazeným UI nebo skutečné nahrání fotografie. Produkční doména zůstala na předchozím nasazení.

## Zbývající ověření

E-mailový transport Resend zatím není nakonfigurován. Skutečné doručení e-mailu ani živé nahrání fotografie do cloudového Storage nejsou těmito testy potvrzené. Produkční doména nebyla tímto krokem aktualizována. Pro ostrý přístup je potřeba samostatně nastavit produkční administrátorské údaje, odesílatele a veřejnou URL a poté schválit produkční nasazení. Preview používá stejný zvolený Supabase projekt; slouží k vyzkoušení ukázkových dat.
