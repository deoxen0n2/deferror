var test = require('tape')
var deferror = require('..')

test('1-level deep test', function (t) {
  t.plan(2)

  var errors = deferror([
    {
      name: 'UnuthorizedError',
      code: 'UNAUTHORIZED',
      message: 'User with id {0} is unauthorized for this resource.'
    },
    {
      name: 'ValidationError'
    },
    {
      name: 'TransactionInvalidAmountError',
      code: 'TRANSACTION_INVALID_AMOUNT',
      message: 'The transaction could not be completed with the amount {0} USD specified. The amount exceeds your balance of {1} USD.'
    }
  ])

  var transactionInvalidAmountError = new errors.TransactionInvalidAmountError(120, 100)

  t.ok(transactionInvalidAmountError instanceof Error, 'Instance of the defined error constructor should be instanceof Error')

  t.equal(transactionInvalidAmountError.message, 'The transaction could not be completed with the amount 120 USD specified. The amount exceeds your balance of 100 USD.', 'The error message of the instance of the defined error constructor should be formatted properly')
})

test('2-level deep test', function (t) {
  t.plan(3)

  var errors = deferror([
    {
      name: 'TransactionError',
      code: 'TRANSACTION',
      errors: [
        {
          name: 'InvalidAmountError',
          code: 'INVALID_AMOUNT',
          message: 'The transaction could not be completed with the amount {0} USD specified. The amount exceeds your balance of {1} USD.'
        }
      ]
    }
  ])

  var transactionInvalidAmountError = new errors.TransactionError.InvalidAmountError(120, 100)

  t.ok(transactionInvalidAmountError instanceof Error, 'Instance of the defined error constructor should be instanceof Error')

  t.equal(transactionInvalidAmountError.message, 'The transaction could not be completed with the amount 120 USD specified. The amount exceeds your balance of 100 USD.', 'The error message of the instance of the defined error constructor should be formatted properly')

  t.equal(transactionInvalidAmountError.code, 'TRANSACTION::INVALID_AMOUNT', 'The error code should be namespaced')
})
