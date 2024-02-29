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
    private _interestRate: number;
    private _loanPeriod: number;
    private _paySchedule: string;

    constructor(interestRate: number, loanPeriod: number, paySchedule: string) {
        this._interestRate = interestRate;
        this._loanPeriod = loanPeriod;
        this._paySchedule = paySchedule.toLowerCase();
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
    
    calculateMonthlyInterestRate(): number {
        return (this.interestRate/100) / NumberOfAnnualPayments.monthly;
    }
    
    calculateTotalNumOfPayments(paymentsPerAnnum: number, period: number): number {
        return paymentsPerAnnum * period;
    }

    calculatePerPaymentScheduleAmount(principle: number, perPaymentInterestRate: number, totalNumPayments: number): number {
        return principle * perPaymentInterestRate * (Math.pow(1 + perPaymentInterestRate, totalNumPayments)) / (Math.pow(1 + perPaymentInterestRate, totalNumPayments) - 1);
    }
}