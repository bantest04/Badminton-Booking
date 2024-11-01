'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function ThoiGianBatDauPage() {
  const router = useRouter()

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() // Month is zero-indexed
  const currentDay = today.getDate()

  const [selectedDate, setSelectedDate] = useState(today) // Real-time date selection
  const [selectedMonth, setSelectedMonth] = useState(currentMonth) // Real-time month
  const [selectedTime, setSelectedTime] = useState('')
  

  const calculatePrice = (duration) => {
    const basePrice = 35000; 
    const factor = parseInt(duration) / 30; 
    return basePrice * factor;
  };

  const [total, setTotal] = useState(calculatePrice('30 phút'));


  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()} ${selectedTime}`;
      sessionStorage.setItem('selectedDateTime', selectedDateTime);
      router.push('/booking');
    } else {
      alert('Vui lòng chọn cả ngày và giờ để tiếp tục.');
    }
  };

  const sang = [
    { id: 1, time: '05:00 SA' },
    { id: 2, time: '05:30 SA' },
    { id: 3, time: '06:00 SA' },
    { id: 4, time: '06:30 SA' },
    { id: 5, time: '07:00 SA' },
    { id: 6, time: '07:30 SA' },
    { id: 7, time: '08:00 SA' },
    { id: 8, time: '08:30 SA' },
    { id: 9, time: '09:00 SA' },
    { id: 10, time: '09:30 SA' },
    { id: 11, time: '10:00 SA' },
    { id: 12, time: '10:30 SA' },
    { id: 13, time: '11:00 SA' },
    { id: 14, time: '11:30 SA' },
  ]

  const chieu = [
    { id: 15, time: '12:00 CH' },
    { id: 16, time: '12:30 CH' },
    { id: 17, time: '13:00 CH' },
    { id: 18, time: '13:30 CH' },
    { id: 19, time: '14:00 CH' },
    { id: 20, time: '14:30 CH' },
    { id: 21, time: '15:00 CH' },
    { id: 22, time: '15:30 CH' },
    { id: 23, time: '16:00 CH' },
    { id: 24, time: '16:30 CH' },
    { id: 25, time: '17:00 CH' },
    { id: 26, time: '17:30 CH' },
  ]

  const toi = [
    { id: 27, time: '18:00 CH' },
    { id: 28, time: '18:30 CH' },
    { id: 29, time: '19:00 CH' },
    { id: 30, time: '19:30 CH' },
    { id: 31, time: '20:00 CH' },
    { id: 32, time: '20:30 CH' },
    { id: 33, time: '21:00 CH' },
    { id: 34, time: '21:30 CH' },
    { id: 35, time: '22:00 CH' },
    { id: 36, time: '22:30 CH' },
    { id: 37, time: '23:00 CH' },
    { id: 38, time: '23:30 CH' },
  ]

  const handleTimeSelection = (time) => {
    setSelectedTime(time)
  }

  const changeMonth = (direction) => {
    setSelectedMonth((prev) => (direction === 'next' ? prev + 1 : prev - 1))
  }

  const isPastDate = (day) => {
    const selectedDay = new Date(currentYear, selectedMonth, day)
    return selectedDay < new Date(currentYear, currentMonth, currentDay)
  }

  const handleDateSelection = (day) => {
    const newSelectedDate = new Date(currentYear, selectedMonth, day)
    setSelectedDate(newSelectedDate)
    setSelectedTime('')
  }


  useEffect(() => {
    const storedTime = localStorage.getItem('selectedTime');
    if (storedTime) {
      setSelectedTime(storedTime);
      const duration = storedTime.includes('30 phút') ? 30 : parseInt(storedTime); 
      const price = calculatePrice(duration); 
      setTotal(price);
    }
  }, []);



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
        <h1 className="text-4xl font-bold text-center text-[#38a3df]">CHỌN THỜI GIAN BẮT ĐẦU</h1>

        {/* Date Picker */}
        <div className="flex flex-col items-center mt-8">
          <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-[#38a3df] mb-4">1. CHỌN NGÀY</h2>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => changeMonth('prev')}>&lt;</button>
                <h3 className="text-lg">THÁNG {selectedMonth + 1}</h3>
                <button onClick={() => changeMonth('next')}>&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
                  <span key={index} className="text-center text-gray-500">
                    {day}
                  </span>
                ))}
                {/* Dates */}
                {[...Array(31)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                        selectedDate.getDate() === index + 1 && selectedMonth === currentMonth && selectedDate.getFullYear() === currentYear
                          ? 'bg-[#38a3df] text-white' // Apply background and text color when selected
                          : isPastDate(index + 1)
                          ? 'text-gray-300' // Gray color for past dates
                          : 'text-black' // Default color for future dates
                      }`}
                    onClick={() => !isPastDate(index + 1) && handleDateSelection(index + 1)}
                    disabled={isPastDate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Selection */}
          {!isPastDate(selectedDate) && (
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-xl font-bold text-[#38a3df] mb-4">2. CHỌN THỜI GIAN BẮT ĐẦU</h2>

              {/* Morning, Afternoon, Evening Slots */}
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Sáng</h3>
                <div className="grid grid-cols-3 gap-4">
                  {sang.map((hour) => (
                    <button
                      key={hour.id}
                      className={`border px-4 py-2 rounded-lg text-lg ${
                        selectedTime === hour.time
                          ? 'bg-[#38a3df] text-white'
                          : 'bg-white border-gray-300'
                      } hover:bg-[#38a3df] hover:text-white transition`}
                      onClick={() => handleTimeSelection(hour.time)}
                    >
                      {hour.time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Chiều</h3>
                <div className="grid grid-cols-3 gap-4">
                  {chieu.map((hour) => (
                    <button
                      key={hour.id}
                      className={`border px-4 py-2 rounded-lg text-lg ${
                        selectedTime === hour.time
                          ? 'bg-[#38a3df] text-white'
                          : 'bg-white border-gray-300'
                      } hover:bg-[#38a3df] hover:text-white transition`}
                      onClick={() => handleTimeSelection(hour.time)}
                    >
                      {hour.time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Tối</h3>
                <div className="grid grid-cols-3 gap-4">
                  {toi.map((hour) => (
                    <button
                      key={hour.id}
                      className={`border px-4 py-2 rounded-lg text-lg ${
                        selectedTime === hour.time
                          ? 'bg-[#38a3df] text-white'
                          : 'bg-white border-gray-300'
                      } hover:bg-[#38a3df] hover:text-white transition`}
                      onClick={() => handleTimeSelection(hour.time)}
                    >
                      {hour.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Informational Message */}
          <div className="text-center text-[#38a3df] mt-4">
            Nếu không tìm thấy thời gian trống hoặc muốn đặt sân cố định vui lòng gọi đến 
            <span className="text-blue-500"> 0979797779 </span>
            chúng tôi sẽ hỗ trợ tìm lịch hẹn phù hợp với thời gian của bạn
          </div>
        </div>

        {/* Total and Continue Button */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mt-8 mx-auto">
          <p className="text-lg font-bold">TỔNG: {total.toLocaleString()} VND</p>
          <button
            className="w-full bg-[#38a3df] text-white font-bold py-3 mt-4 rounded-lg hover:bg-[#2b82bb] transition"
            onClick={handleContinue}
          >
            TIẾP TỤC ĐẶT
          </button>
        </div>
      </main>
    </div>
  )
}