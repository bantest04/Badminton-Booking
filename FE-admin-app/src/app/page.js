'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parse, addMinutes, setHours, setMinutes, isWithinInterval, 
  isSameDay, differenceInMinutes, isValid } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, X, Edit, Play, Archive, UserX, Trash2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import NewAppointmentForm from './appointment/appointmentform';

const CourtSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAppointmentContextMenuOpen, setIsAppointmentContextMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { toast } = useToast();

  const timeSlots = [];
  for (let i = 5; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const time = setMinutes(setHours(new Date(), i), j);
      timeSlots.push(format(time, 'HH:mm'));
    }
  }
  
  const courts = ['Sân A', 'Sân B', 'Sân C', 'Sân D'];
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/bookings');
      const fetchedBookings = response.data.data;
      
      const newSchedule = {};
      fetchedBookings.forEach(booking => {
        try {
          // Skip invalid bookings
          if (!booking?.bookingDate) {
            console.warn('Booking missing date:', booking);
            return;
          }
  
          // Handle date string formats
          let bookingDateTime;
          if (booking.bookingDate instanceof Date) {
            bookingDateTime = booking.bookingDate;
          } else {
            const dateParts = booking.bookingDate.split(' ');
            // Skip if date format is invalid
            if (dateParts.length < 3) {
              console.warn('Invalid date format:', booking.bookingDate);
              return;
            }
  
            const [time, period, date] = dateParts;
            const [day, month, year] = date.split('/').map(Number);
            let [hours, minutes] = time.split(':').map(Number);
  
            // Convert 12h to 24h
            if (period === 'CH' && hours < 12) hours += 12;
            if (period === 'SA' && hours === 12) hours = 0;
  
            bookingDateTime = new Date(year, month - 1, day, hours, minutes);
          }
  
          // Validate created date
          if (!(bookingDateTime instanceof Date) || isNaN(bookingDateTime)) {
            console.warn('Invalid date created for booking:', booking);
            return;
          }
  
          const dateKey = format(bookingDateTime, 'yyyy-MM-dd');
          const courtLetter = booking.courtID?.charAt(0) || 'A';
          const timeKey = `${format(bookingDateTime, 'HH:mm')}-${courtLetter}`;
  
          if (!newSchedule[dateKey]) {
            newSchedule[dateKey] = {};
          }
  
          // Get duration from timeslots or use default
          const duration = booking.timeslots?.[0]?.duration 
            ? parseInt(booking.timeslots[0].duration)
            : 60;
  
          newSchedule[dateKey][timeKey] = {
            ...booking,
            startTime: bookingDateTime,
            endTime: addMinutes(bookingDateTime, duration),
            paid: booking.status === 'Confirmed',
            customerInfo: booking.customerInfo || {
              fullName: 'Unknown',
              phoneNumber: 'N/A',
              email: 'N/A'
            }
          };
  
          console.log('Successfully added booking:', {
            dateKey,
            timeKey,
            booking: newSchedule[dateKey][timeKey]
          });
        } catch (error) {
          console.error('Error processing individual booking:', booking, error);
        }
      });
  
      console.log('Final processed schedule:', newSchedule);
      setSchedule(newSchedule);
    } catch (error) {
      console.error('API Error:', error);
      toast({
        variant: "destructive", 
        title: "Lỗi",
        description: "Không thể lấy danh sách đặt sân"
      });
    }
  };
  // const fetchBookings = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5100/api/bookings');
  //     const fetchedBookings = response.data.data;
      
  //     // Lấy danh sách customerIDs để fetch thông tin
  //     const customerIDs = [...new Set(fetchedBookings.map(b => b.customerID))];
      
  //     // Fetch thông tin khách hàng
  //     const customerResponses = await Promise.all(
  //       customerIDs.map(id => 
  //         axios.get(`http://localhost:5100/api/customers/${id}`)
  //       )
  //     );
      
  //     // Tạo map customerID -> customerInfo
  //     const customerMap = customerResponses.reduce((map, response) => {
  //       const customer = response.data;
  //       map[customer.customerID] = customer;
  //       return map;
  //     }, {});
  
  //     const newSchedule = {};
  //     fetchedBookings.forEach(booking => {
  //       try {
  //         let startDateTime;
  //         if (booking.checkInTime) {
  //           startDateTime = new Date(booking.checkInTime);
  //         } else if (booking.startTime) {
  //           startDateTime = new Date(booking.startTime);
  //         } else if (booking.bookingDate) {
  //           const [time, period, date] = booking.bookingDate.split(' ');
  //           const [day, month, year] = date.split('/').map(Number);
  //           let [hours, minutes] = time.split(':').map(Number);
            
  //           if (period === 'CH' && hours < 12) hours += 12;
  //           if (period === 'SA' && hours === 12) hours = 0;
            
  //           startDateTime = new Date(year, month - 1, day, hours, minutes);
  //         }
  
  //         if (!startDateTime || isNaN(startDateTime.getTime())) {
  //           console.warn('Thời gian không hợp lệ:', booking);
  //           return;
  //         }
  
  //         const dateKey = format(startDateTime, 'yyyy-MM-dd');
  //         const courtLetter = booking.courtID?.charAt(0) || 'A';
  //         const timeKey = `${format(startDateTime, 'HH:mm')}-${courtLetter}`;
  
  //         if (!newSchedule[dateKey]) {
  //           newSchedule[dateKey] = {};
  //         }
  
  //         let endDateTime;
  //         if (booking.checkOutTime) {
  //           endDateTime = new Date(booking.checkOutTime);
  //         } else if (booking.endTime) {
  //           endDateTime = new Date(booking.endTime);
  //         } else {
  //           const duration = booking.timeslots?.[0]?.duration || 60;
  //           endDateTime = addMinutes(startDateTime, duration);
  //         }
  
  //         // Lấy thông tin khách hàng từ map
  //         const customerInfo = customerMap[booking.customerID] || {
  //           fullName: 'Unknown',
  //           phoneNumber: 'N/A',
  //           email: 'N/A'
  //         };
  
  //         newSchedule[dateKey][timeKey] = {
  //           ...booking,
  //           startTime: startDateTime,
  //           endTime: endDateTime,
  //           paid: booking.status === 'Confirmed',
  //           customerInfo
  //         };
  
  //       } catch (error) {
  //         console.error('Lỗi xử lý booking:', error, booking);
  //       }
  //     });
  
  //     setSchedule(newSchedule);
  //   } catch (error) {
  //     console.error('Lỗi API:', error);
  //     toast({
  //       variant: "destructive",
  //       title: "Lỗi",
  //       description: "Không thể lấy danh sách đặt sân"
  //     });
  //   }
  // };

  // Gọi API khi component mount và currentDate thay đổi
  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  // Cập nhật thời gian hiện tại mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý xóa booking
  const handleDeleteBooking = async (bookingId) => {
    if (!bookingId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã đặt sân",
        variant: "destructive",
      });
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5100/api/bookings/${bookingId}`);
      toast({
        title: "Thành công",
        description: "Đã xóa lịch đặt sân",
      });
      await fetchBookings(); // Refresh lại data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch đặt sân: " + (error.response?.data?.message || error.message),
        variant: "destructive",
      });
    }
  };

  // Xử lý cập nhật trạng thái booking
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5100/api/bookings/${bookingId}`, {
        status: newStatus
      });
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái thành ${newStatus}`,
      });
      fetchBookings(); // Refresh data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Context menu handlers
  const handleCellRightClick = useCallback((e, time, court) => {
    e.preventDefault();
    const selectedDateTime = parse(
      `${format(currentDate, 'yyyy-MM-dd')} ${time}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );
    setSelectedTime(format(selectedDateTime, "yyyy-MM-dd HH:mm"));
    setSelectedCourt(courts.indexOf(court));
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsContextMenuOpen(true);
  }, [currentDate, courts]);

  // Appointment context menu handlers
  const handleAppointmentRightClick = useCallback((e, appointment) => {
    e.preventDefault();
    setSelectedAppointment(appointment);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsAppointmentContextMenuOpen(true);
  }, []);

  // Context menu actions
  const handleStartMatch = useCallback(() => {
    if (selectedAppointment) {
      handleUpdateBookingStatus(selectedAppointment.bookingID, 'Started');
    }
    setIsAppointmentContextMenuOpen(false);
  }, [selectedAppointment]);

  const handleCancelAppointment = useCallback(async () => {
    if (!selectedAppointment) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin đặt sân",
        variant: "destructive",
      });
      return;
    }
  
    // Hiển thị dialog xác nhận
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch đặt sân này không?")) {
      try {
        // Trước tiên cập nhật status thành Cancelled
        await handleUpdateBookingStatus(selectedAppointment.bookingID, 'Cancelled');
        
        // Sau đó xóa booking
        await handleDeleteBooking(selectedAppointment.bookingID);
        
        // Đóng context menu
        setIsAppointmentContextMenuOpen(false);
        
        // Reset selected appointment
        setSelectedAppointment(null);
        
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể hủy lịch đặt sân: " + error.message,
          variant: "destructive",
        });
      }
    }
  }, [selectedAppointment, handleUpdateBookingStatus, toast]);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'N/A';
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const renderAppointmentCell = useCallback((appointment, time, courtIndex) => {
    if (!appointment) return null;
  
    const matchTimeFormat = (timeStr) => {
      // Lấy giờ:phút từ startTime của booking
      const appointmentTime = format(appointment.startTime, 'HH:mm');
      return appointmentTime === timeStr;
    };
  
    const isStartCell = matchTimeFormat(time);
    if (!isStartCell) return null;
  
    const customerName = appointment.customerInfo?.fullName || appointment.name || 'Unknown';
    const phoneNumber = appointment.customerInfo?.phoneNumber || appointment.phoneNumber || 'N/A';
    const email = appointment.customerInfo?.email || 'N/A';
  
    // Format thời gian theo giờ Việt Nam
    const formatAppointmentTime = (date) => {
      return format(date, 'HH:mm');
    };
  
    return (
      <TooltipProvider key={appointment.bookingID}>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell
              className={`relative ${
                appointment.status === 'Confirmed' ? 'bg-green-100' : 'bg-yellow-100'
              } hover:brightness-95 transition-colors duration-200`}
              rowSpan={2}
              onContextMenu={(e) => handleAppointmentRightClick(e, appointment)}
            >
              <div className="absolute inset-0 flex flex-col p-2 text-sm">
                <div className="font-bold text-gray-800">
                  {customerName}
                </div>
                <div className="text-gray-600">
                  Thuê sân {appointment.courtID}
                </div>
                <div className="text-gray-600">
                  {formatPhoneNumber(phoneNumber)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {appointment.status === 'Confirmed' ? '✓ Đã thanh toán' : '⚠ Chưa thanh toán'}
                </div>
              </div>
            </TableCell>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <p><strong>Khách hàng:</strong> {customerName}</p>
              <p><strong>SĐT:</strong> {formatPhoneNumber(phoneNumber)}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Sân:</strong> {appointment.courtID}</p>
              <p><strong>Thời gian:</strong> {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}</p>
              <p><strong>Trạng thái:</strong> {appointment.status === 'Confirmed' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, [handleAppointmentRightClick]);

  const addHoursToTime = (timeStr, hoursToAdd) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setHours(date.getHours() + hoursToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lịch đặt sân cầu lông</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentDate, 'dd/MM/yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => setCurrentDate(date || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Bảng lịch */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Giờ</TableHead>
              {courts.map((court) => (
                <TableHead key={court}>{court}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
          {timeSlots.map((time) => (
            <TableRow key={time}>
              <TableCell className="font-medium">{time}</TableCell>
              {courts.map((court, courtIndex) => {
                const dateKey = format(currentDate, 'yyyy-MM-dd');
                const courtLetter = court.slice(-1); // Lấy ký tự cuối (A, B, C, D)
                const timeKey = `${time}-${courtLetter}`;
                
                const appointment = schedule[dateKey]?.[timeKey];
          
                if (appointment) {
                  return renderAppointmentCell(appointment, time, courtIndex);
                }
          
                return (
                  <TableCell
                    key={`${time}-${court}`}
                    className="relative hover:bg-gray-50"
                    onContextMenu={(e) => handleCellRightClick(e, time, court)}
                  />
                );
              })}
            </TableRow>
          ))}
          </TableBody>
        </Table>

        {/* Hiển thị thanh thời gian hiện tại */}
        {isSameDay(currentDate, new Date()) && (
          <div
            className="absolute left-0 right-0 border-t-2 border-red-500 pointer-events-none"
            style={{
              top: `${((currentTime.getHours() * 60 + currentTime.getMinutes()) - 5 * 60) / (19 * 60) * 100}%`
            }}
          />
        )}
      </div>

      {/* Context Menus */}
      {isContextMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: 1000,
          }}
          className="bg-white border rounded shadow-lg"
        >
          <Button
            onClick={() => {
              setIsNewAppointmentOpen(true);
              setIsContextMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <Plus className="inline-block mr-2 h-4 w-4" />
            Đặt sân mới
          </Button>
        </div>
      )}

      {isAppointmentContextMenuOpen && selectedAppointment && (
        <div
          style={{
            position: 'fixed',
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: 1000
          }}
          className="bg-white border rounded shadow-lg"
        >
          <Button
            onClick={handleStartMatch}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <Play className="inline-block mr-2 h-4 w-4" />
            Bắt đầu thi đấu
          </Button>

          <Button
            onClick={() => {
              handleUpdateBookingStatus(selectedAppointment.bookingID, 'Confirmed');
              setIsAppointmentContextMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <Edit className="inline-block mr-2 h-4 w-4" />
            Xác nhận thanh toán
          </Button>

          <Button
            onClick={() => {
              handleUpdateBookingStatus(selectedAppointment.bookingID, 'NoShow');
              setIsAppointmentContextMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <UserX className="inline-block mr-2 h-4 w-4" />
            Khách không đến
          </Button>

          <Button
            onClick={handleCancelAppointment}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            <Trash2 className="inline-block mr-2 h-4 w-4" />
            Hủy đặt sân 
          </Button>
        </div>
      )}

      {/* Form tạo lịch mới */}
      {isNewAppointmentOpen && (
        <Dialog
          open={isNewAppointmentOpen}
          onOpenChange={setIsNewAppointmentOpen}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Tạo lịch đặt sân mới</DialogTitle>
            </DialogHeader>
            <NewAppointmentForm
              initialTime={selectedTime}
              courtId={selectedCourt}
              onAppointmentCreated={async (newBooking) => {
                try {
                  await axios.post('http://localhost:5100/api/bookings', newBooking);
                  toast({
                    title: "Thành công",
                    description: "Đã tạo lịch đặt sân mới",
                  });
                  fetchBookings(); // Refresh data
                  setIsNewAppointmentOpen(false);
                } catch (error) {
                  toast({
                    title: "Lỗi",
                    description: "Không thể tạo lịch đặt sân: " + error.message,
                    variant: "destructive",
                  });
                }
              }}
              onClose={() => setIsNewAppointmentOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
    </div>
  );
};

export default CourtSchedule;