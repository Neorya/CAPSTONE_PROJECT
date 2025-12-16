import React, { Component } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// ==========================================================
// 1. CONFIGURAZIONE
// ==========================================================
// In un progetto Create React App, le variabili d'ambiente
// si caricano da process.env e devono iniziare con REACT_APP_
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ==========================================================
// 2. COMPONENTE DI LOGIN BASATO SU CLASSE
// ==========================================================

// Definizione del componente di login come Classe
class Login extends Component {
  
  // Gestione del successo del Login con Google
  handleSuccess = (credentialResponse) => {
    // Il token è un JWT
    const token = credentialResponse.credential;
    
    // Decodifichiamo il token per estrarre i dati utente
    const decodedUser = jwtDecode(token);
    
    console.log("Login riuscito. Dati decodificati:", decodedUser);

    // Passiamo i dati al componente genitore (se la prop è stata fornita)
    if (this.props.onLoginSuccess) {
      this.props.onLoginSuccess(decodedUser);
    }
    
    // 
  };

  // Gestione dell'errore di Login
  handleError = () => {
    console.error("Login fallito.");
    alert("Login con Google non riuscito. Riprova più tardi.");
  };

  render() {
    // Accesso alla prop onLoginSuccess passata dal wrapper
    const { onLoginSuccess } = this.props;

    // Verifichiamo se il Client ID è disponibile
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
                <h1>ERRORE DI CONFIGURAZIONE</h1>
                <p>Manca la variabile d'ambiente REACT_APP_GOOGLE_CLIENT_ID nel tuo file .env.</p>
                <p>Impossibile mostrare il pulsante di Login con Google.</p>
            </div>
        );
    }

    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Accedi all'Applicazione</h2>
        
        {/* Visualizza il pulsante di Google Login */}
        <GoogleLogin
          onSuccess={this.handleSuccess}
          onError={this.handleError}
          type="standard" 
          size="large"
          theme="outline"
        />
      </div>
    );
  }
}

// ==========================================================
// 3. COMPONENTE WRAPPER PER L'ESPORTAZIONE (Include il Provider)
// ==========================================================
// Questo componente espone la logica del Provider e lo stato
// per l'autenticazione a tutti i suoi figli.

export function LoginWrapper(props) {
    
    // Utilizziamo un nome di variabile alternativo 'dummy' per il clientId 
    // se non è configurato, per evitare crash del GoogleOAuthProvider.
    const safeClientId = GOOGLE_CLIENT_ID || 'dummy-client-id-for-safety';

    return (
        <GoogleOAuthProvider clientId={safeClientId}>
            {/* Passiamo tutte le props ricevute (inclusa onLoginSuccess) al 
            componente basato su classe.
            */}
            <Login {...props} />
        </GoogleOAuthProvider>
    );
}
// Esportiamo il componente wrapper come default
export default LoginWrapper;