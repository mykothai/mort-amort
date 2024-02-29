import express from "express";

const { MortgageCalculator } = require('../calculator/MortgageCalculator');
const router = express.Router();

router.get('/calculate/:price/:downPayment/:rate/:amortPeriod/:paySchedule', async (req, res) => {
    const purchasePrice = parseInt(req.params.price);
    const downPayment = parseInt(req.params.downPayment);
    const interestRate = parseFloat(req.params.rate);
    const amortizationPeriod = parseInt(req.params.amortPeriod);
    const paySchedule = req.params.paySchedule.toLowerCase();

    if (!Number(purchasePrice)) {
        res.status(400).json('Purchase price is invalid.');
        return;
    }

    if (!Number(downPayment)) {
        res.status(400).json('Down payment is invalid.');
        return;
    }

    if (!Number(interestRate)) {
        res.status(400).json('Interest rate is invalid.');
        return;
    }

    if (!Number(amortizationPeriod)) {
        res.status(400).json('Amortization period is invalid.');
        return;
    }

    if (typeof paySchedule !== "string") {
        res.status(400).json('Pay schedule is invalid.');
        return;
    }

    try {
        const mortgageCalculator = new MortgageCalculator(purchasePrice, downPayment, interestRate, amortizationPeriod, paySchedule);
        const result = await mortgageCalculator.calculateMortgage();
    
        res.status(200).json(result);
        
    } catch (error: any) {
        res.status(500).json(error.message);
    }
})

module.exports = router;