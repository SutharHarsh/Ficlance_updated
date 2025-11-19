"use client";

import { FaRocket, FaPlayCircle } from "react-icons/fa";

const FreelanceCTA = () => {
  return (
    <section className="py-20 bg-[#2D3047] text-[#419D78]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Start Your Freelance Journey Today
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-[#419D78]/80">
          Build skills, confidence, and a portfolio that gets you noticed—all in
          a risk-free environment.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="bg-white text-[#2D3047] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition whitespace-nowrap flex items-center justify-center gap-2">
            <FaRocket className="text-lg" />
            Get Started
          </button>
          <button className="bg-transparent border border-[#419D78] text-[#419D78] px-8 py-3 rounded-full font-medium hover:bg-[#419D78]/10 transition whitespace-nowrap flex items-center justify-center gap-2">
            <FaPlayCircle className="text-lg" />
            View Demo
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-white">500+</div>
            <p className="text-[#419D78]/80">Simulated Projects</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-white">15,000+</div>
            <p className="text-[#419D78]/80">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-white">92%</div>
            <p className="text-[#419D78]/80">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelanceCTA;