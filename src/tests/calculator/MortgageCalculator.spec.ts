import { MortgageCalculator } from '../../calculator/MortgageCalculator';
import { LoanCalculator } from '../../calculator/LoanCalculator';

let loanCalculator = jest.mock('../../calculator/LoanCalculator');

describe('MortgageCalculator class', () => {

    describe('Given a payment schedule', () => {
        const propertyPrice = 500000;
        const downPayment = 25000;
        const amortizationPeriod = 10;
        const interestRate = 5.61;

        describe('Given a monthly pay schedule', () => {
            let result: any;
            let mortgageCalculator: MortgageCalculator;

            const paySchedule = 'Monthly';
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    jest.spyOn(LoanCalculator.prototype, 'calculateMonthlyInterestRate');
                    jest.spyOn(LoanCalculator.prototype, 'calculateMonthlyPayment');

                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(5180.93);
                });

                test('And calculateMonthlyInterestRate was called', () => {
                    expect(LoanCalculator.prototype.calculateMonthlyInterestRate).toHaveBeenCalled();
                });

                test('And calculateMonthlyPayment was called with the correct parameters', () => {
                    expect(LoanCalculator.prototype.calculateMonthlyPayment).toHaveBeenCalled();
                    expect(LoanCalculator.prototype.calculateMonthlyPayment).toHaveBeenCalledWith(475000, 0.4675);
                });
            });
        });
    
        describe('Given a bi-weekly pay schedule', () => {
            let result: any;
            let mortgageCalculator: MortgageCalculator;
            
            const paySchedule = 'Bi-Weekly';
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(2391.20);
                });
            });
        });
    
        describe('Given an accelerated bi-weekly pay schedule', () => {
            let result: any;
            let mortgageCalculator: MortgageCalculator;
            
            const paySchedule = 'Accelerated Bi-weekly';
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(2590.46);
                });
            });
        });
    
        describe('Given an invalid pay schedule input', () => {
            let mortgageCalculator: MortgageCalculator;
            
            const paySchedule = 'day';
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Pay schedule \'day\' is invalid.');
                });
            });
        });
    });

    describe('Given a property price', () => {
        const downPayment = 25000;
        const amortizationPeriod = 10;
        const interestRate = 5.61;
        const paySchedule = 'Monthly';

        describe('Given an invalid property price', () => {
            let mortgageCalculator: MortgageCalculator;

            const propertyPrice = -1000000;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Property price must be positive.');
                });
            });
        });
    });

    describe('Given an amortization period', () => {
        let mortgageCalculator: MortgageCalculator;
        const propertyPrice = 1000000;
        const paySchedule = 'Monthly';
        const interestRate = 5.621;
        const downPayment = 200000;

        describe('When the amortization period is valid', () => {
            let result: any;
            const amortizationPeriod = 25;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(4970.68);
                });
            });
        });

        describe('When the amortization period is negative', () => {
            const amortizationPeriod = -10;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                })
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Amortization period of -10 is invalid.');
                });
            });
        });

        describe('When the amortization period is not a multiple of 5', () => {
            const amortizationPeriod = 3;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Amortization period of 3 is invalid.');
                });
            });
        });

        describe('When the amortization period is greater than 30', () => {
            const amortizationPeriod = 35;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Amortization period of 35 is invalid.');
                });
            });
        });
    });

    describe('Given a down payment', () => {
        let mortgageCalculator: MortgageCalculator;
        const paySchedule = 'Monthly';
        const amortizationPeriod = 25;
        const interestRate = 5.621;
        
        describe('When the down payment is sufficient given that the property price is 1 million or more', () => {
            let result: any;
            const propertyPrice = 1000000;
            const downPayment = 200000;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(4970.68);
                });
            });
        });

        describe('When the down payment is insufficient given that the property price is 1 million or more', () => {
            const propertyPrice = 1000001;
            const downPayment = 200000;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Down payment of 200000 is insufficient.');
                });
            });
        });

        describe('When the down payment is sufficient given that the property price is 500,000 or less', () => {
            let result: any;
            const propertyPrice = 500000;
            const downPayment = 25000;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(2951.34);
                });
            });
        });

        describe('When the down payment is insufficient given that the property price is 500,000 or less', () => {
            const propertyPrice = 500000;
            const downPayment = 24999;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Down payment of 24999 is insufficient.');
                });
            });
        });

        describe('When the down payment is sufficient given that the property price is greater than 500,000 and less than 1 million', () => {
            let result: any;
            const propertyPrice = 750000;
            const downPayment = 25000 + 25000;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(4349.34);
                });
            });
        });

        describe('When the down payment is larger than the property price', () => {
            let result: any;
            const propertyPrice = 500000;
            const downPayment = 500001;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(0);
                });
            });
        });

        describe('When the down payment is insufficient given that the property price is greater than 500,000 and less than 1 million', () => {
            const propertyPrice = 750000;
            const downPayment = 25000 + 24999;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Down payment of 49999 is insufficient.');
                });
            });
        });
    });

    describe('Given an interest rate', () => {
        let mortgageCalculator: MortgageCalculator;
        const propertyPrice = 1000000;
        const paySchedule = 'Monthly';
        const amortizationPeriod = 25;
        const downPayment = 200000;
        
        describe('When the interest rate is valid', () => {
            let result: any;
            const interestRate = 5.62;

            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then the correct payment per payment schedule is returned', () => {
                    expect(result).toEqual(4970.20);
                });
            });
        });

        describe('When the interest rate is negative', () => {
            const interestRate = -5.62;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);

                })
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Interest rate must be between 0 and 100, inclusive.');
                });
            });
        });

        describe('When the interest rate is zero', () => {
            let result: any;
            const interestRate = 0;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                    result = mortgageCalculator.calculateMortgagePayment();
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(result).toEqual(2666.67);
                });
            });
        });

        describe('When the interest rate is above 100', () => {
            const interestRate = 200;
        
            describe('When I call calculateMortgagePayment', () => {
                beforeEach(() => {
                    mortgageCalculator = new MortgageCalculator(propertyPrice, downPayment, interestRate, amortizationPeriod, paySchedule);
                });
    
                test('Then an error is thrown with a relevant message', () => {
                    expect(() => mortgageCalculator.calculateMortgagePayment()).toThrow('Could not perform calculations. Interest rate must be between 0 and 100, inclusive.');
                });
            });
        });
    });
});