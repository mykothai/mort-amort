import { LoanCalculator } from './LoanCalculator';

enum NumberOfAnnualPayments {
    'accelerated bi-weekly' = 26,
    'bi-weekly' = 26,
    'monthly' = 12,
}

export enum PaymentSchedules {
    ACCELERATED_BI_WEEKLY = 'accelerated bi-weekly',
    BI_WEEKLY = 'bi-weekly',
    MONTHLY = 'monthly',
}
/**
 * Calculates the mortgage payment amount in dollars for each scheduled pay period
 * @param propertyPrice the price of the property
 * @param downPayment the amount to be paid towards the property price
 * @param interestRate the annual interest rate of the mortgage
 * @param amortizationPeriod the amount of time to pay off the mortgage in years
 * @param paySchedule the frequency of payments to be made. Monthly, bi-weekly, or accelerated bi-weekly.
 * 
 * @returns a number representing the payment amount to be paid each pay period
 */
export class MortgageCalculator extends LoanCalculator {
    private _propertyPrice: number;
    private _downPayment: number;
    private _paySchedule: string;

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
        super(propertyPrice - downPayment, interestRate, amortizationPeriod);
        this._downPayment = downPayment;
        this._propertyPrice = propertyPrice;
        this._paySchedule = paySchedule.toLowerCase();
    }

    public calculateMortgagePayment() {
        try {
            if (!NumberOfAnnualPayments[this._paySchedule as keyof typeof NumberOfAnnualPayments]) { // https://stackoverflow.com/a/17381004;
                throw new Error(`Pay schedule '${this._paySchedule}' is invalid.`);
            };

            if (this.interestRate < 0 || this.interestRate > 100) {
                throw new Error('Interest rate must be between 0 and 100, inclusive.');
            };

            if (this._propertyPrice < 0) {
                throw new Error('Property price must be positive.');
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

            let payment;
            switch(this._paySchedule) {
                case (PaymentSchedules.ACCELERATED_BI_WEEKLY):
                    payment = monthlyPayment / 2;
                    break;
                case (PaymentSchedules.BI_WEEKLY):
                    payment =  monthlyPayment * NumberOfAnnualPayments['monthly'] / NumberOfAnnualPayments['bi-weekly'];
                    break;
                default:
                    payment =  monthlyPayment;
            };

            return parseFloat((payment).toFixed(2)); // toFixed() converts a number to a string so we need to parse the value

        } catch (error: any) {
            throw new Error(`Could not perform calculations. ${error.message}`);
        };
    };

    /**
     * Validates the amortization period by checking that the period is
     * a multiple of 5 (5 year increments) and that the period is between 5 and 30 years inclusive.
     * 
     * @param period the amount of time to pay off the mortgage in years
     * @returns boolean. True if the amortization period is valid, otherwise false.
     */
    private isValidAmortizationPeriod(period: number) : boolean {
        return (period >= MortgageCalculator.MINIMUM_AMORTIZATION_PERIOD) 
        && (period <= MortgageCalculator.MAXIMUM_AMORTIZATION_PERIOD) 
        && (period % MortgageCalculator.MINIMUM_AMORTIZATION_PERIOD === 0);
    };

    /**
     * Validates that a down payment given the price of the property is sufficient based on Canadian/BC guidelines, 
     * which can be found at https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html#toc0
     * 
     * @param downPayment the amount to be paid towards the property price
     * @param propertyPrice the price of the property
     * @returns boolean. True if the down payment is sufficient, otherwise false.
     */
    private isValidDownPayment(downPayment: number, propertyPrice: number) {
        let percentOfPurchase = downPayment / propertyPrice * 100;

        if (propertyPrice <= MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD) {
            return percentOfPurchase >= MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_1;
        } else if (propertyPrice > MortgageCalculator.PURCHASE_PRICE_PURCHASE_PRICE_UPPER_THRESHOLD) {
            return percentOfPurchase >= MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_3;
        } else {
            return downPayment 
            >= ((MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_1 / 100) 
            * MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD 
            + (MortgageCalculator.REQUIRED_DOWN_PAYMENT_PERCENT_TIER_2 / 100) 
            * (propertyPrice - MortgageCalculator.PURCHASE_PRICE_LOWER_THRESHOLD));
        };
    };
};