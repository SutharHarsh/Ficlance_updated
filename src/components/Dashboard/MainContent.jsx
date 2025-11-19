"use client";

import React from "react";
import {
  RiPieChartLine,
  RiAwardLine,
  RiLightbulbLine,
  RiCheckDoubleLine,
  RiArrowUpLine,
} from "react-icons/ri";
import WelcomeSection from "./WelcomeSection";
import ProgressCard from "./ProgressCard";
import MainGrid from "./MainGrid";
import BelowGrid from "./BelowGrid";

const dashboardCards = [
  {
    title: "Completion Rate",
    value: "68%",
    icon: <RiPieChartLine />,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-400",
    progress: {
      value: 68,
      color: "bg-yellow-200",
      label: "+5% from last month",
      showPercent: false,
    },
  },
  {
    title: "Current Level",
    value: "Level 4",
    icon: <RiAwardLine />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    progress: {
      value: 75,
      color: "bg-[#2D3047]",
      label: "125 XP to Level 5",
      showPercent: true,
    },
  },
  {
    title: "Skill Points",
    value: "1,280",
    icon: <RiLightbulbLine />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeText: "+320 points this month",
    statChangeIcon: <RiArrowUpLine />,
    statChangeColor: "text-green-500",
  },
  {
    title: "Completed Projects",
    value: "12",
    icon: <RiCheckDoubleLine />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    changeText: "3 in the last 30 days",
    statChangeIcon: <RiArrowUpLine />,
    statChangeColor: "text-green-500",
  },
];

const MainContent = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="container mx-auto">
        <WelcomeSection
          username="Aditya"
          date="July 23, 2025"
          day="Wednesday"
        />
        <div className="p-6">
          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <ProgressCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
      <MainGrid />
      <BelowGrid />
    </main>
  );
};

export default MainContent;