"use client";

import React from "react";
import NotificationDropdown from "./NotificationDropdown";
import { MdSpaceDashboard } from "react-icons/md";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <a href="#" className="text-2xl font-['Pacifico'] text-primary">
            <Image
              className="md:h-[30px] z-30 h-[20px] w-auto"
              src="/Logo1.png" // ✅ Public folder image reference
              alt="FicLance Logo"
              width={100}
              height={40}
              priority
            />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Dashboard"
          >
            <MdSpaceDashboard size={24} />
            {/* <i className="ri-dashboard-line text-xl text-gray-700"></i> */}
          </a>

          <NotificationDropdown />

          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
