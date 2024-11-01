'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
    const { isLoggedIn, logout } = useAuth();
    return (
        <header className="bg-transparent text-black p-6 relative">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-3xl font-bold">Logo</div>
            <nav>
              <ul className="flex space-x-12 ">
                <li>
                  <Link href="/booking" className="text-2xl font-normal hover:text-[#38a3df] transition-colors">
                    LỊCH HẸN
                  </Link>
                </li>
                {/* {isLoggedIn && (
                  <li>
                    <Link href="/information" className="text-2xl font-normal hover:text-[#38a3df] transition-colors">
                      THÔNG TIN
                    </Link>
                  </li>
                )} */}
                {/* <li>
                  {isLoggedIn ? (
                    <button onClick={logout} className="text-2xl font-normal hover:text-[#38a3df] transition-colors">
                      ĐĂNG XUẤT
                    </button>
                  ) : (
                    <Link href="/login" className="text-2xl font-normal hover:text-[#38a3df] transition-colors">
                      ĐĂNG NHẬP
                    </Link>
                  )}
                </li> */}
              </ul>
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#38a3df] to-transparent"></div>
        </header>
      )
    }