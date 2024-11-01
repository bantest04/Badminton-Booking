'use client'

import { useState,useEffect,Suspense } from 'react'
import { useRouter,useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock, Calendar, ChevronDown, Minus, Plus, Home,User, Phone, Mail } from 'lucide-react'
import dynamic from 'next/dynamic';
import axios from 'axios';


function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams() // Get search params from URL
  const [courtCount, setCourtCount] = useState(1)
  const [showTimeOptions, setShowTimeOptions] = useState(false)
  const [selectedTime, setSelectedTime] = useState('30 phút')
  const [randomCourt, setRandomCourt] = useState(true)
  const [selectedDateTime, setSelectedDateTime] = useState('Vui lòng chọn thời gian bắt đầu!') // Default message
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [total, setTotal] = useState(0); 
  const selectedCourtFromQuery = searchParams.get('court') // Get court from query params
  const timeOptions = Array.from({ length: 8 }, (_, index) => `${(index + 1) * 30} phút`)

  useEffect(() => {
    // Kiểm tra và hiển thị thông báo nếu số lượng sân > 4
    setShowWarning(courtCount > 4);
  }, [courtCount]);

  useEffect(() => {
    setShowWarning(courtCount > 4);
  }, [courtCount]);

  useEffect(() => {
    // Lưu giá trị khi người dùng thay đổi
    localStorage.setItem('courtCount', courtCount);
  }, [courtCount]);

  useEffect(() => {
    const storedTime = localStorage.getItem('selectedTime');
    if (storedTime) {
      setSelectedTime(storedTime);
    }
  }, []);
  

  useEffect(() => {
    const storedDateTime = sessionStorage.getItem('selectedDateTime');
    if (storedDateTime) {
      setSelectedDateTime(storedDateTime);
    }
      return () => {
        sessionStorage.removeItem('selectedDateTime')
      }
  }, [])

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    if (selectedCourtFromQuery) {
      setRandomCourt(false);
    }
  }, [selectedCourtFromQuery]);

  const handleIncreaseCourtCount = () => {
    if (courtCount < 4) {
      setCourtCount(courtCount + 1);
    } else {
      setShowWarning(true); // Hiển thị thông báo khi vượt quá 4 sân
    }
  };

  const handleDecreaseCourtCount = () => {
    if (courtCount > 1) {
      setCourtCount(courtCount - 1);
    }
  };

  const navigateToStartTime = () => {
    router.push('/booking/starttime') 
  }

  const calculatePrice = (duration) => {
    const basePrice = 35000;
    const factor = parseInt(duration) / 30;
    return basePrice * factor;
  };

  useEffect(() => {
  if (selectedTime) {
    const price = calculatePrice(selectedTime);
    setTotal(price);
  }
}, [selectedTime]);
  

