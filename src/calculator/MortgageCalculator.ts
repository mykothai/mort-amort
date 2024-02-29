import { LoanCalculator } from './LoanCalculator';

export class MortgageCalculator extends LoanCalculator {
    private _propertyPrice: number;
    private _downPayment: number;

    constructor(
        propertyPrice: number,
        downPayment: number,
        interestRate: number,
        amortizationPeriod: number,
        paySchedule: string
    ) {
        super(interestRate, amortizationPeriod, paySchedule);
        this._downPayment = downPayment;
        this._propertyPrice = propertyPrice;
    }

    public calculatePerPaymentAmount() {
        try {
            if (!this.numberOfPaymentsPerAnnum) {
                throw new Error(`Pay schedule '${this.paySchedule}' is invalid.`)
            }

            if (!this.isValidAmortizationPeriod(this.loanPeriod)) {
                throw new Error(`Amortization period of ${this.loanPeriod} is invalid.`);
            };

            if (!this.isValidDownPayment(this._downPayment, this._propertyPrice)) {
                throw new Error(`Down payment of ${this._downPayment} is too low.`);
            };

            const totalNumberOfPayments = this.calculateTotalNumOfPayments(
                this.numberOfPaymentsPerAnnum,
                this.loanPeriod
            );
    
            const r = this.calculatePerPaymentScheduleInterestRate();
            const principle = this._propertyPrice - this._downPayment;

            const thingy = 1+r;
            const intermediateCalculation = Math.pow((1 + r), totalNumberOfPayments);

            const numerator = r * intermediateCalculation;
            const denominator = intermediateCalculation - 1;

            const monthlyPayment = principle * (numerator / denominator);
    
            return parseFloat((monthlyPayment).toFixed(2)); 
            
        } catch (error: any) {
            throw new Error(`Could not perform calculations. ${error.message}`)
        }
    }

    private isValidAmortizationPeriod(period: number) : boolean {
        return (period >= 5) && (period <= 30) && (period % 5 === 0);
    }

    private isValidDownPayment(downPayment: number, propertyPrice: number) {
        if (downPayment < 0 || downPayment/propertyPrice*100 < 20) {
            return false;
        }

        return true;
    }
}