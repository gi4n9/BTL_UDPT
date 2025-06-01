import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
export function Footer() {
  return <footer className="mt-20 pb-28 border-t border-gray-700 pt-10">
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#3AA5D1]">
            Miraculous Music Station
          </h3>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#3AA5D1]">
            Download Our App
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Go Mobile with our app. Listen to your favourite songs at just one
            click. Download Now!
          </p>
          <div className="flex flex-col gap-2">
            <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" className="h-10" />
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png" alt="Download on App Store" className="h-8" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#3AA5D1]">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to our newsletter and get latest updates and offers.
          </p>
          <div className="flex flex-col gap-2">
            <input type="text" placeholder="Enter Name" className="bg-[#1C1F33] rounded-md px-4 py-2 text-sm" />
            <input type="email" placeholder="Enter Email" className="bg-[#1C1F33] rounded-md px-4 py-2 text-sm" />
            <button className="bg-[#3AA5D1] text-white py-2 px-4 rounded-md text-sm">
              Sign Me Up
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#3AA5D1]">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={16} />
              <span>(+1) 202-555-0176, (+1) 2025-5501</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={16} />
              <span>demo@mail.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={16} />
              <span>598 Old House Drive, London</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Facebook className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            <Twitter className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            <Instagram className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            <Linkedin className="text-gray-400 hover:text-white cursor-pointer" size={20} />
          </div>
        </div>
      </div>
    </footer>;
}