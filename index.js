const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json())
app.use(morgan("dev"))

app.use(cors())

//SERVER RUN
app.listen(port, () => {
    console.log(`Server backend FIND-IT 2024 IT COMPETITION running on port http://localhost:${port}`);
})