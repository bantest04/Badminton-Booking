'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  // const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp')
      return
    }

    // Gửi yêu cầu đăng ký tới backend sử dụng fetch
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.message) {
        // setSuccessMessage('Đăng ký thành công!')
        setError('') // Xóa thông báo lỗi
      } else {
        setError(data.message || 'Có lỗi xảy ra trong quá trình đăng ký')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng ký, vui lòng thử lại')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
        <h1 className="text-2xl font-bold text-center text-[#38a3df] mb-6">Đăng ký</h1>

        {/* Already have an account? */}
        <p className="text-center mb-4">
          Bạn đã có tài khoản?{' '}
          <Link href="/login" className="text-[#38a3df] hover:underline">Đăng nhập</Link>
        </p>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              placeholder="Nhập tên"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Họ <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              placeholder="Nhập họ"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên người dùng <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên người dùng"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">E-mail <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mật khẩu <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#38a3df]"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-lg font-bold text-white bg-[#38a3df] hover:bg-[#2b82bb] transition py-5 px-6 rounded-lg mt-4">
            Đăng Ký
          </Button>
        </form>
      </div>
    </div>
  )
}
