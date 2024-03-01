require('dotenv').config()

const express = require('express');
const cors = require('cors');
const amortization = require('./routes/amortizationRoutes');

const app = express();

app.use(cors());
app.use('/api', amortization);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});