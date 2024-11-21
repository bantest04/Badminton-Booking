require('dotenv').config();
const express = require('express');
const { initializeCustomerID } = require('./lib/idGenerator-utils');
const connectDB = require('./config/db');


const app = express();
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
const courtRoutes = require('./routes/courtRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const timeslotRoutes = require('./routes/timeslotRoutes');

connectDB();

initializeCustomerID();

app.use(cors({ origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
 }));

app.use(express.json());


app.use('/api/bookings', bookingRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/timeslots', timeslotRoutes);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
