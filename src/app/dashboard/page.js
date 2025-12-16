"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "@/components/Dashboard/Slider";
import MainContent from "@/components/Dashboard/MainContent";
import dashboardData from "@/data/dashboard";
import { hasDashboardData } from "@/utils/dashboardHelper";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if user has data and redirect accordingly after login
  useEffect(() => {
    if (status === "authenticated" && session) {
      const userHasData = hasDashboardData(dashboardData);

      if (!userHasData) {
        // User has no data - redirect to empty state
        setIsRedirecting(true);
        router.replace("/dashboard?empty=true");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex bg-background min-h-screen">
        <Slider isLoading={true} />
        <MainContent />
      </div>
    );
  }

  if (!session) return <p>Not signed in</p>;

  if (isRedirecting) {
    return (
      <div className="flex bg-background min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Slider isLoading={false} />
      <MainContent />
    </div>
  );
}
