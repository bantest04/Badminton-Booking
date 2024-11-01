// src/components/Footer.jsx

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="container mx-auto flex flex-col items-center text-center md:flex-row md:justify-center md:space-x-20">
          <div className="mb-8 md:mb-0 md:text-left max-w-md">
            <h2 className="text-2xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-gray-400">451 Trần Hưng Đạo, Quận 5, Thành Phố Hồ Chí Minh</p>
            <p className="text-gray-400 mt-2">Số điện thoại: +84 979797779</p>
            <p className="text-gray-400 mt-2">Email: info@badmintonclub.com</p>
          </div>
        </div>
        <div className="container mx-auto flex flex-col items-center text-center mt-8">
          <div className="text-gray-500">
            &copy; {new Date().getFullYear()} Badminton Club. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  