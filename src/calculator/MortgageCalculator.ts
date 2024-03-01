import { LoanCalculator, NumberOfAnnualPayments } from './LoanCalculator';

export class MortgageCalculator extends LoanCalculator {
    private _propertyPrice: number;
    private _downPayment: number;

    static PURCHASE_PRICE_LOWER_THRESHOLD = 500000;
    static PURCHASE_PRICE_PURCHASE_PRICE_UPPER_THRESHOLD = 1000000;

    static REQUIRED_DOWN_PAYMENT_PERCENT_TIER_1 = 5;
    static REQUIRED_DOWN_PAYMENT_PERCENT_TIER_2 = 10;
    static REQUIRED_DOWN_PAYMENT_PERCENT_TIER_3 = 20;

    static MINIMUM_AMORTIZATION_PERIOD = 5;
    static MAXIMUM_AMORTIZATION_PERIOD = 30;

    constructor(
        propertyPrice: number,
        downPayment: number,
        interestRate: number,
        amortizationPeriod: number,
        paySchedule: string,
    ) {
        super(propertyPrice - downPayment, interestRate, amortizationPeriod, paySchedule);
        this._downPayment = downPayment;
        this._propertyPrice = propertyPrice;
    }

    public calculateMortgagePayment() {
        try {
            if (!this.numberOfPaymentsPerAnnum) {
                throw new Error(`Pay schedule '${this.paySchedule}' is invalid.`);
            };

            if (this._propertyPrice < 0) {
                throw new Error(`Property price must be positive.`);
            };

            if (!this.isValidAmortizationPeriod(this.loanPeriod)) {
                throw new Error(`Amortization period of ${this.loanPeriod} is invalid.`);
            };

            if (this._downPayment > this._propertyPrice) {
                return 0;
            };

            if (!this.isValidDownPayment(this._downPayment, this._propertyPrice)) {
                throw new Error(`Down payment of ${this._downPayment} is insufficient.`);
            };

            const monthlyInterestRate = this.calculateMonthlyInterestRate();
            const monthlyPayment: number = this.calculateMonthlyPayment(this.principle, monthlyInterestRate);

            switch(this.paySchedule) {
                case ('accelerated bi-weekly'):
                    return monthlyPayment / 2;
                case ('bi-weekly'):
                    return monthlyPayment * NumberOfAnnualPayments['monthly'] / NumberOfAnnualPayments['bi-weekly'];
                default:
                    return monthlyPayment;
            };

        } catch (error: any) {
            throw new Error(`Could not perform calculations. ${error.message}`);
        }
    }

    private isValidAmortizationPeriod(period: number) : boolean {
        return (period >= MortgageCalculator.MINIMUM_AMORTIZATION_PERIOD) 
        && (period <= MortgageCalculator.MAXIMUM_AMORTIZATION_PERIOD) 
        && (period % MortgageCalculator.MINIMUM_AMORTIZATION_PERIOD === 0);
    }

    // https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html#toc0
    private isValidDownPayment(downPayment: number, propertyPrice: number) {

        let percentOfPurchase = downPayment/propertyPrice*100;

        if (propertyPrice <= MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD) {
            return percentOfPurchase >= MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_1;
        } else if (propertyPrice > MortgageCalculator.PURCHASE_PRICE_PURCHASE_PRICE_UPPER_THRESHOLD) {
            return percentOfPurchase >= MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_3;
        } else {
            return downPayment 
            >= ((MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_1/100) 
            * MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD 
            + (MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_2/100) 
            * (propertyPrice - MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD));
        }
    }
}