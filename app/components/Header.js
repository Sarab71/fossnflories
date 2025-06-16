'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // To track which dropdown is open
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setDropdownOpen(null);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 relative">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold mx-auto md:mx-0">
          Foss N Flories
        </Link>

        {/* Hamburger Button */}
        <button
          className="md:hidden focus:outline-none z-20"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span
            className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''
              }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white mt-1 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
          ></span>
        </button>

        {/* Menu Items */}
        <div
          className={`absolute md:static bg-gray-800 top-0 left-0 w-full md:w-auto md:flex items-center z-10 transition-transform transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 mt-16 md:mt-0">
            <li>
              <Link
                href="/"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={handleMenuClose}
              >
                Home
              </Link>
            </li>

            {['Men', 'Women', 'Kids'].map((category, index) => (
              <li key={category} className="relative group">
                <button
                  className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                  onClick={() => toggleDropdown(index)}
                >
                  {category}
                </button>
                <ul
                  className={`absolute left-0 top-full bg-gray-700 w-40 rounded-md shadow-lg mt-1 z-30 ${dropdownOpen === index ? 'block' : 'hidden'
                    }`}
                >
                  <li>
                    <Link
                      href={`/${category.toLowerCase()}frames`}
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={handleMenuClose}
                    >
                      Frames
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${category.toLowerCase()}sunglasses`}
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={handleMenuClose}
                    >
                      Sunglasses
                    </Link>
                  </li>
                </ul>
              </li>
            ))}

            {/* ✅ Login/Signup or Logout/Email (Same styling as others) */}
            {status === 'loaing' ? null : (!session?.user ? (
              <li>
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={handleMenuClose}
                >
                  Login / Signup
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/cart" className="block px-4 py-2 hover:bg-gray-700">
                    Cart
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleMenuClose();
                      signOut();
                    }}
                    className="block px-4 py-2 hover:bg-gray-700 text-left w-full"
                  >
                    Logout
                  </button>
                  {session?.user?.email === "singhsarabnoor@gmail.com" && (
                    <Link href="/admin" className="block px-4 py-2 hover:bg-gray-700">Admin</Link>
                  )}
                </li>
              </>
            )
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
