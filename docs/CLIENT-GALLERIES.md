# Klientské galerie — první verze

## Hotové funkce

- `/pro-klienty`: přístup dlouhým náhodným kódem, soukromé náhledy, zvětšení, výběr srdíčkem, poznámka, uložení a potvrzení výběru.
- `/administrace/galerie`: přihlášení heslem, zakládání galerií, dávkové nahrávání, přístupové kódy, přehled výběrů, export původních názvů, opětovné otevření odeslaného výběru a trvalé uzavření galerie.
- Před odesláním souboru se v prohlížeči vytvoří JPEG do 1800 px s vodoznakem. Server nedostává originál. Podporované vstupy: JPEG, PNG, WebP, do 30 MB. Nejvýše 500 fotografií v galerii. Původní názvy souborů musí být v albu jedinečné.
- Výběr každé fotografie se ukládá na server ihned. Poznámka se ukládá při opuštění pole (kromě přechodu na tlačítko), při změně výběru fotografií a při potvrzení. Při neuložené poznámce prohlížeč upozorní na zavření stránky. Před zavřením stránky počkejte na „Uloženo“. Konflikt dvou otevřených oken vrátí chybu s výzvou k obnovení; nepřepíše novější výběr.
- Přístupový kód se zobrazuje pouze při vytvoření nebo obnovení. V úložišti je jeho hash. Obnovení kódu odhlásí dřívějšího klienta; uzavření galerie zruší jeho přístup včetně snímků.
- Výběr se uloží před pokusem o e-mail. Chyba e-mailu neztratí výběr. Administrace rozlišuje nenastavený transport, čekající pokus, chybu a přijetí e-mailovou službou. Přijetí službou neprokazuje doručení do schránky. Opakování se provádí tlačítkem v administraci, nejde o běžící frontu s automatickými opakováními.

## Lokální spuštění

1. Zkopírujte `.env.example` do `.env.local`.
2. Vyplňte vlastní `PROOFING_ADMIN_PASSWORD` (nejméně 12 znaků) a náhodný `PROOFING_SESSION_SECRET` (nejméně 32 znaků). Pro cloud nastavte `PROOFING_STORAGE=supabase`, `SUPABASE_URL` a serverový `SUPABASE_SECRET_KEY`. Pro vývoj bez internetu nastavte `PROOFING_STORAGE=disk`. Tajné údaje nepatří do Gitu ani do `NEXT_PUBLIC_*`.
3. Spusťte `npm run dev`. Otevřete `/administrace/galerie`, založte galerii a nahrajte fotky. V jiné relaci prohlížeče otevřete `/pro-klienty` a zadejte vygenerovaný kód.
4. Volitelně nastavte Resend: `RESEND_API_KEY`, odesílatele s ověřenou doménou `PROOFING_EMAIL_FROM`, adresu Hanky `PROOFING_EMAIL_TO` a správnou veřejnou adresu webu `PROOFING_PUBLIC_URL`. Bez toho e-maily neodcházejí. Transport používá přímo HTTPS API, bez nové závislosti: https://resend.com/docs/api-reference/emails/send-email

## Supabase a Vercel

Používá se existující projekt `supabase-violet-flower` (`bwrnvlxsrquvxicjzfvu`, stávající region `us-east-1`). Projekt byl obnoven z neaktivního stavu a připojen k existujícímu projektu Vercel `fotoweb`. Nejde o nově založenou databázi ani o změnu tarifu. Nativní propojení dodává proměnné Supabase jako citlivé pro produkci a preview.

Databázové objekty jsou oddělené prefixem `photo_proofing_`. `photo_proofing_albums` ukládá jeden dokument JSONB na galerii, včetně výběru a metadat náhledů; `storage_version` zajišťuje atomický zápis pomocí RPC s kontrolou původní verze. Dotazy klienta načítají pouze jeho album. Seznam administrace je stránkovaný při čtení z REST API. Jde o první verzi pro menší fotografický provoz, nikoli obecný archiv velkých objemů.

Náhledy jsou v soukromém bucketu `client-proofing-previews`. Bucket přijímá pouze JPEG do 3 MB. Prohlížeč dostává obrázky výhradně přes autorizované API webu s `private, no-store`, nikoli veřejné nebo dlouhodobě podepsané odkazy. RLS a odebraná práva brání přímému přístupu rolí `anon` a `authenticated` k tabulkám a RPC. Restriktivní politika navíc izoluje nový bucket od případných širších politik ostatních aplikací ve sdíleném projektu. Serverový klíč není v klientském kódu.

