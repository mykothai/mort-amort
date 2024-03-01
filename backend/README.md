# NodeJs Backend

## Deploy Locally
### Optional: 
Navigate to `./backend` and create a `.env` file and add 
```
PORT=8000
```
If the .env file or the PORT variable does not exist, the application will default to port `8000`.


In the `./backend` folder, run one of two scripts:

### 1. `npm run dev`

Hot reloading is supported when this script is run.
```
$ npm install // if repo cloned for the first time
$ npm run dev
```

This only deploys the backend on [http://localhost:8000](http://localhost:8000).\
To deploy both backend and frontend together see 

### 2. `npm run start`


To run the backend and the frontend together, use:
```
$ npm install // if repo cloned for the first time
$ npm run start
```

Note: Backend hot reload is not supported.

## Usage

If both the frontend and backend are deployed, simply open [http://localhost:3000](http://localhost:3000)


### Backend deployment only

Navigate to `http://localhost:8000/api/calculate/:price/:downPayment/:rate/:amortPeriod/:paySchedule`\
and replace each param with the desired value.\
Calling this url results in a single number that represents the payment amount in dollars, given the pay schedule inputted.

- __Price__: positive number
- __Down payment__: positive number
- __Rate__: positive number
- __Amortization Period__: Increments of 5 between 5 and 30, inclusive
- __Pay Schedule__: one of 'Monthly', 'Bi-Weekly', 'Accelerated Bi-Weekly'

example:
`http://localhost:8000/api/calculate/1000000/200000/5.61/25/bi-weekly`

Or simply test the API in a CLI using cURL
```
$ cURL http://localhost:8000/api/calculate/:price/:downPayment/:rate/:amortPeriod/:paySchedule

$ cURL http://localhost:8000/api/calculate/1000000/200000/5.61/25/bi-weekly
```

## Unit Tests
```
npm run test
```