const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
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

app.listen(PORT, () => {
    console.log(`app is listening at ${PORT}`);
});