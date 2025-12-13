// File: backend/routes/ticket.js

const express = require("express");
const { buyTicket, getMyTickets } = require("../controllers/ticketControllers"); 
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Ini endpoint yang digunakan oleh frontend: POST /api/tickets/buy
router.post("/buy", authMiddleware, buyTicket); 

router.get("/my-tickets", authMiddleware, getMyTickets);

module.exports = router;