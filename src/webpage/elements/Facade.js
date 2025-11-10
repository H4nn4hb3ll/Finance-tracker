// src/Facade.js
const serverAddress = "http://localhost:3333";

// Log in user
export async function login(username, password) {
    const response = await fetch(`${serverAddress}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

// Create new user
export async function createUser(username, password) {
    const response = await fetch(`${serverAddress}/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

// Request a new link token
export async function createLinkToken(clientName) {
    const response = await fetch(`${serverAddress}/create_link_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_name: clientName })
    });
    return response.json();
}

// Exchange public token for access token
export async function getAccessToken(publicToken) {
    const response = await fetch(`${serverAddress}/get_access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicToken }),
    });
    const data = await response.json();
    return { accessToken: data.accessToken };
}
  

// Fetch transactions
export async function getTransactions(accessToken) {
    const response = await fetch(`${serverAddress}/get_transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken })
    });
    return response.json();
}
