const Customer = require('../models/customer'); // Thêm dòng này ở đầu file

let currentCustomerID = 1;

async function initializeCustomerID() {
  try {
    // Tìm customer có ID cao nhất
    const lastCustomer = await Customer.findOne({})
      .sort({ customerID: -1 });

    if (lastCustomer) {
      // Lấy số từ customerID (ví dụ: C002 -> 2)
      const lastNumber = parseInt(lastCustomer.customerID.substring(1));
      currentCustomerID = lastNumber + 1;
    }
  } catch (error) {
    console.error('Error initializing customerID:', error);
  }
}

function generateCustomerID() {
  const id = `C${currentCustomerID.toString().padStart(3, '0')}`;
  currentCustomerID += 1;
  return id;
}


module.exports = { generateCustomerID, initializeCustomerID };