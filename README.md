# Appadel

Web app statica, in italiano, per consultare gli esercizi (drill) di padel.
Funziona interamente nel browser: solo HTML, CSS e JavaScript puro, senza
framework, senza dipendenze e senza server applicativo.

## Funzionalità

- Tre menu a tendina: **Numero giocatori**, **Tipo di esercizio**, **Livello**,
  ognuno con l'opzione «Tutti». Opzioni ed etichette sono lette da
  `parametri` nel file JSON, nell'ordine in cui compaiono.
- Sotto il menu del tipo compare una breve spiegazione quando il tipo scelto
  ha una voce in `parametri.definizioni_tipi`.
- Conteggio dei risultati e schede ordinate per numero di drill, con titolo,
  volume, etichette (giocatori, livelli, tipi), obiettivo, disposizione,
  esecuzione, varianti e schema del campo (a larghezza fissa, scorrevole in
  orizzontale).
- Messaggio chiaro quando nessun esercizio corrisponde ai filtri.
- Pensata per il telefono, con tema chiaro o scuro automatico in base alle
  impostazioni del dispositivo.

### Regole del filtro

Un esercizio viene mostrato se:

- `giocatori` è uguale al numero scelto;
- il tipo scelto è contenuto nella lista `tipi`;
- il livello scelto è contenuto nella lista `livelli`.

«Tutti» non applica alcun filtro su quel menu.

## File del progetto

| File | Contenuto |
| --- | --- |
| `index.html` | Struttura della pagina |
| `style.css` | Stile, layout per telefono, tema chiaro/scuro |
| `app.js` | Caricamento del JSON, menu, filtro, schede |
| `esercizi_padel.json` | Dati degli esercizi (sorgente, non va modificato dall'app) |
| `.github/workflows/pages.yml` | Pubblicazione automatica su GitHub Pages |

## Provarla sul computer

Il browser non permette di leggere il JSON aprendo `index.html` con un doppio
clic (indirizzo `file://`). Serve un piccolo server locale, per esempio:

```bash
python3 -m http.server 8000
```

Poi apri <http://localhost:8000> nel browser.

## Pubblicazione

A ogni push sul branch `main` il workflow GitHub Actions copia i file del sito
e li pubblica su GitHub Pages. Si può avviare anche a mano dalla scheda
**Actions** → «Pubblica su GitHub Pages» → **Run workflow**.

L'indirizzo sarà del tipo `https://<utente>.github.io/<repository>/`.
