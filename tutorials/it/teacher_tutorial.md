# Tutorial Teacher - Guida Completa per Docenti

## Introduzione

Benvenuto in **Codify**, la piattaforma di coding gamificato per l'insegnamento della programmazione! Questa guida ti accompagnerà passo dopo passo attraverso tutte le funzionalità disponibili per i docenti.

---

## Prerequisiti

Prima di iniziare, assicurati che:
- Accesso all'URL: `http://localhost:3000`

---

## 1. Login come Teacher

### Passo 1.1: Accedi alla pagina di login
1. Apri il browser e vai su `http://localhost:3000/login`
2. Vedrai la schermata di login di Codify

### Passo 1.2: Effettua il login
**In modalità sviluppo:**
1. Clicca sul pulsante **" Login as Teacher (Dev)"** nella sezione "Developer Access"
2. Verrai automaticamente autenticato come docente e reindirizzato alla Home

---

## 2. Home Page - Dashboard Docente

Dopo il login, vedrai la home page con le seguenti opzioni:

| Card | Descrizione |
|------|-------------|
| **Create Match Settings** | Progetta nuovi problemi di codifica con test cases e soluzioni |
| **Create New Match** | Crea un nuovo match basato su un match setting esistente |
| **Match Settings** | Gestisci e visualizza tutti i match settings |
| **Create Game Session** | Crea una nuova sessione di gioco per gli studenti |
| **View Game Sessions** | Visualizza, modifica, clona o elimina le sessioni create |
| **Hall of Fame** | Consulta la classifica degli studenti |

---

## 3. Gestione dei Match Settings

### Passo 3.1: Visualizza i Match Settings
1. Dalla home, clicca su **"Match Settings"**
2. Vedrai l'elenco di tutti i match settings disponibili con:
   - Titolo
   - Descrizione
   - Stato (Ready/Not Ready)
   - Azioni disponibili (modifica, elimina, etc.)

### Passo 3.2: Crea un nuovo Match Setting

> I match settings definiscono il problema algoritmico che gli studenti dovranno risolvere, inclusa la soluzione di riferimento e i test cases.

**Dalla home page:**

1. Clicca su **"Create Match Settings"**
2. Verrai portato al modulo di creazione dei match settings

**Configura il match setting:**

#### Dettagli Match
1. **Titolo**: Dai un nome chiaro al problema
2. **Descrizione**: Scrivi il testo completo del problema che gli studenti vedranno
3. **Soluzione di Riferimento**: Fornisci il codice soluzione corretto in C++
4. **Template di Codice Studente** (opzionale): Codice iniziale (facoltativo) che vedranno gli studenti

#### Test Cases
1. Aggiungi **Test Cases Pubblici**: Visibili agli studenti, aiutano a comprendere l'output atteso
   * Input: Dati di input del test
   * Output: Output atteso
2. Aggiungi **Test Cases Privati**: Nascosti agli studenti, usati per la valutazione finale
   * Input: Dati di input del test
   * Output: Output atteso

#### Configurazione Docente (opzionale)
1. Definisci la **Firma della Funzione**:
   * **Nome Funzione**: La funzione che gli studenti devono implementare (es. "fibonacci")
   * **Tipo di Ritorno**: Il tipo di dato restituito (es. "int", "string")
   * **Input Funzione**: Definisci i parametri di input e i loro tipi
2. **Testa il Match Setting**:
   * Clicca su **"Try"** per compilare ed eseguire la tua soluzione di riferimento con i test cases
   * Verifica che tutti i test passino prima di pubblicare

#### Pubblicazione
1. **Salva come Bozza**: Salva il match setting come bozza (può essere modificato successivamente)
2. **Pubblica**: Rende il match setting "Ready" e disponibile per la creazione di match
   * Una volta pubblicato, lo stato cambierà a "Ready"
   * Solo i match settings ready possono essere usati nei match

**Dopo la creazione:**

* Il tuo nuovo match setting apparirà nella lista Match Settings
* Puoi modificare, clonare o eliminare le impostazioni in bozza
* Le impostazioni pubblicate possono essere visualizzate o clonate per creare variazioni

