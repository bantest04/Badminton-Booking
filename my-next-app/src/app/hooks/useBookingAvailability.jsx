// hooks/useBookingAvailability.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5100/api';

export function useBookingAvailability(selectedDate, selectedCourtId) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching booked slots...', selectedDate, selectedCourtId);
        const response = await axios.get(`${API_BASE_URL}/timeslots/available`, {
          params: {
            date: selectedDate?.toISOString(),
            courtId: selectedCourtId
          }
        });
        console.log('API Response:', response.data);
        if (response.data.success) {
          setBookedSlots(response.data.data);
        }
        // if (response.data.success) {
        //   // Chuyển đổi timestamps thành Date objects
        //   const processedSlots = response.data.data.map(slot => ({
        //     ...slot,
        //     startTime: new Date(slot.startTime),
        //     endTime: new Date(slot.endTime)
        //   }));
        //   setBookedSlots(processedSlots);
        // }
        
      } catch (error) {
        // console.error('Lỗi khi lấy dữ liệu timeslot:', error);
        // alert('Không thể tải thông tin đặt sân. Vui lòng thử lại sau.');
        console.error('Error fetching booked slots:', error);
      } finally {
        setIsLoading(false);
        console.log('Loading complete');
      }
    };
  
    if (selectedDate && selectedCourtId) {
      fetchBookedSlots();
    }
  }, [selectedDate, selectedCourtId]);

  const isTimeSlotAvailable = (time) => {
    if (!selectedDate || !selectedCourtId) return true;

    const [hours, minutes] = time.replace(/[SA|CH]/g, '').trim().split(':').map(Number);
    let adjustedHours = hours;
    
    if (time.includes('CH') && hours < 12) {
      adjustedHours = hours + 12;
    } else if (time.includes('SA') && hours === 12) {
      adjustedHours = 0;
    }

    const selectedStartTime = new Date(selectedDate);
    selectedStartTime.setHours(adjustedHours, minutes, 0, 0);

    // Lấy thời lượng đặt sân
    const duration = parseInt(localStorage.getItem('selectedDuration') || '30 phút');
    const selectedEndTime = new Date(selectedStartTime.getTime() + duration * 60000);

    // Kiểm tra xem có trùng với các booking hiện tại không
    return !bookedSlots.some(slot => {
      // Kiểm tra courtId trùng với sân đang chọn
      // if (slot.courtId !== selectedCourtId) return false;

      const existingStartTime = new Date(slot.startTime);
      const existingEndTime = new Date(slot.endTime);

      return (
        // Kiểm tra các trường hợp trùng lịch
        (selectedStartTime >= existingStartTime && selectedStartTime < existingEndTime) ||
        (selectedEndTime > existingStartTime && selectedEndTime <= existingEndTime) ||
        (selectedStartTime <= existingStartTime && selectedEndTime >= existingEndTime)
      );
    });
  };
  return {
    isLoading,
    isTimeSlotAvailable
  };
}