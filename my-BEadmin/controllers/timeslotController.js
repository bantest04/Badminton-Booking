const BookingTimeslot = require('../models/bookingtimeslot');
const Booking = require('../models/booking');
const { validateTimeslot } = require('../lib/validation');

class TimeslotController {
  // Create timeslot
  async createTimeslot(req, res) {
      try {
          const {
              bookingID,
              courtID,
              startTime,
              endTime,
              dayOfWeek,
              duration
          } = req.body;

          const timeslot = new BookingTimeslot({
              timeslotID: `TS${Date.now()}`,
              bookingID,
              courtID,
              startTime: new Date(startTime),
              endTime: new Date(endTime),
              dayOfWeek,
              duration
          });

          await timeslot.save();

          res.status(201).json({
              success: true,
              data: timeslot
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Lỗi khi tạo timeslot',
              error: error.message
          });
      }
  }

  // Get all timeslots
  async getTimeslots(req, res) {
    try {
        const timeslots = await BookingTimeslot.find()
            .select('startTime endTime courtID')
            .sort({ startTime: 1 });

        res.json(timeslots);
    } catch (error) {
        console.error('Error fetching timeslots:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách timeslot',
            error: error.message
        });
    }
}

  // Get timeslot by ID
  async getTimeslotById(req, res) {
    try {
      const timeslot = await BookingTimeslot.findOne({ 
        timeslotID: req.params.id 
      }).populate('bookingID');
      
      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }
      res.json(timeslot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update timeslot
  async updateTimeslot(req, res) {
    try {
      if (req.body.startTime || req.body.endTime) {
        const isConflict = await BookingTimeslot.checkConflict(
          req.body.startTime || req.body.currentStartTime,
          req.body.endTime || req.body.currentEndTime,
          req.body.courtID,
          req.body.dayOfWeek,
          req.params.id
        );

        if (isConflict) {
          return res.status(400).json({ error: 'Timeslot conflict exists' });
        }
      }

      const timeslot = await BookingTimeslot.findOneAndUpdate(
        { timeslotID: req.params.id },
        req.body,
        { new: true }
      );

      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }

      res.json(timeslot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete timeslot
  async deleteTimeslot(req, res) {
    try {
      const timeslot = await BookingTimeslot.findOneAndDelete({
        timeslotID: req.params.id
      });

      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }

      res.json({ message: 'Timeslot deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAvailableTimeslots(req, res) {
    try {
      const { date, courtId } = req.query;

      if (!date || !courtId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp ngày và mã sân'
        });
      }

      // Convert string date to Date object
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

      // Find all bookings for the selected court and date
      const bookedTimeslots = await BookingTimeslot.find({
        courtId,
        $and: [
          { startTime: { $gte: startOfDay } },
          { endTime: { $lte: endOfDay } }
        ]
      }).populate({
        path: 'bookingId',
        select: 'status',
        match: { status: { $ne: 'Cancelled' } }
      });

      // Filter out cancelled bookings
      const validBookedSlots = bookedTimeslots.filter(slot => slot.bookingId !== null);

      res.json({
        success: true,
        data: validBookedSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          bookingId: slot.bookingId
        }))
      });

    } catch (error) {
      console.error('Error in getAvailableTimeslots:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra timeslot',
        error: error.message
      });
    }
  }
}

module.exports = new TimeslotController();