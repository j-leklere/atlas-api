// const express = require('express');
// const { createOrder } = require('../controllers/paymentsController');
import express from "express";
const router = express.Router();
import {
  createOrder,
  receiveWebHook,
} from "../controllers/paymentsController.js";

router.get("/create-order", createOrder);

router.get("/pending", (req, res) => res.send("pending"));
router.get("/success", (req, res) => res.send("success"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/webhook", receiveWebHook);

// module.exports = router;
export default router;
