'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Copy, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';

export default function PaymentQRCode() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTransferred, setIsTransferred] = useState(false);
  const [qrString, setQrString] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  // Khởi tạo QR string với format của VietQR
  useEffect(() => {
    // Format: https://www.vietqr.io/portal-service/gen-qr-code/guide
    const bankBin = '970436'; // Vietcombank BIN
    const accountNumber = '1021691733';
    const amount = '60000';
    const content = 'Thanh toan lich hen001970';
    
    // Tạo chuỗi theo định dạng VietQR
    const qrData = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent('TRUONG QUANG HOAI VU')}`;

    setQrString(qrData);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast({
            title: "Hết thời gian thanh toán",
            description: "Vui lòng thực hiện lại giao dịch",
            variant: "destructive"
          });
          router.push('/booking/payment2/payment-expired');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, toast]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Đã sao chép",
        description: "Nội dung đã được sao chép vào clipboard",
      });
    } catch (err) {
      toast({
        title: "Không thể sao chép",
        description: "Vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch('/booking/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: '001970',
          amount: 60000,
        }),
      });

      if (!response.ok) throw new Error('Lỗi xác nhận thanh toán');

      toast({
        title: "Thanh toán thành công",
        description: "Cảm ơn bạn đã thanh toán",
      });
      
      router.push('/booking/payment2/payment-success');
    } catch (error) {
      toast({
        title: "Lỗi xác nhận thanh toán",
        description: "Vui lòng thử lại sau",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-transparent text-black p-6 relative">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center">
            <ChevronLeft className="mr-2 text-[#38a3df] h-6 w-6" />
            <span className="text-[#38a3df]">Back</span>
          </button>
          <div className="text-[#38a3df] font-bold">
            Thời gian còn lại: {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl mt-8">
        <h1 className="text-4xl font-bold text-center text-[#38a3df] mb-8">THANH TOÁN</h1>

        <Card className="mb-6 relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2" />
                <p className="text-sm">
                  Vui lòng thanh toán và XÁC NHẬN ĐÃ CHUYỂN KHOẢN trước khi thời gian kết thúc và không tắt trình duyệt!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="font-semibold mb-2">Thông Tin Lịch Hẹn</h2>
                <p>Số tiền thanh toán: <span className="text-[#38a3df] font-bold">60.000 VND</span></p>
                <div className="flex items-center gap-2">
                  <p>Nội dung chuyển khoản: <span className="font-semibold">Thanh toan lich hen001970</span></p>
                  <button onClick={() => handleCopy("Thanh toan lich hen001970")}>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </button>
                </div>
                <p>Mã lịch hẹn: 001970</p>
                <p>Nhà cung cấp: IDTEK</p>
              </div>
              <div className="flex justify-center items-center">
                {qrString && (
                  <img 
                    src={qrString}
                    alt="QR Code"
                    width={150}
                    height={150}
                  />
                )}
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2">Quét Mã QR Để Thanh Toán</h3>
              <p>Ngân hàng: Vietcombank</p>
              <div className="flex items-center justify-center gap-2">
                <p>STK: 1021691733</p>
                <button onClick={() => handleCopy("1021691733")}>
                  <Copy className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
              <p>Tên STK: TRUONG QUANG HOAI VU</p>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="transferred" 
                checked={isTransferred} 
                onCheckedChange={(checked) => setIsTransferred(checked)}
              />
              <Label htmlFor="transferred">Xác nhận đã chuyển khoản</Label>
            </div>

            <Button 
              className="w-full bg-[#38a3df] text-white hover:bg-[#2980b9]" 
              disabled={!isTransferred || timeLeft === 0}
              onClick={handleComplete}
            >
              HOÀN THÀNH
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}