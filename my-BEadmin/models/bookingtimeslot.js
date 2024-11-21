const mongoose = require('mongoose');

const bookingTimeslotSchema = new mongoose.Schema({
    timeslotID: { type: String, required: true, unique: true },
    bookingID: { type: String, required: true, ref: 'Booking' },
    courtID: {type: String, required: true, ref: 'Court' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    dayOfWeek: { type: String, required: true, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    duration: { type: Number, required: true }
  }, {
    timestamps: true
  });

  
  module.exports = mongoose.model('BookingTimeslot', bookingTimeslotSchema);