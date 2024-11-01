'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const router = useRouter();
  const appointmentId = 'APPOINTMENT_ID';  // Thay thế với ID của cuộc hẹn
  const amount = 'AMOUNT';  // Thay thế với số tiền thanh toán

  const handlePayment = async () => {
    try {
      const response = await axios.post('/booking/api/confirm-payment', { appointmentId, amount });

      if (response.data.success) {
        alert('Thanh toán thành công!');
      } else {
        alert('Thanh toán thất bại. Vui lòng thử lại!');
        router.push('/payment-account');  // Chuyển lại trang thanh toán nếu thất bại
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Không thể thực hiện thanh toán. Vui lòng thử lại sau.');
      router.push('/payment-account');  // Chuyển lại trang thanh toán nếu lỗi
    }
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thanh toán thành công
        </h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã thanh toán. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất.
        </p>
        <Button
          onClick={() => router.push('/booking')}
          className="bg-[#38a3df] text-white hover:bg-[#2980b9]"
        >
          Quay lại đặt lịch
        </Button>
      </div>
    </div>
  );
}
