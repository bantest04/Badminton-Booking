'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useBookingAvailability } from '@/app/hooks/useBookingAvailability';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5100/api';

export default function ThoiGianBatDauPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCourtId = searchParams.get('court')|| 'A1';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showTotal, setShowTotal] = useState(false);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);
  
  const [duration, setDuration] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedDuration') || sessionStorage.getItem('selectedDuration') || '30 phút';
    }
    return '30 phút';
  });
  // const { isLoading, isTimeSlotAvailable } = useBookingAvailability(selectedDate, selectedCourtId);
  // const [duration, setDuration] = useState(() => {
  //   const storedDuration = Cookies.get('selectedDuration');
  //   return storedDuration || '30 phút';
  // });
  
  // useEffect(() => {
  //   Cookies.set('selectedDuration', duration);
  // }, [duration]);

  useEffect(() => {
    const storedDuration = localStorage.getItem('selectedDuration');
    if (storedDuration) {
      setDuration(storedDuration);
      // Đồng bộ với sessionStorage
      sessionStorage.setItem('selectedDuration', storedDuration);
    }
  }, []);

  useEffect(() => {
    console.log('Current URL params:', Object.fromEntries(searchParams.entries()));
    console.log('Selected Court ID:', selectedCourtId);
  }, [searchParams, selectedCourtId]);

  
  useEffect(() => {
    const storedDuration = localStorage.getItem('selectedDuration');
    if (storedDuration) {
      setDuration(storedDuration);
    }
  }, []);

  const calculatePrice = (selectedHour, selectedDate) => {
    if (!selectedHour || !selectedDate) return null;

    const hour = parseInt(selectedHour.split(':')[0]);
    const dayOfWeek = selectedDate.getDay();

    const durationInMinutes = parseInt(duration.split(' ')[0]);

    let basePrice;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      basePrice = (hour >= 5 && hour < 16) ? 70000 : 130000;
    } else {
      basePrice = (hour >= 5 && hour < 8) ? 70000 : 130000;
    }

    return Math.round((basePrice / 60) * durationInMinutes);
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
  
  const isTimeSlotAvailable = (time) => {
    if (!selectedDate || !selectedCourtId) return true;

    // Parse thời gian được chọn
    const [hours, minutes] = time.replace(/[SA|CH]/g, '').trim().split(':').map(Number);
    let adjustedHours = hours;
    
    // Chuyển đổi sang 24h format
    if (time.includes('CH') && hours < 12) {
      adjustedHours = hours + 12;
    } else if (time.includes('SA') && hours === 12) {
      adjustedHours = 0;
    }

    const selectedStartTime = new Date(selectedDate);
    selectedStartTime.setHours(adjustedHours, minutes, 0, 0);

    // Lấy thời lượng đặt sân
    const durationInMinutes = parseInt(duration.split(' ')[0]);
    const selectedEndTime = new Date(selectedStartTime.getTime() + durationInMinutes * 60000);

    // Kiểm tra xem có trùng với các booking hiện tại không
    return !bookedSlots.some(slot => {
      const existingStartTime = new Date(slot.startTime);
      const existingEndTime = new Date(slot.endTime);

      return (
        // Kiểm tra các trường hợp trùng lặp
        (selectedStartTime >= existingStartTime && selectedStartTime < existingEndTime) ||
        (selectedEndTime > existingStartTime && selectedEndTime <= existingEndTime) ||
        (selectedStartTime <= existingStartTime && selectedEndTime >= existingEndTime)
      );
    });
  };
  // Effect để lưu duration vào localStorage khi thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDuration', duration);
    }
  }, [duration]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      // Reset error state
      setError(null);
      
      // Kiểm tra điều kiện trước khi gọi API
      if (!selectedDate || !selectedCourtId) {
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        
        // Format date để gửi lên API
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log('Fetching slots for:', {
          date: formattedDate,
          courtId: selectedCourtId
        });
        const response = await axios.get(`${API_BASE_URL}/timeslots`, {
          params: {
            date: formattedDate,
            courtId: selectedCourtId
          }
        });

        console.log('API Response:', response.data);

        // Kiểm tra response
        if (response && response.data) {
          setBookedSlots(response.data);
        } else {
          throw new Error('Không nhận được dữ liệu từ server');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu timeslot:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBookedSlots();
  }, [selectedDate, selectedCourtId]);


  useEffect(() => {
    if (!selectedCourtId) {
      console.warn('No court selected, redirecting to court selection');
      router.push('/booking/choosecourt');
    }
  }, [selectedCourtId, router]);

  useEffect(() => {
    const storedTime = localStorage.getItem('selectedTime');
    if (storedTime) {
      setSelectedTime(storedTime);
    }
  }, []);

  

  const changeMonth = (direction) => {
    setSelectedMonth((prev) => {
      const newMonth = direction === 'next' ? prev + 1 : prev - 1;
      
      // Xử lý chuyển năm nếu cần
      if (newMonth > 11) {
        return 0;
      } else if (newMonth < 0) {
        return 11;
      }
      return newMonth;
    });
  };

  const isPastDate = (day) => {
    const selectedDay = new Date(currentYear, selectedMonth, day);
    return selectedDay < new Date(currentYear, currentMonth, currentDay);
  };

  const handleDateSelection = (day) => {
    const newSelectedDate = new Date(currentYear, selectedMonth, day);
    setSelectedDate(newSelectedDate);
    setSelectedTime(''); // Reset selected time when date changes
  };
  

  const TimeButton = ({ hour }) => {
    const available = isTimeSlotAvailable(hour.time);
    
    return (
      <button
        className={`
          border px-4 py-2 rounded-lg text-lg
          ${!available 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : selectedTime === hour.time
              ? 'bg-[#38a3df] text-white border-[#38a3df]'
              : 'bg-white border-gray-300 hover:bg-[#38a3df] hover:text-white hover:border-[#38a3df]'
          }
          transition-all duration-200
          relative
        `}
        onClick={() => available && handleTimeSelection(hour.time)}
        disabled={!available || isLoading}
      >
        <span className={!available ? 'opacity-50' : ''}>
          {hour.time}
        </span>
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-lg">
            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
              Đã đặt
            </span>
          </div>
        )}
      </button>
    );
  };


  useEffect(() => {
    console.log('Selected Date:', selectedDate);
    console.log('Selected Court ID:', selectedCourtId);
    console.log('Booked Slots:', bookedSlots);
  }, [selectedDate, selectedCourtId, bookedSlots]);
  

