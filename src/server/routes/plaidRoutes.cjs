const express = require("express")
const router = express.Router()
const plaidController = require("../controllers/plaidController.cjs")

router.post("/create_link_token", plaidController.createLinkToken)
router.post("/get_access_token", plaidController.getAccessToken)
router.post("/get_transactions", plaidController.getTransactions)

module.exports = router