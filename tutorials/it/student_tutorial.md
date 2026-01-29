# Tutorial Student - Guida Completa per Studenti

## Introduzione

Benvenuto in **Codify**, la piattaforma di coding gamificato! Questa guida ti accompagnerà attraverso tutte le funzionalità per partecipare alle gare di programmazione e migliorare le tue competenze.

---

## Prerequisiti

Prima di iniziare, assicurati che:
- Accesso all'URL: `http://localhost:3000`
- Il tuo docente abbia creato una Game Session disponibile

---

## 1. Login come Student

### Passo 1.1: Accedi alla pagina di login
1. Apri il browser e vai su `http://localhost:3000/login`
2. Vedrai la schermata di login di Codify con il logo e il motto "Master the Code. Dominate the Leaderboard."

### Passo 1.2: Effettua il login
**In modalità sviluppo:**
1. Scorri verso il basso fino alla sezione "Developer Access (DEV MODE ONLY)"
2. Clicca sul pulsante **" Login as Student (Dev)"**
3. Verrai automaticamente autenticato come studente e reindirizzato alla Home


---

## 2. Home Page - Dashboard Studente

Dopo il login, vedrai la home page con le seguenti opzioni:

| Card | Colore | Descrizione |
|------|--------|-------------|
| **Join Game Sessions** | Rosa | Partecipa a sessioni di gioco disponibili |
| **Lobby** | Ciano | Visualizza la lobby del gioco a cui sei iscritto |
| **Hall of Fame** | Oro | Consulta la classifica globale |

---

## 3. Partecipare a una Game Session

### Passo 3.1: Trova sessioni disponibili
1. Dalla home, clicca su **"Join Game Sessions"**
2. La pagina mostrerà:
   - **Sessione disponibile**: Se c'è una sessione aperta, vedrai i dettagli
   - **Nessuna sessione**: Se non ci sono sessioni, vedrai "No sessions are currently open. Check back soon!"

### Passo 3.2: Iscriviti a una sessione
1. Se c'è una sessione disponibile, vedrai una card con:
   - Nome della sessione
   - Data e ora di inizio
   - Pulsante di azione
2. Clicca su **"Join"** per iscriverti
3. Un messaggio "Joined successfully!" confermerà l'iscrizione
4. Verrai reindirizzato automaticamente alla **Lobby**

### Passo 3.3: Già iscritto?
Se hai già effettuato l'iscrizione, il pulsante mostrerà **"Enter Lobby"** e cliccandoci sopra entrerai direttamente nella lobby.

---

## 4. La Lobby - Sala d'attesa

### Cosa vedrai nella Lobby
1. Titolo: "Lobby"
2. Sottotitolo: "Waiting for the game to start..."
3. Un indicatore di caricamento mentre il sistema verifica se il gioco è iniziato

### Cosa succede?
- La pagina controlla automaticamente ogni 2 secondi se il docente ha avviato la sessione
- Quando il gioco inizia, vedrai il messaggio **"Game session has started!"**
- Verrai automaticamente reindirizzato alla **Fase 1** del gioco

### Nota importante
**Non chiudere o aggiornare la pagina** mentre sei in lobby! Perderesti la connessione e dovresti rientrare.

---

## 5. Fase 1 - Coding Challenge

### Passo 5.1: Interfaccia della Fase 1
Quando il gioco inizia, vedrai una schermata divisa in due pannelli:

**Pannello Sinistro:**
- Tab "Problem Description": Descrizione del problema da risolvere
- Tab "Tests (Public & Mine)": Lista dei test cases

**Pannello Destro:**
- Editor di codice
- Selettore del linguaggio
- Pulsanti di esecuzione
- Area output

**In alto:**
- Timer countdown con tempo rimanente

### Passo 5.2: Leggi il problema
1. Nel tab "Problem Description", leggi attentamente:
   - **Titolo** del problema
   - **Descrizione** completa con i requisiti
   - **Esempi** di input/output (se presenti)

### Passo 5.3: Analizza i test cases
1. Passa al tab "Tests (Public & Mine)"
2. Vedrai:
   - **Test pubblici**: Forniti dal docente, usali per verificare la tua soluzione
   - **I tuoi test**: Test che puoi creare tu stesso

### Passo 5.4: Scrivi la soluzione
1. Nel pannello destro, scrivi il tuo codice nell'editor
2. Usa il selettore per scegliere il linguaggio (se disponibili più opzioni)
3. Il codice viene salvato automaticamente

