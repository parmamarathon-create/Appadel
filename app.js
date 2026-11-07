"use strict";

(function () {
  var FILE_DATI = "esercizi_padel.json";

  var selGiocatori = document.getElementById("filtro-giocatori");
  var selTipo = document.getElementById("filtro-tipo");
  var selLivello = document.getElementById("filtro-livello");
  var definizioneTipo = document.getElementById("definizione-tipo");
  var form = document.getElementById("filtri");
  var pulsanteAzzera = document.getElementById("azzera");
  var conteggio = document.getElementById("conteggio");
  var vuoto = document.getElementById("vuoto");
  var elenco = document.getElementById("elenco");
  var piede = document.getElementById("piede");

  var dati = null;

  /* ---------- Utilità ---------- */

  // Crea un elemento con classe e testo opzionali (testo sempre via textContent).
  function crea(tag, classe, testo) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (testo !== undefined && testo !== null) el.textContent = testo;
    return el;
  }

  function aggiungiOpzione(select, valore, etichetta) {
    var opt = document.createElement("option");
    opt.value = String(valore);
    opt.textContent = etichetta;
    select.appendChild(opt);
  }

  function etichettaGiocatori(n) {
    return n === 1 ? "1 giocatore" : n + " giocatori";
  }

  function etichettaDa(mappa, chiave) {
    return (mappa && mappa[chiave]) || chiave;
  }

  /* ---------- Menu ---------- */

  function popolaMenu(parametri) {
    (parametri.giocatori || []).forEach(function (n) {
      aggiungiOpzione(selGiocatori, n, etichettaGiocatori(n));
    });
    Object.keys(parametri.tipi || {}).forEach(function (chiave) {
      aggiungiOpzione(selTipo, chiave, parametri.tipi[chiave]);
    });
    Object.keys(parametri.livelli || {}).forEach(function (chiave) {
      aggiungiOpzione(selLivello, chiave, parametri.livelli[chiave]);
    });

    [selGiocatori, selTipo, selLivello, pulsanteAzzera].forEach(function (el) {
      el.disabled = false;
    });
  }

  function aggiornaDefinizione() {
    var definizioni = dati.parametri.definizioni_tipi || {};
    var testo = selTipo.value ? definizioni[selTipo.value] : "";
    if (testo) {
      definizioneTipo.textContent = testo;
      definizioneTipo.hidden = false;
    } else {
      definizioneTipo.textContent = "";
      definizioneTipo.hidden = true;
    }
  }

  /* ---------- Filtro ---------- */

  function filtra() {
    var giocatori = selGiocatori.value;
    var tipo = selTipo.value;
    var livello = selLivello.value;

    return dati.esercizi
      .filter(function (es) {
        if (giocatori && es.giocatori !== Number(giocatori)) return false;
        if (tipo && (es.tipi || []).indexOf(tipo) === -1) return false;
        if (livello && (es.livelli || []).indexOf(livello) === -1) return false;
        return true;
      })
      .sort(function (a, b) {
        return a.id - b.id;
      });
  }

  /* ---------- Schede ---------- */

  function sezioneTesto(titolo, testo) {
    var frammento = document.createDocumentFragment();
    frammento.appendChild(crea("h3", null, titolo));
    frammento.appendChild(crea("p", null, testo));
    return frammento;
  }

  function sezioneRighe(titolo, righe) {
    var frammento = document.createDocumentFragment();
    frammento.appendChild(crea("h3", null, titolo));
    var ul = crea("ul", "righe");
    righe.forEach(function (riga) {
      ul.appendChild(crea("li", null, riga));
    });
    frammento.appendChild(ul);
    return frammento;
  }

  function creaScheda(es) {
    var p = dati.parametri;
    var li = crea("li", "scheda");
    li.id = "drill-" + es.id;

    li.appendChild(crea("h2", null, "Drill " + es.id + " – " + es.titolo));
    li.appendChild(crea("p", "scheda-meta", "Volume " + es.volume));

    var etichette = crea("ul", "etichette");
    etichette.setAttribute("aria-label", "Etichette");
    var chipG = crea("li", "chip chip-giocatori", etichettaGiocatori(es.giocatori));
    etichette.appendChild(chipG);
    (es.livelli || []).forEach(function (l) {
      etichette.appendChild(crea("li", "chip chip-livello", etichettaDa(p.livelli, l)));
    });
    (es.tipi || []).forEach(function (t) {
      etichette.appendChild(crea("li", "chip chip-tipo", etichettaDa(p.tipi, t)));
    });
    li.appendChild(etichette);

    if (es.obiettivo) li.appendChild(sezioneTesto("Obiettivo", es.obiettivo));
    if (es.disposizione) li.appendChild(sezioneTesto("Disposizione", es.disposizione));
    if (es.esecuzione && es.esecuzione.length) {
      li.appendChild(sezioneRighe("Esecuzione", es.esecuzione));
    }
    if (es.varianti && es.varianti.length) {
      li.appendChild(sezioneRighe("Varianti", es.varianti));
    }
    if (es.schema) {
      li.appendChild(crea("h3", null, "Schema"));
      var pre = crea("pre", "schema", es.schema);
      pre.tabIndex = 0; // permette lo scorrimento orizzontale da tastiera
      pre.setAttribute("aria-label", "Schema del drill " + es.id);
      li.appendChild(pre);
    }

    return li;
  }

  function mostra() {
    var risultati = filtra();

    conteggio.textContent =
      risultati.length === 1
        ? "1 esercizio trovato"
        : risultati.length + " esercizi trovati";

    vuoto.hidden = risultati.length !== 0;

    var frammento = document.createDocumentFragment();
    risultati.forEach(function (es) {
      frammento.appendChild(creaScheda(es));
    });
    elenco.replaceChildren(frammento);
  }

  function aggiorna() {
    aggiornaDefinizione();
    mostra();
  }

  /* ---------- Avvio ---------- */

  function mostraPiede(volumi) {
    if (!volumi) return;
    var righe = Object.keys(volumi).map(function (k) {
      return "Volume " + k + ": " + volumi[k];
    });
    piede.textContent = "Fonti — " + righe.join(" · ");
  }

  function mostraErrore() {
    conteggio.textContent = "";
    var box = crea(
      "div",
      "errore",
      "Impossibile caricare gli esercizi. Se hai aperto il file direttamente dal computer, " +
        "avvia un piccolo server locale (vedi README) oppure usa la versione pubblicata."
    );
    box.setAttribute("role", "alert");
    elenco.replaceChildren(box);
  }

  [selGiocatori, selTipo, selLivello].forEach(function (sel) {
    sel.addEventListener("change", aggiorna);
  });

  // Il reset del form avviene dopo l'evento: aggiorniamo al giro successivo.
  form.addEventListener("reset", function () {
    setTimeout(aggiorna, 0);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  fetch(FILE_DATI, { cache: "no-cache" })
    .then(function (risposta) {
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      return risposta.json();
    })
    .then(function (json) {
      dati = {
        parametri: json.parametri || {},
        volumi: json.volumi || {},
        esercizi: Array.isArray(json.esercizi) ? json.esercizi : []
      };
      popolaMenu(dati.parametri);
      mostraPiede(dati.volumi);
      aggiorna();
    })
    .catch(function (err) {
      console.error(err);
      mostraErrore();
    });
})();
