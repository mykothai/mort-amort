enum NumberOfAnnualPayments {
    "accelerated bi-weekly" = 26,
    'bi-weekly' = 26,
    'monthly' = 12
}

export abstract class LoanCalculator{
    private _interestRate: number;
    private _loanPeriod: number;
    private _paySchedule: string;

    constructor(interestRate: number, loanPeriod: number, paySchedule: string) {
        this._interestRate = interestRate;
        this._loanPeriod = loanPeriod;
        this._paySchedule = paySchedule;
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
    
    calculatePerPaymentScheduleInterestRate(): number {
        return (this.interestRate/100) / this.numberOfPaymentsPerAnnum;
    }
    
    calculateTotalNumOfPayments(paymentsPerAnnum: number, period: number): number {
        return paymentsPerAnnum * period;
    }

    abstract calculatePerPaymentAmount(): number
}