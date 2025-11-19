import FeaturedProjects from "@/components/Portfolio/FeaturedProjects";
import Header from "@/components/Portfolio/Header";
// import JourneyTimeline from "@/components/Portfolio/JourneyTimeline";
import SharePortfolio from "@/components/Portfolio/SharePortfolio";
import SkillShowcase from "@/components/Portfolio/SkillShowcase";
import React from "react";


import dynamic from "next/dynamic";

const JourneyTimeline = dynamic(
  () => import("@/components/Portfolio/JourneyTimeline"),
  { ssr: false }
);

const PortfolioPage = () => {
  return (
    <div>
      <Header />
      <FeaturedProjects />
      <SkillShowcase />
      <JourneyTimeline />
      {/* <Testimonials /> */}
      <SharePortfolio />
    </div>
  );
};

export default PortfolioPage;