Schéma pro případné další prostředí je v `supabase/proofing-schema.sql`. V tomto projektu je již aplikované migrací `photo_proofing_galleries`; nespouštějte bootstrap opakovaně. Vyžaduje existující Supabase Storage a vytvoří pouze objekty pro galerie a jejich přístupovou politiku. Před další změnou kontrolujte kolize názvů a historii migrací.

Preview má vlastní náhodné administrátorské heslo a session secret, nastavené jako citlivé pouze pro prostředí `preview`. Heslo je pro vlastníka uložené v ignorovaném souboru `.env.proofing-preview-admin` s právy 0600. Tento soubor není standardní `.env.local`, automaticky se do lokální aplikace nenačítá a nesmí se zveřejnit. Produkční administrátorské přihlašovací údaje zatím vytvořené nejsou; před ostrým nasazením je nastavte samostatně ve Vercelu. Preview používá stejný zvolený Supabase projekt, proto se v něm mají zkoušet pouze ukázková data.

Na Vercelu aplikace automaticky vyžaduje Supabase. Chybějící konfigurace vede k chybě 503; nedojde k ukládání na dočasný disk. Podporovaný je nový `SUPABASE_SECRET_KEY` i starší serverový `SUPABASE_SERVICE_ROLE_KEY`; URL může pocházet také z `NEXT_PUBLIC_SUPABASE_URL`. Veřejný publishable/anon klíč se pro serverové úložiště odmítne ještě před požadavkem.

Přihlašování má sdílený atomický limit v Postgresu (20 administrátorských a 100 klientských pokusů za 15 minut). Před ostrým provozem nastavte HTTPS, správnou veřejnou URL, omezení na důvěryhodném proxy podle IP a zálohy databáze i Storage souborů. Kdokoli s klientským kódem má přístup k danému albu. Automatické smazání expirovaných fotek ani obnova uzavřených alb v této verzi nejsou. Vodoznak a menší rozlišení nebrání snímku obrazovky.

Pokud po nahrání objektu nastane nejasný výsledek databázového zápisu (např. timeout po úspěšném commitu), aplikace objekt automaticky nemaže, aby nepoškodila již uloženou galerii. Může zůstat soukromý osiřelý náhled pro pozdější úklid; bez metadata záznamu ho klientské API nezpřístupní.

## Diskový vývojový režim

`PROOFING_STORAGE=disk` je určený pro offline vývoj nebo izolované testy. Data jsou v `.proofing-data/`, mimo `public/` a Git. JSON zápisy používají atomické přejmenování a adresářový zámek. Zálohujte celou složku při zastaveném serveru. Zámek po tvrdém pádu odstraňujte pouze po zastavení všech procesů používajících úložiště. Diskový režim se na Vercelu výslovně odmítne. Lokální ukázkové galerie se automaticky nekopírují do sdíleného cloudu.

## Ověření

`npm run typecheck` ověří TypeScript. `npm run test:proofing` sám spustí Next na volném lokálním portu s dočasným úložištěm a náhodným testovacím heslem. Ověří skutečné API, přístup k souborům, oddělení alb, uložení, konflikt změn, uzamčení výběru, změnu kódu, uzavření galerie a odhlášení. Server také restartuje a ověří přetrvání dat. Testy nepoužívají reálnou poštu ani zákaznické fotografie.

`npm run test:proofing:supabase` ověřuje kontrakty REST/Storage proti náhradnímu HTTP transportu, včetně souběžných zápisů, opakování po konfliktu, nejasného výsledku commitu, stránkování a odmítnutí veřejného bucketu nebo nesprávného klíče. Tento test není živý upload do Supabase. Živý SQL test RPC, kontrola oprávnění a stav nasazení jsou popsány v `CLIENT-GALLERIES-VERIFICATION.md`.
# Smazání galerie

V detailu galerie je pod fotografiemi tlačítko „Smazat galerii“. Vyžaduje opsání názvu a trvale maže náhledy i záznam galerie včetně výběru a vzkazu. Nejdříve zneplatní klientský přístup, poté odstraní soubory a nakonec databázový záznam. Při selhání úklidu zůstane uzavřená galerie dostupná správci pro opakování. Supabase maže záznam podmíněně podle verze, aby souběžná změna nebyla ignorována. Žádné existující zákaznické galerie nebyly při ověřování smazány.

Ověření: TypeScript, lokální HTTP test s fyzickou kontrolou odstranění JPEG, zachováním jiné galerie, restartem, zrušením kódu a ochranou přihlášení/Origin; Supabase kontraktní test s odstraněním objektů i řádku a opakováním po výpadku úložiště. Skutečné mazání v produkčním Supabase nebylo spuštěno.

