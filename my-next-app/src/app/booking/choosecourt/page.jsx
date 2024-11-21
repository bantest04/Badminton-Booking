'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Search } from 'lucide-react'
import Logo from '@/app/image/SanCauLong.jpg';

export default function CourtSelection() {
  const [selectedCourt, setSelectedCourt] = useState('Random')
  const router = useRouter() 

  const courts = ['Sân số 1', 'Sân số 2', 'Sân số 3']
  
  const handleCourtSelection = (court) => {
    setSelectedCourt(court)
    // Navigate to BookingPage with selected court in URL as query parameter
    router.push(`/booking?court=${encodeURIComponent(court)}`)
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Main Title and Back Button */}
      <div className="container mx-auto flex justify-between items-center p-6">
        <button onClick={() => router.back()} className="flex items-center">
          <ChevronLeft className="mr-2 text-[#38a3df] h-6 w-6" />
          <span className="text-[#38a3df]">Back</span>
        </button>
        <Search className="text-[#38a3df] h-6 w-6" />
      </div>

      {/* Main Title */}
      <h1 className="text-4xl font-bold text-center text-[#38a3df] mt-12 mb-8">CHỌN SÂN</h1>

      {/* Large Container with Glow Effect (No border, only shadow) */}
      <div className="container mx-auto px-4 max-w-3xl mt-4">
        <div className="p-8 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)]"> {/* Glow shadow without border */}
          {/* Random Court Option */}
          <div className={`border ${selectedCourt === 'Random' ? 'border-[#38a3df]' : 'border-gray-300'} rounded-lg p-4 mb-8 shadow-md hover:shadow-lg`}>
            <div className="flex flex-col items-center">
            <img src={Logo.src} alt="Sân ngẫu nhiên" width={100} height={100} className="mb-2" />
              <h3 className="text-lg font-semibold mb-2">Sân ngẫu nhiên</h3>
              <Button
                onClick={() => handleCourtSelection('Sắp xếp sân ngẫu nhiên')}
                className={`text-white font-bold ${selectedCourt === 'Random' ? 'bg-[#38a3df]' : 'bg-gray-400'} rounded-full`}
              >
                {selectedCourt === 'Random' ? 'ĐÃ CHỌN' : 'CHỌN'}
              </Button>
            </div>
          </div>

          {/* Court Grid */}
          <div className="grid grid-cols-2 gap-4">
            {courts.map((court) => (
              <div key={court} className={`border ${selectedCourt === court ? 'border-[#38a3df]' : 'border-gray-300'} rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-lg`}>
                <img src={Logo.src} alt={court} width={100} height={100} className="mb-2" />
                <h3 className="text-lg font-semibold mb-2">{court}</h3>
                <Button
                  onClick={() => handleCourtSelection(court)}
                  className={`text-white font-bold ${selectedCourt === court ? 'bg-[#38a3df]' : 'bg-gray-400'} rounded-full`}
                >
                  {selectedCourt === court ? 'ĐÃ CHỌN' : 'CHỌN'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
