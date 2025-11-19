"use client"; // if you're using Next.js App Router

import { 
  RiFolderAddLine, 
  RiRoadMapLine, 
  RiTeamLine, 
  RiArrowRightLine 
} from "react-icons/ri";

const RecommendationCard = ({ icon, iconBg, iconColor, title, description, buttonText }) => (
  <div className="p-4 border border-gray-100 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition">
    <div className="flex items-center mb-3">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-3">{description}</p>
    <button className="text-primary text-sm font-medium hover:underline flex items-center whitespace-nowrap">
      {buttonText}
      <div className="w-4 h-4 ml-1 flex items-center justify-center">
        <RiArrowRightLine />
      </div>
    </button>
  </div>
);

const Recommendations = () => {
  return (
    <div className="grid grid-cols-1 p-8 rounded-2xl bg-white gap-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recommended For You
      </h2>

      <RecommendationCard
        icon={<RiFolderAddLine className="text-green-600 text-lg" />}
        iconBg="bg-green-100"
        title="Try This Project Next"
        description="Authentication System with OAuth - This project aligns with your backend development goals."
        buttonText="View Project"
      />

      <RecommendationCard
        icon={<RiRoadMapLine className="text-purple-600 text-lg" />}
        iconBg="bg-purple-100"
        title="Advanced Frontend Path"
        description="You're 70% ready for our Advanced Frontend Developer learning path. Complete 2 more projects to unlock."
        buttonText="View Learning Path"
      />

      <RecommendationCard
        icon={<RiTeamLine className="text-yellow-600 text-lg" />}
        iconBg="bg-yellow-100"
        title="Join a Team Project"
        description="Collaborative E-commerce Platform - 3 developers are looking for a frontend specialist to join."
        buttonText="Learn More"
      />
    </div>
  );
};

export default Recommendations;