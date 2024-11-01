'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function PaymentExpired() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Hết thời gian thanh toán
        </h1>
        <p className="text-gray-600 mb-8">
          Phiên thanh toán đã hết hạn. Vui lòng thử lại.
        </p>
        <Button
          onClick={() => router.push('/payment')}
          className="bg-[#38a3df] text-white hover:bg-[#2980b9]"
        >
          Thử lại
        </Button>
      </div>
    </div>
  );
}