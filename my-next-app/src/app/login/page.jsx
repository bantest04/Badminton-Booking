'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' 

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter() 

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Kiểm tra nếu các trường username hoặc password bị trống, thì hiển thị lỗi
    if (!username || !password) {
      setError('Mật khẩu không được trống');
    } else {
      //Gửi thông tin đăng nhập của người dùng tới backend thông qua POST request đến API
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
  
        const data = await response.json();

        // Nếu đăng nhập thành công (response.ok && data.token), JWT token trả về từ backend sẽ được lưu vào localStorage
        if (response.ok && data.token) {
          setSuccessMessage('Đăng nhập thành công!');
          console.log('Token:', data.token);
  
          // Lưu token vào localStorage
          localStorage.setItem('authToken', data.token);
  
          // Chuyển hướng tới một trang cố định sau khi đăng nhập thành công
          router.push('/booking');// Chỉ điều hướng khi phía client đã được tải
            
           // Chuyển hướng tới trang chủ hoặc trang nào đó
  
          // setError(''); // Xóa thông báo lỗi
        } else {
          setError( 'Thông tin đăng nhập không chính xác');
        }
      } catch (error) {
        console.log(error);
        setError('Có lỗi xảy ra khi đăng nhập, vui lòng thử lại');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
        <h1 className="text-2xl font-bold text-center text-[#38a3df] mb-6">Đăng nhập</h1>

        {/* Registration Link */}
        <p className="text-center mb-4">
          Chưa có tài khoản?{' '}
          <Link href="/signup" className="text-[#38a3df] hover:underline">Đăng ký</Link>
          </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {/* Keep Logged In & Forgot Password */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">Duy trì đăng nhập</label>
            </div>
            <Link href="/forgot-password" className="text-sm text-[#38a3df] hover:underline">Quên mật khẩu?</Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-2lg font-bold text-white bg-[#38a3df] hover:bg-[#2b82bb] transition py-5">
            ĐĂNG NHẬP
          </Button>

          {/* Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-400">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <Button className="w-full bg-white text-red-500 border border-red-500 hover:bg-red-50 transition flex justify-center items-center space-x-2 py-5">
            <span className="text-lg">G</span>
            <span>GMAIL</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
