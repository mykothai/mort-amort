export enum NumberOfAnnualPayments {
    'accelerated bi-weekly' = 26,
    'bi-weekly' = 26,
    'monthly' = 12,
}

export enum PaymentSchedules {
    ACCELERATED_BI_WEEKLY = 'accelerated bi-weekly',
    BI_WEEKLY = 'bi-weekly',
    MONTHLY = 'monthly',
}

export abstract class LoanCalculator {
    private _principle: number;
    private _interestRate: number;
    private _loanPeriod: number;
    private _paySchedule: string;
    private _totalNumberOfPayments: number;

    constructor(principle: number, interestRate: number, loanPeriod: number, paySchedule: string) {
        this._principle = principle;
        this._interestRate = interestRate;
        this._loanPeriod = loanPeriod;
        this._paySchedule = paySchedule.toLowerCase();
        this._totalNumberOfPayments = this.numberOfPaymentsPerAnnum * loanPeriod;
    }

    get principle(): number {
        return this._principle;
    }

    get interestRate(): number {
        return this._interestRate;
    }

    get loanPeriod(): number {
        return this._loanPeriod;
    }

    get paySchedule(): string {
        return this._paySchedule;
    }

    get numberOfPaymentsPerAnnum(): number {
        return NumberOfAnnualPayments[this._paySchedule as keyof typeof NumberOfAnnualPayments]; // https://stackoverflow.com/a/17381004;
    }

    get totalNumberOfPayments(): number {
        return this._totalNumberOfPayments;
    }

    calculateMonthlyInterestRate(): number {
        return (this.interestRate) / NumberOfAnnualPayments.monthly;
    }

    calculateMonthlyPayment(principle: number, interestRate: number): number {
        const numOfMonths = this.loanPeriod * NumberOfAnnualPayments['monthly'];

        // when interest rate is zero, divide principle by number of months in the loan period
        if (interestRate === 0) {
            return principle / numOfMonths
        }

        const rateAsDecimal = interestRate / 100;
        return principle * rateAsDecimal * (Math.pow(1 + rateAsDecimal, numOfMonths)) / (Math.pow(1 + rateAsDecimal, numOfMonths) - 1);
    }
}