const Booking = require('../models/booking');
const BookingTimeslot = require('../models/bookingtimeslot');
const { calculateTotalPrice, formatBookingTime, getBookingStatus, validateBookingData } = require('../lib/booking-utils');

class BookingController {
  async createBooking(req, res) {
    try {
      const { customerID, courtID, bookingDate, timeslots, totalPrice } = req.body;

      const existingBooking = await BookingTimeslot.findOne({
        courtID,
        $or: [
          {
            startTime: { $lte: new Date(timeslots[0].startTime) },
            endTime: { $gt: new Date(timeslots[0].startTime) }
          },
          {
            startTime: { $lt: new Date(timeslots[0].endTime) },
            endTime: { $gte: new Date(timeslots[0].endTime) }
          }
        ]
      }).populate('bookingID');
  
      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.'
        });
      }
      
      // Validate required fields
      if (!customerID || !courtID || !bookingDate || !timeslots || !totalPrice) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          requiredFields: ['customerID', 'courtID', 'bookingDate', 'timeslots', 'totalPrice']
        });
      }

      // Create booking
      const booking = new Booking({
        bookingID: `BK${Date.now()}`,
        customerID,
        courtID,
        bookingDate: new Date(bookingDate),
        totalPrice,
        status: 'Pending'
      });

      const savedBooking = await booking.save();

      const bookingTimeslot = new BookingTimeslot({
        timeslotID: `TS${Date.now()}`,
        bookingID: savedBooking.bookingID,
        courtID: timeslots[0].courtID,
        startTime: new Date(timeslots[0].startTime),
        endTime: new Date(timeslots[0].endTime),
        dayOfWeek: timeslots[0].dayOfWeek,
        duration: timeslots[0].duration
      });

      const savedTimeslot = await bookingTimeslot.save();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: savedBooking,
          timeslots: savedTimeslot
        }
      });

    } catch (error) {
      console.error('Error in createBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating booking',
        error: error.message,
        details: error.stack
      });
    }
  }

  async getBookings(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const filter = {};

      // Xây dựng filter
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.bookingDate = {};
        if (startDate) filter.bookingDate.$gte = new Date(startDate);
        if (endDate) filter.bookingDate.$lte = new Date(endDate);
      }

      // Lấy bookings và timeslots
      const bookings = await Booking.find(filter).sort({ bookingDate: -1 });
      const bookingIds = bookings.map(b => b.bookingID);
      const timeslots = await BookingTimeslot.find({
        bookingID: { $in: bookingIds }
      });

      // Map timeslots vào bookings
      const bookingsWithTimeslots = bookings.map(booking => {
        const bookingTimeslots = timeslots.filter(ts => 
          ts.bookingID === booking.bookingID
        );
        
        return {
          ...booking.toObject(),
          timeslots: bookingTimeslots,
          bookingDate: new Date(booking.bookingDate).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      });

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookingsWithTimeslots
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getBooking(req, res) {
    try {
      const booking = await Booking.findOne({ bookingID: req.params.id });
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const timeslots = await BookingTimeslot.find({ bookingID: booking.bookingID });

      res.status(200).json({
        success: true,
        data: {
          ...booking.toObject(),
          timeslots,
          bookingDate: new Date(booking.bookingDate).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        }
      });
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateBooking(req, res) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { bookingID: req.params.id },
        req.body,
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Nếu cập nhật timeslots
      if (req.body.timeslots) {
        await BookingTimeslot.deleteMany({ bookingID: booking.bookingID });
        const timeslotPromises = req.body.timeslots.map(slot => {
          return new BookingTimeslot({
            timeslotID: `TS${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            bookingID: booking.bookingID,
            dayOfWeek: slot.dayOfWeek,
            monthly: slot.monthly || false,
            duration: slot.duration
          }).save();
        });
        await Promise.all(timeslotPromises);
      }

      const updatedBooking = await Booking.findOne({ bookingID: booking.bookingID });
      const timeslots = await BookingTimeslot.find({ bookingID: booking.bookingID });

      res.json({
        success: true,
        data: {
          ...updatedBooking.toObject(),
          timeslots
        }
      });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteBooking(req, res) {
    try {
      const booking = await Booking.findOneAndDelete({ bookingID: req.params.id });
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await BookingTimeslot.deleteMany({ bookingID: req.params.id });

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Delete booking error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BookingController();