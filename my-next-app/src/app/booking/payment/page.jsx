'use client'

import { Clock, User, Home,ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"



export default function PaymentConfirmation() {
  const router = useRouter()
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
              <span>IDBooker Badminton - Trải nghiệm 1</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-[#38a3df]" />
              <span>tqhv - 0395342955</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#38a3df]" />
              <span>08/10/2024 05:00 SA</span>
            </div>
            <div className="flex justify-between">
              <span>Thuê sân (vãng lai)</span>
              <span>60.000 VND</span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>sắp xếp sân ngẫu nhiên</span>
              <span>60 phút</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 relative p-6 rounded-lg bg-white shadow-[0_0_15px_5px_rgba(56,163,223,0.2)] hover:shadow-[0_0_15px_5px_rgba(56,163,223,0.4)] transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#38a3df]">TỔNG THANH TOÁN TRƯỚC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">60.000 VND</div>
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