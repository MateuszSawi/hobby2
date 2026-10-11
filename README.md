# A date? - Next.js + Supabase

Prosta strona-zaproszenie na randke: 5 slajdow, odpowiedzi zapisywane w Supabase.
Stack: Next.js 15 (App Router), czysty JavaScript, SCSS Modules.

## Start

    npm install
    npm run dev          # http://localhost:3000

W .env (commitowany, klucz anon jest publiczny) sa:

    NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

## Baza

W Supabase -> SQL Editor uruchom supabase/migrations/0001_date_responses.sql.
Tworzy tabele date_responses z polityka RLS pozwalajaca kluczowi anon czytac,
zapisywac i usuwac (aplikacja nie ma logowania).

## Strony

- /            - zaproszenie (slajdy). W bazie jest zawsze jeden wiersz o stalym id,
                 nadpisywany po kazdym kroku. Czyszczenie tylko z /admin.
- /admin       - jej wybory wypisane pod sobą + przycisk "Wyczyść" (zaczyna od zera).

## Struktura

    src/
      app/
        layout.js                 # fonty Google (Cormorant Garamond, Parisienne), globals.scss
        page.js                   # strona glowna -> DateInvite
        admin/                    # lista wyborow + czyszczenie (server action)
      components/DateInvite/      # logika slajdow + style
      lib/supabase/client.js      # klient do komponentow 'use client'
      lib/supabase/server.js      # klient do Server Components / Actions
      styles/                     # globals, _variables (paleta bezowa), _mixins
    supabase/migrations/          # SQL

## Edycja tresci

Teksty slajdow i opcje sa na gorze src/components/DateInvite/DateInvite.js
(stale DAYS, VIBES, PLACE_OPTION oraz tekst slajdu 5).
