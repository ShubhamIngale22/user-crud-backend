const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/db");
const bodyParser = require('body-parser');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
let api = require('./app/routes/api')(app, express)
app.use('/api', api);

// app.use("/api/users", require("./app/routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(` Server running on port ${PORT}`)
);
