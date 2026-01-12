import React, { Component } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Card, Typography, Space } from "antd";
import "./Login.css";


const { Title, Paragraph } = Typography;

// ==========================================================
// 1. CONFIG
// ==========================================================
// Environment variables are loaded from process.env 
// and must start with REACT_APP_ in a Create React App project

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ==========================================================
// 2. CLASS-BASED LOGIN COMPONENT
// ==========================================================
// Definition of the login component as a class
class Login extends Component {

  handleSuccess = (credentialResponse) => {
    // It's a JWT
    const token = credentialResponse.credential;

    // Decode the token for the User Data
    const decodedUser = jwtDecode(token);

    console.log("Successfull Login, Decoded data:", decodedUser);

    // We pass the data to the parent component (if the prop was provided)
    if (this.props.onLoginSuccess) {
      this.props.onLoginSuccess(decodedUser);
    }

  };

  handleError = () => {
    console.error("Failed Login.");
    alert("Login with Google failed. Please, try again later.");
  };

  render() {
    // Access the onLoginSuccess prop passed from the wrapper
    const { onLoginSuccess } = this.props;

    // Check if the Client ID is available (We have to change the text at the end of the app for sec reason)
    if (!GOOGLE_CLIENT_ID) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
          <h1>CONFIGURATION ERROR</h1>
          <p>enviroment variable REACT_APP_GOOGLE_CLIENT_ID missing inside your file .env.</p>  
          <p>Cannot show button to Google Login.</p>
        </div>
      );
    }

    return (
      <div className="login-container">
        <Card className="login-card">
          <Title level={2}>Login to the Application</Title>
          {/*Button Google Login */}
          <GoogleLogin
            onSuccess={this.handleSuccess}
            onError={this.handleError}
            type="standard"
            size="large"
            theme="outline"
          />
        </Card>
      </div>
    );
  }
}

// ==========================================================
// 3. WRAPPER COMPONENT FOR EXPORT (Includes the Provider)
// ==========================================================
// This component exposes the Provider logic and authentication
// state to all of its child components.

export function LoginWrapper(props) {

  // We use an alternative 'dummy' variable for the clientId
  // if it is not configured, to prevent the GoogleOAuthProvider from crashing.
  const safeClientId = GOOGLE_CLIENT_ID || 'dummy-client-id-for-safety';

  return (
    <GoogleOAuthProvider clientId={safeClientId}>
    {/* Pass all received props (including onLoginSuccess) 
      to the class-based component. */}
      <Login {...props} />
    </GoogleOAuthProvider>
  );
}
export default LoginWrapper;
