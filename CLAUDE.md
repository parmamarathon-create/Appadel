# CLAUDE.md – convenzioni del progetto Appadel

## Cos'è
Web app statica per consultare esercizi di padel. Nessun framework, nessun
build, nessun server: `index.html`, `style.css`, `app.js` più i dati in
`esercizi_padel.json`.

## Regole fondamentali
- **Non modificare `esercizi_padel.json`.** È la fonte dei dati; l'app lo
  legge soltanto. Se i dati sembrano sbagliati, segnalarlo invece di
  correggerli.
- Solo HTML, CSS e JavaScript puro. Niente librerie, CDN, npm, bundler o
  passaggi di build.
- Tutto il testo visibile all'utente è in **italiano**.
- I nomi di variabili, funzioni e classi CSS sono in italiano
  (es. `selTipo`, `creaScheda`, `.scheda`), coerenti con quelli esistenti.

## Dati
- Struttura: `{ "parametri": {...}, "volumi": {...}, "esercizi": [...] }`.
- Le opzioni dei menu e le loro etichette vengono **sempre** da `parametri`
  (`giocatori`, `tipi`, `livelli`), nell'ordine del JSON. Non scrivere liste
  fisse nel codice.
- `parametri.definizioni_tipi` contiene spiegazioni solo per alcuni tipi.
- Campi di un esercizio usati dall'interfaccia: `id`, `volume`, `titolo`,
  `giocatori`, `tipi`, `livelli`, `obiettivo`, `disposizione`, `esecuzione`,
  `varianti` (può essere vuota), `schema` (può essere `null`). Gli altri campi
  (es. `extra`, `nota_classificazione`) non sono mostrati.

## Filtro
- `giocatori` uguale al valore scelto; tipo scelto contenuto in `tipi`;
  livello scelto contenuto in `livelli`. Valore vuoto («Tutti») = nessun
  filtro. Risultati ordinati per `id`.

## Stile e accessibilità
- Mobile first: controlli alti almeno 48 px, testo base ~17 px.
- Colori solo tramite variabili CSS in `:root`, ridefinite in
  `@media (prefers-color-scheme: dark)`.
- Inserire i testi dei dati sempre con `textContent`, mai con `innerHTML`.
- Lo schema va in un `<pre>` con `white-space: pre` e `overflow-x: auto`.

## Prova locale
`python3 -m http.server 8000` e apri `http://localhost:8000`
(con `file://` il `fetch` del JSON non funziona).

## Pubblicazione
`.github/workflows/pages.yml` pubblica su GitHub Pages a ogni push su `main`.
Se si aggiunge un nuovo file del sito, aggiungerlo anche al passo
«Prepara la cartella del sito» del workflow.
