'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
export default function PaymentSuccess() {
  const router = useRouter();

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
