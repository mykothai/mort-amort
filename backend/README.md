# mort-amort
BC mortgage calculator API - Displays the amount ($) to be paid per payment schedule.

## Deploy Locally

npm run dev
npm run start

Hot reloading is supported during development. To run the application with hot reloading run 
```
npm run dev
```

If hot reloading is not desired, run:
```
npm run start
```
<br>

Navigate to `http://localhost:8000/api/calculate/:price/:downPayment/:rate/:amortPeriod/:paySchedule`
and replace each param with the desired value. Calling this url results in a single number that represents the payment amount in dollars, given the pay schedule inputted.

- __Price__: positive number
- __Down payment__: positive number
- __Rate__: positive number
- __Amortization Period__: Increments of 5 between 5 and 30, inclusive
- __Pay Schedule__: one of 'Monthly', 'Bi-Weekly', 'Accelerated Bi-Weekly'

example:
```
http://localhost:8000/api/calculate/1000000/200000/5.61/25/bi-weekly
```


## Unit Tests
```
npm run test
```