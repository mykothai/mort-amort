/**
 * Abstract class that calculates monthly loan payments and monthly interest rate
 * 
 * @param   principle the amount borrowed 
 * @param   interestRate annual interest rate of loan
 * @param   loanPeriod amount of time to pay off the loan in years
 * @returns monthly interest rate or monthly payment in dollars
 */
export abstract class LoanCalculator {
    private _principle: number;
    private _interestRate: number;
    private _loanPeriod: number;

    static MONTHS_IN_YEAR = 12;

    constructor(principle: number, interestRate: number, loanPeriod: number) {
        this._principle = principle;
        this._interestRate = interestRate;
        this._loanPeriod = loanPeriod;
    };

    get principle(): number {
        return this._principle;
    };

    get interestRate(): number {
        return this._interestRate;
    };

    get loanPeriod(): number {
        return this._loanPeriod;
    };

    calculateMonthlyInterestRate(): number {
        return (this.interestRate) / LoanCalculator.MONTHS_IN_YEAR;
    };

    calculateMonthlyPayment(principle: number, interestRate: number): number {
        const numOfMonths = this.loanPeriod * LoanCalculator.MONTHS_IN_YEAR;

        // when interest rate is zero, divide principle by number of months in the loan period
        if (interestRate === 0) {
            return principle / numOfMonths;
        }

        const rateAsDecimal = interestRate / 100;
        return principle * rateAsDecimal * (Math.pow(1 + rateAsDecimal, numOfMonths)) / (Math.pow(1 + rateAsDecimal, numOfMonths) - 1);
    };
};