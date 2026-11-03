# Dotazník po focení

Stránka `/dotaznik` je určená ke sdílení odkazem s klienty. Není v hlavním menu a má zakázané indexování. Nejde o chráněný přístup: odesílatel uvádí vlastní jméno bez ověření totožnosti.

Jméno a obě volby ano/ne jsou povinné, bez předvybrané odpovědi. Označení focení a recenze jsou nepovinné. Souhlas s fotografiemi a souhlas s recenzí se jménem jsou nezávislé a znění obou se posílá spolu s odpovědí. Fotografie ani recenze se automaticky nezveřejňují. Formulář není náhradou souhlasů dalších vyobrazených osob.

## Doručení

Endpoint `/api/feedback` používá existující serverové proměnné `RESEND_API_KEY`, `PROOFING_EMAIL_FROM` a `PROOFING_EMAIL_TO`. Klíč se nikdy neposílá do prohlížeče. Úspěch se zobrazí teprve po přijetí e-mailu poskytovatelem; přijetí API není důkaz doručení do schránky. Bez konfigurace vrací 503. Při selhání zůstávají údaje ve formuláři. Odpovědi se neukládají do databáze ani do galerie, cílovým záznamem je e-mail.

Opakování stejné odpovědi na stejné otevřené stránce používá shodný Resend idempotency key i obsah. Čas vyplnění pochází ze zařízení klienta, není ověřeným serverovým časem. Datum přijetí má rovněž e-mailová služba. Změna obsahu vytváří novou odpověď.

Endpoint kontroluje origin, formát, velikost těla a délky polí. Má honeypot a omezení 10 pokusů za 10 minut na instanci a ověřenou Vercel IP. Toto omezení není sdílené mezi instancemi; pro větší provoz je vhodné doplnit limit na hostingu.

## Ověření

`npm run test:feedback` prověřuje skutečný handler s náhradou mailové služby: oddělené souhlasy, chybné vstupy, cizí origin, velikost, chybějící konfiguraci, shodné opakování, selhání služby a limit. Test neposílá skutečný e-mail. Dále `npm run typecheck` a `npm run build`.

Stav 2026-11-03: test handleru prošel. Lokální build skončil na `ETIMEDOUT` při čtení závislostí; lokální typová kontrola hlásila nedostupné soubory závislostí. V dočasné čisté kopii jedna typová kontrola prošla, úplný build a vizuální QA zatím nejsou potvrzené. Resend klíč je podle `vercel env ls` dostupný pouze v Production; skutečné doručení nebylo testováno. Nasazení náhledu zamítla automatická kontrola oprávnění kvůli chybějícímu explicitnímu souhlasu s uploadem zdrojů na Vercel. Na ostrém webu dotazník zatím není nasazený.
