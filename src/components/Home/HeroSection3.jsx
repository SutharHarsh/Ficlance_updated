import React from "react";
// import TechStackScroll from "./TechStackScroll";
import HowItWorks from "./HowItWorks";
import Feature from "./Feature";

const CheckHeroSection = () => {
  const CIRCULAR_TEXT =
    "We are the future of work • We are the future of work • We are the future of work";

  return (
    <>
      {/* Desktop & Laptop View */}
      <div className="home-section lg:h-screen h-[1000px] overflow-hidden relative flex flex-col justify-center lg:flex-row lg:justify-end">
        <div className="flex-1 ">
          {/* FicLance Logo */}
          <div className="flex justify-between items-center mx-4 my-4">
            <img
              className="md:h-[30px] md:pl-10 h-[20px]"
              src="./Logo1.png"
              alt=""
            />
            <div className="md:hidden">☰</div>
          </div>

          {/* Circulur Text - Desktop & Laptop*/}
          <div className="circular-text" aria-hidden>
            <svg
              viewBox="0 0 350 350"
              xmlns="http://www.w3.org/2000/svg"
              className="hidden lg:block w-full h-full absolute -z-20  -rotate-90 opacity-10 text-sm font-black -mt-[150px] ml-[425px]"
              role="img"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M150,150 m-100,0 a100,100 0 1,1 200,0 a100,100 0 1,1 -200,0"
                  fill="none"
                />
              </defs>

              <text
                className="text-[12px] font-medium text-sm  "
                style={{ letterSpacing: "0.5px" }}
              >
                <textPath
                  href="#circlePath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {CIRCULAR_TEXT}
                </textPath>
              </text>
            </svg>
          </div>

          {/* HeroSection Text */}
          <div className="mt-[50px] lg:mt-[145px] lg:ml-15 flex flex-col items-center lg:items-start gap-5">
            <h1 className="font-extrabold text-center lg:text-left lg:text-[60px] text-[40px] opacity-80 leading-[98%] tracking-[-0.01em] ">
              Join the <br />
              Next Generation <br />
              of Freelancers.
            </h1>
            <p className="text-[16px] text-center lg:text-left mx-2 sm:w-[450px] opacity-60">
              Collaborate on simulated gigs, gain practical experience, and grow
              your portfolio in a risk-free environment.
            </p>

            <div className="flex sm:flex-row flex-col gap-4">
              <button className="bg-black cursor-pointer text-white px-8 py-3 rounded-4xl md:mr-4 w-60 sm:w-48">
                Get Started
              </button>
              <button className="border cursor-pointer border-black text-black px-8 py-3 rounded-4xl">
                Learn More
              </button>
            </div>
          </div>
        </div>
        {/* Desktop/Laptop: Image outside the orange div */}
        <div className="hidden lg:block absolute bg-[#FFA21F] -z-10 w-full lg:h-screen rounded-[50px] lg:rounded-tr-[91px] lg:left-8 lg:top-[69%] -rotate-[16deg]"></div>
        <div className="hidden lg:flex lg:pt-20 lg:pr-30 justify-center">
          <img className="lg:w-130 object-contain" src="./new_img.png" alt="" />
        </div>

        {/* Tablet/Mobile: Image inside the orange div */}
        <div className="lg:hidden absolute bg-[#FFA21F] top-140 -z-10 w-[150%] -left-[20%] h-4/14 rounded-[50px] -rotate-[16deg] flex justify-center items-center">
          <div className="mb-30 rotate-[16deg]">
            <img
              className="-ml-1 w-95 object-contain"
              src="./new_img.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="bg-[#FFA21F] h-10"></div>
      {/* <TechStackScroll /> */}
      <div className="bg-[#F9FAFB] h-50">
        <HowItWorks />
        <Feature />
      </div>
    </>
  );
};

export default CheckHeroSection;