const handleTimeSelection = (time) => {
  setSelectedTime(time);
  setShowTimeOptions(false);
  localStorage.setItem('selectedTime', time);
};

  const handleChooseCourt = () => {
    router.push('/booking/choosecourt');
  };
  

  const isFormComplete = () => {
    return name && phone && email && selectedDateTime && selectedTime;
  };

  const isFormValid = () => {
    const newErrors = {};
    if (!/^[A-Za-zÀ-ỹ\s]{2,}$/.test(name)) {
      newErrors.name = "Tên chỉ được chứa chữ cái và ít nhất 2 ký tự.";
    }
    if (!/^\d{10,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.";
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = "Email không hợp lệ. Vui lòng nhập đúng định dạng.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    router.push('/booking/payment');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#38a3df]">THÔNG TIN LỊCH HẸN</h1>
        <div className="grid gap-8">

          {/* Address Card */}
          <div className="relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">           
             <h2 className="text-xl font-bold text-[#38a3df] mb-4">1. ĐỊA CHỈ</h2>
            <div className="flex items-center p-4 rounded border border-[#38a3df] bg-white">
              <Home className="mr-3 text-[#38a3df] h-6 w-6" />
              <p className="text-lg font-semibold text-black">Badminton - 86 Trần Hưng Đạo</p>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                  <Label className="text-lg">Chọn số lượng sân:</Label>
                  <Button variant="outline" size="icon" onClick={handleDecreaseCourtCount}>
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="text-xl">{courtCount}</span>
                  <Button variant="outline" size="icon" onClick={handleIncreaseCourtCount}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
            </div>
            {showWarning && (
                <p className="text-red-500 text-sm mt-2">
                  Nếu sân bạn đặt trên 4 sân, vui lòng gọi cho chúng tôi 0395 342 997
                </p>
              )}
          </div>
          

          {/* Appointment Card */}
          {Array.from({ length: courtCount }).map((_, index) => (
          <div className="relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-[#38a3df] mb-4">2.{index + 1} LỊCH HẸN {index + 1}</h2>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Thuê sân (vãng lai)</h3>
                  <p className="text-lg text-muted-foreground">
                  {randomCourt ? 'Sắp xếp sân ngẫu nhiên' : selectedCourtFromQuery}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleChooseCourt}
                    className="text-lg bg-[#38a3df] text-white hover:bg-[#2b82bb]"
                  >
                    Chọn sân &gt;&gt;
                  </Button>
                  {/* Time selection button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowTimeOptions(!showTimeOptions)}
                      className="text-lg flex items-center"
                    >
                      <Clock className="mr-2 h-5 w-5" />
                      {selectedTime}
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </Button>
                    {/* Dropdown for time options */}
                    {showTimeOptions && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                        {timeOptions.map((time) => (
                          <Button
                            key={time}
                            variant="ghost"
                            className="w-full justify-start text-left text-lg py-2 hover:bg-gray-100"
                            onClick={() => handleTimeSelection(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              

          {/* Double Line Separator */}
          <div className="w-full border-t-2 border-b-2 border-[#38a3df] my-6"></div>

              {/* Price list */}
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Bảng giá tính từ thứ 2 đến thứ 6</h4>
                  <table className="w-full text-lg">
                    <thead>
                      <tr>
                        <th className="text-left">Khung giờ</th>
                        <th className="text-right">Giá/ 60 Phút</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>05:00 - 16:00</td>
                        <td className="text-right">70,000 VND</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <div className="w-full h-[1px] bg-gray-200 my-2"></div>
                        </td>
                      </tr>
                      <tr>
                        <td>16:00 - 23:45</td>
                        <td className="text-right">130,000 VND</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Gradient Divider */}
                <div className="w-full h-[2px] bg-gradient-to-r from-[#38a3df] to-white my-6"></div>

                <div>
                  <h4 className="text-xl font-semibold mb-2">Bảng giá tính từ thứ 7 đến Chủ nhật</h4>
                  <table className="w-full text-lg">
                    <thead>
                      <tr>
                        <th className="text-left">Khung giờ</th>
                        <th className="text-right">Giá/ 60 Phút</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>05:00 - 8:00</td>
                        <td className="text-right">70,000 VND</td>
                      </tr>

                      {/* Subtle Divider Between Time Slots */}
                      <tr>
                        <td colSpan="2">
                          <div className="w-full h-[1px] bg-gray-200 my-2"></div>
                        </td>
                      </tr>

                      <tr>
                        <td>08:00 - 23:45</td>
                        <td className="text-right">130,000 VND</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </div>
            ))}
          {/* Start Time Card */}
          <div className="relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200"
              onClick={navigateToStartTime}
          >
            <h2 className="text-2xl font-bold text-[#38a3df] mb-4">3. Thời Gian Bắt Đầu</h2>
            <div 
              className="flex items-center justify-between p-4 rounded border border-gray-300 hover:border-[#38a3df] hover:shadow-lg transition duration-200"
            >
              <p className="text-lg text-muted-foreground">
              {selectedDateTime}
              </p>
              <Calendar className="h-6 w-6 text-[#38a3df]" /> {/* Calendar icon here */}
            </div>
          </div>

          {/* Contact Card */}
          <div className="relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-[#38a3df] mb-4">4. Liên Hệ</h2>
            <CardContent>
              <form className="space-y-4">
                {/* Name */}
                <div className="flex items-center p-4 rounded border border-gray-300 hover:border-[#38a3df] hover:shadow-lg transition duration-200">
                  <User className="text-[#38a3df] h-6 w-6 mr-3" /> 
                  <input 
                    id="name" 
                    placeholder="Nhập tên của bạn..." 
                    className="text-lg w-full border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={isFormValid}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="flex items-center p-4 rounded border border-gray-300 hover:border-[#38a3df] hover:shadow-lg transition duration-200">
                  <Phone className="text-[#38a3df] h-6 w-6 mr-3" /> 
                  <input 
                    id="phone" 
                    type="tel" 
                    placeholder="Nhập số điện thoại (bắt buộc)..." 
                    className="text-lg w-full border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={isFormValid}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="flex items-center p-4 rounded border border-gray-300 hover:border-[#38a3df] hover:shadow-lg transition duration-200">
                  <Mail className="text-[#38a3df] h-6 w-6 mr-3" /> 
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="Nhập email của bạn..." 
                    className="text-lg w-full border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={isFormValid}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Note */}
                <div className="flex items-center p-4 rounded border border-gray-300 hover:border-[#38a3df] hover:shadow-lg transition duration-200">
                  <textarea 
                    id="note" 
                    placeholder="Ghi chú..." 
                    className="text-lg w-full border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                    
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="button" className="w-full text-lg bg-[#38a3df] text-white hover:bg-[#2b82bb] transition"
                  onClick={handlePayment}
                  disabled={!isFormComplete() || Object.keys(errors).length > 0}
                  >
                  THANH TOÁN
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </main>
    </div>
    </Suspense>
  )
}
export default dynamic(() => Promise.resolve(BookingPage), { ssr: false });
