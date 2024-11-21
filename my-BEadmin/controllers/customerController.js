const Customer = require('../models/customer');
const Booking = require('../models/booking');
const { generateCustomerID } = require('../lib/idGenerator-utils');

class CustomerController {
  async createCustomer(req, res) {
    try {
      const { fullName, phoneNumber, email } = req.body;

      // Validate input
      if (!fullName || !phoneNumber || !email) {
        return res.status(400).json({ 
          error: 'Vui lòng điền đầy đủ thông tin' 
        });
      }

      let retries = 3;
      let customer = null;

      while (retries > 0 && !customer) {
        try {
          const customerID = generateCustomerID();
          customer = new Customer({
            customerID,
            fullName,
            phoneNumber,
            email
          });
          await customer.save();
        } catch (error) {
          if (error.code === 11000 && retries > 1) {
            // Nếu trùng ID và còn lượt thử, tiếp tục vòng lặp
            retries--;
            continue;
          }
          throw error; // Ném lỗi nếu không phải lỗi trùng ID hoặc hết lượt thử
        }
      }

      if (!customer) {
        throw new Error('Không thể tạo customer ID duy nhất sau nhiều lần thử');
      }

      res.status(201).json({
        success: true,
        data: customer
      });

    } catch (error) {
      console.error('Create customer error:', error);
      res.status(400).json({
        error: error.message || 'Không thể tạo thông tin khách hàng'
      });
    }
  }

  async getCustomers(req, res) {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findOne({ customerID: req.params.id });
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { customerID: req.params.id },
        req.body,
        { new: true }
      );
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCustomer(req, res) {
    try {
      // Check if customer has any active bookings
      const activeBookings = await Booking.findOne({
        customerID: req.params.id,
        status: { $in: ['Pending', 'Confirmed'] }
      });

      if (activeBookings) {
        return res.status(400).json({
          error: 'Cannot delete customer with active bookings'
        });
      }

      const customer = await Customer.findOneAndDelete({ 
        customerID: req.params.id 
      });
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get customer bookings
  async getCustomerBookings(req, res) {
    try {
      const bookings = await Booking.find({ customerID: req.params.id })
        .populate('courtID')
        .sort({ bookingDate: -1 });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CustomerController();