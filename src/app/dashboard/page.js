"use client";

import Feature from "@/components/Home/Feature";
import HeroSection2 from "@/components/Home/HeroSection2";
import HowItWorks from "@/components/Home/HowItWorks";
import RoleCards from "@/components/Home/RoleCards";
import Integrations from "@/components/Home/Integrations";
// import PageSection from "@/components/Home/PageSection";
import { useSession } from "next-auth/react";
import PriceSection from "@/components/Home/PriceSection";
import FreelanceCTA from "@/components/Home/FreelanceCTA";
import Testimonials from "@/components/Home/Testimonials";
import Footer from "@/components/Home/Footer";
import Slider from "@/components/Dashboard/Slider";
import MainContent from "@/components/Dashboard/MainContent";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Slider isLoading={true} />
        <MainContent/>
      </div>
    );
  }

  if (!session) return <p>Not signed in</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Slider isLoading={false} />
      <MainContent/>
      {/* <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p> */}
    </div>
  );
}