const TimeSlotGroup = ({ title, slots, isLoading, error }) => (
  <div className="mb-4">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <div className="grid grid-cols-3 gap-4">
      {isLoading ? (
        <div className="col-span-3 flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38a3df]"></div>
        </div>
      ) : error ? (
        <div className="col-span-3 text-center text-red-500 py-4">
          {error}
        </div>
      ) : (
        slots.map(hour => <TimeButton key={hour.id} hour={hour} />)
      )}
    </div>
  </div>
);

    const handleTimeSelection = (time) => {
      setSelectedTime(time);
      // Tính giá mới khi chọn giờ
      const newPrice = calculatePrice(time.split(' ')[0], selectedDate);
      if (newPrice) {
        setTotal(newPrice);
      }
    };


    const handleContinue = () => {
      if (selectedDate && selectedTime) {
        const formattedDateTime = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()} ${selectedTime}`;
        
        // Lưu tất cả thông tin vào sessionStorage
        sessionStorage.setItem('selectedDateTime', formattedDateTime);
        sessionStorage.setItem('calculatedTotal', total.toString());

        localStorage.setItem('selectedDuration', duration);
        sessionStorage.setItem('selectedDuration', duration);
        
        router.push('/booking');
      } else {
        alert('Vui lòng chọn cả ngày và giờ để tiếp tục.');
      }
    };

    useEffect(() => {
      console.log('Current duration:', duration);
      console.log('LocalStorage duration:', localStorage.getItem('selectedDuration'));
      console.log('SessionStorage duration:', sessionStorage.getItem('selectedDuration'));
    }, [duration]);
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-transparent text-black p-6 relative">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center">
            <ChevronLeft className="mr-2 text-[#38a3df] h-6 w-6" />
            <span className="text-[#38a3df]">Back</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl mt-8">
        <h1 className="text-4xl font-bold text-center text-[#38a3df]">CHỌN THỜI GIAN BẮT ĐẦU</h1>

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
                {[...Array(31)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      selectedDate.getDate() === index + 1 && selectedMonth === currentMonth
                        ? 'bg-[#38a3df] text-white'
                        : isPastDate(index + 1)
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-black hover:bg-[#38a3df] hover:text-white'
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
                
          {!isPastDate(selectedDate) && (
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-xl font-bold text-[#38a3df] mb-4">2. CHỌN THỜI GIAN BẮT ĐẦU</h2>
              <TimeSlotGroup 
                title="Sáng" 
                slots={sang} 
                isLoading={isLoading}
                error={error}
              />
              <TimeSlotGroup 
                title="Chiều" 
                slots={chieu} 
                isLoading={isLoading}
                error={error}
              />
              <TimeSlotGroup 
                title="Tối" 
                slots={toi} 
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

          <div className="text-center text-[#38a3df] mt-4">
            Nếu không tìm thấy thời gian trống hoặc muốn đặt sân cố định vui lòng gọi đến 
            <span className="text-blue-500"> 0979797779 </span>
            chúng tôi sẽ hỗ trợ tìm lịch hẹn phù hợp với thời gian của bạn
          </div>
        </div>

        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mt-8 mx-auto">
        {total !== null && (
        <p className="text-lg font-bold">TỔNG: {total ? total.toLocaleString() : 0} VND</p>
        )}
          <button
            className="w-full bg-[#38a3df] text-white font-bold py-3 mt-4 rounded-lg hover:bg-[#2b82bb] transition"
            onClick={handleContinue}
          >
            TIẾP TỤC ĐẶT
          </button>
        </div>
      </main>
    </div>
  );
}