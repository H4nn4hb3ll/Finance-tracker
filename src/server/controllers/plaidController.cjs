const plaid = require('plaid')


//Initialize Plaid client with configuration
const client = new plaid.PlaidApi(
    new plaid.Configuration({
        // Use sandbox environment for Plaid
        basePath: plaid.PlaidEnvironments['sandbox'],
        baseOptions: {
            headers: {
                // Set Plaid client ID, secret, and version from environment variables
                "PLAID-CLIENT-ID": "68eeb04b57d552001e2d3bc7",
                "PLAID-SECRET": "452e38c47e9583020d4128984ea356",
                "Plaid-Version": "2020-09-14"
            }
        }
    })
)

module.exports = {
    // Endpoint to create a link token
    createLinkToken: async (req, res) => {
        try {
            console.log("req recieved")

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
            })

            // Send the response data as JSON
            res.json(response.data)

        } catch (error) {
            console.error("there was an error")

            // Send error message as JSON
            res.json({
                error: error.message
            })
        }
    },

    getAccessToken: async (req, res) => {
        try {
            const publicToken = req.body.publicToken

            const response = await client.itemPublicTokenExchange({
            public_token: publicToken
            })

            // Send the access token as JSON
            res.json({ accessToken: response.data.access_token })
        } catch (error) {
            console.error('Error', error)

            // Send error message as JSON
            res.json({
                error: error.message
            })
        }
    },

    getTransactions: async (req, res) => {
        try {
            //need to add date selections
            const response = await client.transactionsGet({
                access_token: req.body.token,
                start_date: '2025-01-01',
                end_date: '2025-12-31',
                options: {
                    offset: 0
                }
            })

            // Send the transactions data as JSON
            res.json(response.data)
            console.log(res)
            console.log("end response log")
        } catch (error) {
            console.error('Error', error)
            console.log(req.body.token)
            console.log("end error log")

            // Send error message as JSON
            res.json({
                error: error.message
            })
        }
    }
}

// Mock retrieve user data endpoint
// app.get('/retrieve_data', async (req, res) => {
//     const sampleData = {
//         user: "Test User",
//         linkedAccounts: 2,
//         lastLogin: new Date().toISOString(),
//     }
//     res.json(sampleData);
// });