# `deferror`

Define hierarchical-structured error constructors, the easy way.

## Install

```bash
$ npm install --save deferror
```

## Usage

```js
var deferror = require('deferror')

var errors = deferror([
  {
    name: 'TransactionError',
    code: 'TRANSACTION',
    errors: [
      {
        name: 'InvalidAmountError',
        code: 'INVALID_AMOUNT',
        message: 'The transaction could not be completed with the amount {0} USD specified. The amount exceeds your balance of {1} USD.'
      },
      {
        name: 'NotFoundError',
        code: 'NOT_FOUND',
        message: 'The transaction with the ID: {0} could not be found.'
      }
    ]
  }
])

var transactionInvalidAmountError = new errors.TransactionError.InvalidAmountError(120, 100)

assert(transactionInvalidAmountError instanceof Error)

assert(transactionInvalidAmountError instanceof errors.TransactionError.InvalidAmountError)

assert.equal(transactionInvalidAmountError.message, 'The transaction could not be completed with the amount 120 USD specified. The amount exceeds your balance of 100 USD.')

assert.equal(transactionInvalidAmountError.code, 'TRANSACTION::INVALID_AMOUNT')
```

## Test

```bash
$ npm test
```

## License

MIT &copy; 2016 Saran Siriphantnon &lt;deoxen0n2@gmail.com&gt;
