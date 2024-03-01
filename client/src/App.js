import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [inputFields, setInputFields] = useState({
    propertyPrice: '',
    downPayment: 0,
    interestRate: 5.61,
    amortizationPeriod: 5,
    paySchedule: 'Monthly',
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [httpError, setHttpError] = useState('')
  const [inputsValidated, setInputsValidated] = useState(false)

  useEffect(() => {
    if (Object.keys(validationErrors).length === 0 && inputsValidated) {
      const getMortgagePayment = async () => {
        const url = `http://localhost:8000/api/calculate/${inputFields.propertyPrice}/${inputFields.downPayment}/${inputFields.interestRate}/${inputFields.amortizationPeriod}/${inputFields.paySchedule}`
        await fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            if (isNaN(+data)) {
              console.log(true)
              setData(null)
              setHttpError(data)
            } else {
              setHttpError(null)
              setData(data)
            }
          })
          .catch((error) => {
            setHttpError(
              'An unexpected error occurred, please try again later :('
            )
          })
      }

      getMortgagePayment()
    }
  }, [validationErrors])

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateValues(inputFields)
    if (validationErrors) {
      setData(null)
    }

    setValidationErrors(validationErrors)
    setInputsValidated(true)
  }

  const validateValues = (inputValues) => {
    let errors = {}

    if (!inputValues.propertyPrice) {
      errors.propertyPrice = 'Invalid property price'
    }
    if (inputValues.downPayment <= 0) {
      errors.downPayment = 'Invalid down payment'
    }
    if (!inputValues.interestRate || inputValues.interestRate <= 0) {
      errors.interestRate = 'Invalid interest rate'
    }
    if (
      !inputValues.amortizationPeriod ||
      inputValues.amortizationPeriod % 5 !== 0
    ) {
      errors.amortizationPeriod = 'Invalid amortization period'
    }
    if (!inputValues.paySchedule) {
      errors.paySchedule = 'Invalid pay schedule'
    }

    return errors
  }

  return (
    <div className='App'>
      <header className='App-header'>BC Mortgage Calculator</header>
      <form className='App-form' onSubmit={handleSubmit}>
        <label>
          {`Price of property: `}
          <input
            type='text'
            name='propertyPrice'
            value={inputFields.propertyPrice}
            onChange={handleChange}
          />
          {validationErrors.propertyPrice ? (
            <p className='App-error'>
              Price of property should be greater than 0
            </p>
          ) : null}
        </label>

        <label>
          {`Down Payment: `}
          <input
            type='text'
            name='downPayment'
            value={inputFields.downPayment}
            onChange={handleChange}
          />
          {validationErrors.downPayment ? (
            <p className='App-error'>
              Down payment should be greater than 0 and meet mortgage down
              payment requirements
            </p>
          ) : null}
        </label>

        <label>
          {`Interest Rate: `}
          <input
            type='text'
            name='interestRate'
            value={inputFields.interestRate}
            onChange={handleChange}
          />
          {validationErrors.interestRate ? (
            <p className='App-error'>Interest rate should be 0 or greater</p>
          ) : null}
        </label>

        <label>
          {`Payment Frequency: `}
          <select
            name='paySchedule'
            value={inputFields.paySchedule}
            onChange={handleChange}
          >
            <option value='Monthly'>Monthly</option>
            <option value='Bi-Weekly'>Bi-Weekly</option>
            <option value='Accelerated Bi-Weekly'>Accelerated Bi-Weekly</option>
          </select>
          {validationErrors.paySchedule ? (
            <p className='App-error'>Please select a valid pay schedule.</p>
          ) : null}
        </label>

        <label>
          {`Amortization Period: `}
          <select
            name='amortizationPeriod'
            value={inputFields.amortizationPeriod}
            onChange={handleChange}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
            <option value='25'>25</option>
            <option value='30'>30</option>
          </select>

          {validationErrors.amortizationPeriod ? (
            <p className='App-error'>
              Amortization period must be in 5 year increments and between 5 and
              30.
            </p>
          ) : null}
        </label>

        <input className='App-submit' type='submit' value='Submit' />
      </form>

      <div className='App-summary'>
        <p>
          Your <b>{inputFields.paySchedule}</b> payment will be:
        </p>
        <p>
          {data || data === 0
            ? `$${data.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : null}
        </p>
        <p className='App-error'>{httpError ? httpError : null}</p>
      </div>
    </div>
  )
}

export default App
