// import required modules
const express = require('express');
const cors = require('cors');

// import routes
const userRoutes = require("./routes/userRoutes.cjs")
const plaidRoutes = require("./routes/plaidRoutes.cjs")

require('dotenv').config() // Load environment variables from a .env file

// Import prisma to connect to the server
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize an Express application
const app = express();
// Set port number for the server
const port = 3333;

// Middlewares
// Use CORS middleware to allow cross-origin requests
app.use(cors());
// Use express.json middleware to parse incoming JSON requests
app.use(express.json());

app.use("/api/users", (req, res, next) => {
    req.prisma = prisma
    next()
}, userRoutes)

app.use("/api/plaid", (req, res, next) => {
    req.prisma = prisma
    next()
}, plaidRoutes)

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});