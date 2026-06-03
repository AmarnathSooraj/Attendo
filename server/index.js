const express = require('express');
const cors = require('cors');
const app = express();

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const attendenceRoutes = require("./routes/attendenceRoutes");

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/', otpRoutes);
app.use('/', attendenceRoutes);

app.listen(5000, () => {
    console.log("app is listening at 5000");
});