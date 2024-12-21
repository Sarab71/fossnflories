'use client';
import React from 'react';
import Header from './components/Header'; // Adjust the path based on your folder structure
import Footer from './components/Footer';
import './globals.css';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
