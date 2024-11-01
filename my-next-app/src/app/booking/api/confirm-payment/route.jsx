// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { appointmentId, amount } = body;

//     // ở đây có thể thêm kiểm tra với cổng thanh toán, cập nhật database để xác thực 
//     // vd: xác thực khi người dùng đã chuyển tiền

//     // Giả lập delay để test
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Thanh toán thành công',
//       data: {
//         appointmentId,
//         amount,
//         transactionId: Math.random().toString(36).substr(2, 9),
//         timestamp: new Date().toISOString()
//       }
//     });

//   } catch (error) {
//     console.error('Payment confirmation error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Lỗi xử lý thanh toán' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { appointmentId, amount } = body;

    // Gửi yêu cầu tới backend để xác nhận booking
    const response = await fetch('http://localhost:5100/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointmentId, amount }),
    });

    // Kiểm tra phản hồi từ backend
    if (!response.ok) {
      throw new Error('Failed to confirm booking with backend');
    }

    const responseData = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Thanh toán thành công',
      data: {
        ...responseData,
        transactionId: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý thanh toán' },
      { status: 500 }
    );
  }
}
