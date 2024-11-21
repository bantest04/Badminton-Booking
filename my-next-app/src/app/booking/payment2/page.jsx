'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Copy, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5100/api';

export default function PaymentQRCode() {
  const [bookingData, setBookingData] = useState({totalPrice: 0});
  const [bookingId, setBookingId] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTransferred, setIsTransferred] = useState(false);
  const [qrString, setQrString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Khởi tạo QR string với format của VietQR
  useEffect(() => {
    // Lấy thông tin booking từ localStorage
    const data = JSON.parse(localStorage.getItem('bookingData'));
    if (data) {
      const processedData = {
        ...data,
        totalPrice: typeof data.totalPrice === 'number' ? data.totalPrice : 0
      };
      setBookingData(processedData);
      // Tạo mã booking ngẫu nhiên hoặc tuần tự (giả sử đây là cách tạo ngẫu nhiên cho ví dụ)
      const newBookingId = `00${Math.floor(Math.random() * 9000) + 1000}`;
      setBookingId(newBookingId);
      // Format: https://www.vietqr.io/portal-service/gen-qr-code/guide
      const bankBin = '970436'; // Vietcombank BIN
      const accountNumber = '1021691733';
      const amount = processedData.totalPrice.toString();
      const content = 'Thanh toan lich hen ${newBookingId}';
    
      // Tạo chuỗi theo định dạng VietQR
      const qrData = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent('TRUONG QUANG HOAI VU')}`;

      setQrString(qrData);
    }
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
      setIsLoading(true);
      const parseCustomDate = (dateString) => {
        try {
          const [datePart, timePart, period] = dateString.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          let [hours, minutes] = timePart.split(':').map(Number);
          
          // Convert 12h to 24h format
          if (period === 'CH' && hours < 12) {
            hours += 12;
          } else if (period === 'SA' && hours === 12) {
            hours = 0;
          }
          
          return new Date(year, month - 1, day, hours, minutes);
        } catch (error) {
          console.error('Error parsing date:', error);
          throw new Error('Invalid date format');
        }
      };

      // Tạo customer trước
      const customerResponse = await axios.post(`${API_BASE_URL}/customers`, {
        fullName: bookingData.customerInfo.fullName,
        phoneNumber: bookingData.customerInfo.phoneNumber,
        email: bookingData.customerInfo.email
      });

      const formattedBookingDate = parseCustomDate(bookingData.bookingDate);
      
      // Extract duration from selectedTime (e.g. "30 phút" -> 30)
      const duration = parseInt(bookingData.timeslots[0].duration.split(' ')[0]);
      
      // Calculate end time
      const endTime = new Date(formattedBookingDate);
      endTime.setMinutes(endTime.getMinutes() + duration);
      // const bookingDate = formatDateTime(bookingData.bookingDate);
      // const startTime = new Date(bookingDate);
      // const endTime = new Date(startTime);
      // endTime.setMinutes(endTime.getMinutes() + parseInt(bookingData.timeslots[0].duration));

      const formattedData = {
      customerID: customerResponse.data.data.customerID,
        courtID: bookingData.courtID || 'A1',
        bookingDate: formattedBookingDate.toISOString(),
        totalPrice: bookingData.totalPrice,
        timeslots: [{
          courtID: bookingData.courtID || 'A1',
          startTime: formattedBookingDate.toISOString(),
          endTime: endTime.toISOString(),
          dayOfWeek: formattedBookingDate.toLocaleString('en-US', { weekday: 'long' }),
          duration: duration
        }],
        status: 'Pending'
      };
  
      const response = await axios.post(`${API_BASE_URL}/bookings`, formattedData);
  
      if (response.status === 201) {
        toast({
          title: "Đặt sân thành công",
          description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi",
        });
        router.push('/booking/payment2/payment-success');
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi đặt sân.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
                <p>Số tiền thanh toán: <span className="text-[#38a3df] font-bold">{bookingData.totalPrice?.toLocaleString() || 0} VND</span></p>
                <div className="flex items-center gap-2">
                  <p>Nội dung chuyển khoản: <span className="font-semibold">Thanh toan lich hen {bookingId}</span></p>
                  <button onClick={() => handleCopy("Thanh toan lich hen ${bookingId}")}>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </button>
                </div>
                <p>Mã lịch hẹn: {bookingId}</p>
              </div>
              <div className="flex justify-center items-center">
                {qrString && (
                  <img 
                    src={qrString}
                    alt="QR Code"
                    width={200}
                    height={200}
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
              {isLoading ? 'ĐANG XỬ LÝ...' : 'HOÀN THÀNH'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}