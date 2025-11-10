// Import required modules
const express = require('express');
const plaid = require('plaid');
const cors = require('cors');
require('dotenv').config() // Load environment variables from a .env file

// Import prisma to connect to the server
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize an Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use express.json middleware to parse incoming JSON requests
app.use(express.json());

// Set port number for the server
const port = 3333;

app.get("/test-db", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
})

// Initialize Plaid client with configuration
const client = new plaid.PlaidApi(
    new plaid.Configuration({
        // Use sandbox environment for Plaid
        basePath: plaid.PlaidEnvironments['sandbox'],
        baseOptions:{
            headers:{
                // Set Plaid client ID, secret, and version from environment variables
                "PLAID-CLIENT-ID": "68eeb04b57d552001e2d3bc7",
                "PLAID-SECRET": "452e38c47e9583020d4128984ea356",
                "Plaid-Version": "2020-09-14"
            }
        }
    })
);

// Endpoint to create a link token
app.post('/create_link_token', async (req, res) => {
    try {
        console.log("req recieved");

        //get information from the client
        const clientName = req.body.client_name;

        //request the link token from plaid
        const response = await client.linkTokenCreate({
            user: {
                client_user_id: 'SEUNF'
            },
            products: ['transactions'],
            required_if_supported_products: ['auth'],
            country_codes: ['us'],
            language: "en",
            client_name: clientName
        });

        // Send the response data as JSON
        res.json(response.data);
    } catch (error) {
        console.log("there was an error");

        // Send error message as JSON
        res.json({
            error: error.message
        });
    }
});

// Endpoint to exchange a public token for an access token
app.post('/get_access_token', async (req, res) => {
    try {
        const publicToken = req.body.publicToken;
        const response = await client.itemPublicTokenExchange({
            public_token: publicToken
        });
        // Send the access token as JSON
        res.json({ accessToken: response.data.access_token });
    } catch (error) {
        console.error('Error', error);
        // Send error message as JSON
        res.json({
            error: error.message
        });
    }
});

// Endpoint to get transactions using an access token
app.post('/get_transactions', async (req, res) => {
    try {
        //need to add date selections
        const response = await client.transactionsGet({
            access_token: req.body.token,
            start_date: '2025-01-01',
            end_date: '2025-12-31',
            options: {
                offset: 0
            }
        });
        // Send the transactions data as JSON
        res.json(response.data);
        console.log(res);
        console.log("end response log");
    } catch (error) {
        console.error('Error', error);
        console.log(req.body.token)
        console.log("end error log");
        // Send error message as JSON
        res.json({
            error: error.message
        });
    }
});

// Mock user authentication endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //Mock authentication process
    if (username === 'user' && password === 'pass') {
        res.json({ status: 1, message: 'Login successful' });
    } else {
        res.json({ status: 0, message: 'Invalid credentials' });
    }
});

// Mock create user endpoint
app.post('/create_user', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Creating user: ${username}`);

    // Always return success for this mock
    res.json({ status: 1, message: 'User created successfully' });
});

// Mock retrieve user data endpoint
app.get('/retrieve_data', async (req, res) => {
    const sampleData = {
        user: "Test User",
        linkedAccounts: 2,
        lastLogin: new Date().toISOString(),
    }
    res.json(sampleData);
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
