import localFont from "next/font/local";
import "./globals.css";
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { AuthProvider } from '@/context/AuthContext'

const Lato = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-lato",
  weight: "100 900",
});

export const metadata = {
  title: "Badminton Court Booking",
  description: "Book your badminton court easily and quickly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${Lato.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
      <AuthProvider>
          <Header />
          
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}