### Passo 5.5: Esegui i test
1. Clicca **"Run Public Tests"** per eseguire i test pubblici del docente
2. Vedrai nell'output:
   -  Test passati (verde)
   -  Test falliti (rosso) con dettagli dell'errore
3. Correggi il codice e ripeti fino a passare tutti i test

### Passo 5.6: Aggiungi test personalizzati (Opzionale ma consigliato!)
1. Clicca su **"Add Test"** nel tab dei test
2. Inserisci:
   - **Input**: I dati di input del test
   - **Expected Output**: L'output atteso
3. Clicca **"Add"** per salvare
4. Usa **"Run Custom Tests"** per eseguire i tuoi test

### Passo 5.7: Invia la soluzione
- La tua soluzione viene **automaticamente salvata** mentre scrivi
- Quando il timer raggiunge 00:00, la Fase 1 termina automaticamente
- La tua ultima soluzione sarà quella valutata

---

## 6. Fase 2 - Peer Review

### Passo 6.1: Transizione alla Fase 2
- Quando la Fase 1 termina, verrai automaticamente reindirizzato alla pagina di review
- Vedrai una nuova schermata con layout a due colonne

### Passo 6.2: Interfaccia della Review
**Pannello Sinistro:**
- Lista delle soluzioni da recensire
- Timer countdown per la Fase 2
- Icona per espandere/comprimere il pannello

**Pannello Destro:**
- Codice della soluzione selezionata
- Opzioni di voto
- Form per test case (se necessario)
- Note aggiuntive

### Passo 6.3: Seleziona una soluzione
1. Nel pannello sinistro, clicca su una delle soluzioni assegnate
2. Il codice apparirà nel pannello destro

### Passo 6.4: Valuta la soluzione
Hai tre opzioni di voto:

#### Opzione A: Correct 
Se pensi che la soluzione sia corretta:
1. Seleziona **"Correct"**
2. (Opzionale) Aggiungi una nota
3. Clicca **"Submit Vote"**

#### Opzione B: Incorrect 
Se trovi un errore nella soluzione:
1. Seleziona **"Incorrect"**
2. **Devi fornire un test case** che faccia fallire la soluzione:
   - **Input**: I dati di input che causano l'errore
   - **Expected Output**: L'output corretto che la soluzione non produce
3. (Opzionale) Aggiungi una nota spiegando l'errore trovato
4. Clicca **"Submit Vote"**

#### Opzione C: Skip 
Se non riesci a valutare la soluzione:
1. Seleziona **"Skip"**
2. (Opzionale) Aggiungi una nota
3. Clicca **"Submit Vote"**

### Passo 6.5: Prosegui con le altre soluzioni
1. Dopo aver votato, la soluzione sarà marcata come completata
2. Passa alla prossima soluzione nella lista
3. Continua fino a recensire tutte le soluzioni assegnate o fino allo scadere del tempo

### Passo 6.6: Fine della Fase 2
- Quando il timer raggiunge 00:00, vedrai un overlay **"Phase Ended"**
- Non potrai più inviare voti
- I punteggi verranno calcolati

---

## 7. Hall of Fame - Classifica

### Passo 7.1: Accedi alla classifica
1. Dalla home, clicca su **"Hall of Fame"**
2. Oppure accedi direttamente a `/hall-of-fame`

### Passo 7.2: Cosa vedrai
- **Classifica globale** di tutti gli studenti
- Per ogni studente:
  - Posizione
  - Nome completo
  - Punteggio totale

### Passo 7.3: Cerca il tuo nome
- Usa la funzione di ricerca per trovare te stesso o i tuoi compagni
- Ordina la classifica per punteggio

---

## 8. Gestione del Profilo

### Passo 8.1: Accedi al profilo
1. Clicca sull'icona del profilo nella navbar (in alto a destra)
2. Oppure vai direttamente a `/profile`

### Passo 8.2: Visualizza le tue informazioni
- Nome e cognome
- Email
- Ruolo (Student)
- Eventuale foto profilo (da Google)

---

## Note Finali

Come docente, il tuo obiettivo principale è:
1. **Preparare** contenuti didattici (match settings e match)
2. **Organizzare** sessioni di gioco per le tue classi
3. **Monitorare** lo svolgimento delle gare
4. **Valutare** i progressi attraverso la classifica

**Master the Code. Dominate the Leaderboard.** 