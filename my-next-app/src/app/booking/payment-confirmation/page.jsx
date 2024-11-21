'use client'

import { Clock, User, Home,ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'



export default function PaymentConfirmation() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState({
    courtID: '',
    bookingDate: '',
    timeslots: [{ dayOfWeek: '', duration: '' }],
    customerInfo: { fullName: '', phoneNumber: '', email: '' },
    totalPrice: 0,
  });

  useEffect(() => {
    // Lấy dữ liệu booking từ localStorage
    const data = localStorage.getItem('bookingData');
    if (data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      setBookingData(JSON.parse(data));
    }
  }, []);

  const parseCustomDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    let [hour, minute] = timePart.split(":").map(Number);
  
    // Kiểm tra SA/CH để xác định AM/PM
    if (dateString.includes("CH") && hour < 12) {
      hour += 12;
    } else if (dateString.includes("SA") && hour === 12) {
      hour = 0;
    }
  
    return new Date(year, month - 1, day, hour, minute);
  };
  
  // Hàm định dạng ngày với SA/CH
  const formatDateTime = (date) => {
    if (!date) return "Ngày không hợp lệ";
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "CH" : "SA";
  
    // Chuyển đổi từ 24 giờ sang 12 giờ
    hours = hours % 12 || 12;
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
  
    return ` ${day}/${month}/${year} ${hours}:${minutes} ${period}`;
  };
  
  // Chuyển đổi và định dạng bookingDate
  const formattedDate = bookingData.bookingDate ? formatDateTime(parseCustomDate(bookingData.bookingDate)) : "Ngày không hợp lệ";
  

  const handlePayment2 = () => {
    router.push('/booking/payment2');
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-transparent text-black p-6 relative">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center">
            <ChevronLeft className="mr-2 text-[#38a3df] h-6 w-6" />
            <span className="text-[#38a3df]">Back</span>
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 max-w-3xl mt-8">
        {/* Centered Title */}
        <h1 className="text-4xl font-bold text-center text-[#38a3df]">THANH TOÁN</h1>
        <Card className="mb-6 mt-6 relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#38a3df]">THÔNG TIN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-[#38a3df]" />
              <span> Badminton - 86 Trần Hưng Đạo - {bookingData.courtCount}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-[#38a3df]" />
              <span>{bookingData.customerInfo.fullName} - {bookingData.customerInfo.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#38a3df]" />
              {formattedDate ? (
                <span>{formattedDate.toLocaleString("en-GB", { hour12: true })}</span>
              ) : null}
            </div>
            <div className="flex justify-between">
              <span>Thuê sân ({bookingData.court})</span>
              <span>{bookingData.totalPrice.toLocaleString()} VND</span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{bookingData.court}</span>
              <span>{bookingData.timeDuration}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#38a3df]">TỔNG THANH TOÁN TRƯỚC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{bookingData.totalPrice.toLocaleString()} VND</div>
            <div className="text-lg text-[#38a3df] mb-2">PHƯƠNG THỨC THANH TOÁN</div>
            <RadioGroup defaultValue="qr">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qr" id="qr" />
                <Label htmlFor="qr" className="text-sm">Chuyển khoản (QR)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button 
        className="w-full bg-[#38a3df] text-white hover:bg-[#2b82bb]"
        onClick={handlePayment2}>
          TIẾP TỤC
        </Button>
      </main>
    </div>
  )
}