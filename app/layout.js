'use client';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { SessionProvider } from "next-auth/react";
import { CartProvider } from './context/cartcontext';
import { ToastContainer } from 'react-toastify'; // ✅ import toast container
import 'react-toastify/dist/ReactToastify.css';  // ✅ import CSS
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100">
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