---

## 4. Creazione di un Match

### Passo 4.1: Accedi alla creazione match
1. Dalla home, clicca su **"Create New Match"**

### Passo 4.2: Configura il match
1. **Seleziona un Match Setting**: Scegli dalla lista dei match settings disponibili (solo quelli con stato "Ready")
2. **Inserisci il titolo del Match**: Es. "Algoritmi - Classe 5A"
3. **Seleziona il livello di difficoltà**: Da 1 (facile) a 10 (difficile)
4. **Imposta il numero di review**: Quante soluzioni ogni studente dovrà recensire nella Fase 2

### Passo 4.3: Salva il match
1. Clicca su **"Create Match"**
2. Se tutto è corretto, vedrai un messaggio di successo
3. Il match è ora pronto per essere usato in una Game Session

---

## 5. Creazione di una Game Session

### Passo 5.1: Accedi alla creazione sessione
1. Dalla home, clicca su **"Create Game Session"**

### Passo 5.2: Configura la sessione di gioco
1. **Nome della sessione**: Es. "Gara di Programmazione - 28 Gennaio 2026"
2. **Data e ora di inizio**: Seleziona quando la sessione diventerà disponibile
3. **Durata Fase 1** (minuti): Tempo per risolvere il problema algoritmico (es. 30-60 minuti)
4. **Durata Fase 2** (minuti): Tempo per la fase di review peer-to-peer (es. 15-30 minuti)

### Passo 5.3: Seleziona i Match
1. Nella tabella dei match disponibili, seleziona uno o più match spuntando le checkbox
2. I match selezionati saranno inclusi nella sessione

### Passo 5.4: Crea la sessione
1. Verifica i dati inseriti
2. Clicca su **"Create Session"**
3. Un messaggio di successo confermerà la creazione
4. Verrai reindirizzato alla pagina di dettaglio della sessione

---

## 6. Gestione delle Game Sessions

### Passo 6.1: Visualizza le sessioni
1. Dalla home, clicca su **"View Game Sessions"**
2. Vedrai l'elenco delle tue sessioni con:
   - Nome
   - Data di inizio
   - Stato (pianificata, in corso, terminata)
   - Numero di studenti iscritti
   - Azioni disponibili

### Passo 6.2: Avvia una sessione (Pre-Start)
1. Seleziona una sessione dalla lista
2. Clicca su **"View Details"**
3. In questa pagina puoi:
   - Vedere gli studenti che si sono iscritti
   - Visualizzare i match associati
   - **Avviare la sessione** quando tutti gli studenti sono pronti

### Passo 6.3: Monitora una sessione in corso
1. Una volta avviata la sessione, verrai portato a `/start-game-session/{id}`
2. Vedrai:
   - **Timer countdown**: Tempo rimanente della fase corrente
   - **Fase corrente**: Phase 1 (Coding) o Phase 2 (Review)
   - **Lista studenti**: Chi sta partecipando
   - **Stato**: Descrizione dell'attività in corso

---


## 7. Hall of Fame (Classifica)

### Passo 7.1: Visualizza la classifica
1. Dalla home, clicca su **"Hall of Fame"**
2. Vedrai la classifica globale con:
   - Posizione
   - Nome studente
   - Punteggio totale

### Funzionalità disponibili:
- Ordinamento per punteggio
- Ricerca studenti
- Filtri vari

---

## 8. Gestione del Profilo

1. Clicca sull'icona del profilo in alto a destra (o accedi a `/profile`)
2. Visualizza le tue informazioni:
   - Nome e cognome
   - Email
   - Ruolo (Teacher)

---

## Note Finali

Come docente, il tuo obiettivo principale è:
1. **Preparare** contenuti didattici (match settings e match)
2. **Organizzare** sessioni di gioco per le tue classi
3. **Monitorare** lo svolgimento delle gare
4. **Valutare** i progressi attraverso la classifica

Buon lavoro con Codify! 