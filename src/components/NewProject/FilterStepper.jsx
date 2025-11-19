"use client";

import React, { useState, Children, useRef, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

/* --------------------------------------------------------------------------
   STEPPER COMPONENT
-------------------------------------------------------------------------- */

function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center" {...rest}>
      <div className={`mx-auto w-full rounded-2xl ${stepCircleContainerClassName}`}>
        <div className={`${stepContainerClassName} flex w-full items-center p-6`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div className={`mt-6 flex ${currentStep !== 1 ? "justify-between" : "justify-end"}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`duration-350 rounded px-4 py-2 transition ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 text-neutral-400"
                      : "text-neutral-600 hover:text-neutral-900 font-medium"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}

              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="duration-350 flex items-center justify-center rounded-full bg-[#2D3047] py-2 px-6 font-semibold tracking-tight text-yellow-400 transition hover:bg-[#1f2133] shadow-md"
                {...nextButtonProps}
              >
                {isLastStep ? "Apply Filters" : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

function Step({ children }) {
  return <div className="px-2">{children}</div>;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
  const status =
    currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  return (
    <motion.div
      onClick={() => !disableStepIndicators && onClickStep(step)}
      className="relative cursor-pointer outline-none"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#e5e7eb", color: "#9ca3af" },
          active: { scale: 1, backgroundColor: "#2D3047", color: "#fde047" },
          complete: { scale: 1, backgroundColor: "#2D3047", color: "#fde047" },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-9 w-9 items-center justify-center rounded-full font-semibold"
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-yellow-400" />
        ) : status === "active" ? (
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-gray-300">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={{
          incomplete: { width: 0, backgroundColor: "transparent" },
          complete: { width: "100%", backgroundColor: "#2D3047" },
        }}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   FILTER STEPPER
-------------------------------------------------------------------------- */

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["Any duration", "1-2 days", "3-5 days", "1 week+"];

const SKILL_MAP = {
  JavaScript: ["React", "Next.js", "Vue", "Redux", "Node.js"],
  React: ["React Router", "Redux", "Next.js", "React Query"],
  "UI/UX": ["Figma", "Prototyping", "Accessibility"],
  CSS: ["Tailwind", "Sass", "Responsive"],
  Node: ["Express", "NestJS", "MongoDB"],
  API: ["REST", "GraphQL", "Swagger"],
  HTML: ["Accessibility", "SEO"],
  TypeScript: ["React", "Node.js", "TS Config"],
  "Socket.io": ["Realtime", "Websockets"],
};

export default function FilterStepper({ open = true, onClose, onApply = () => {} }) {
  const [difficulty, setDifficulty] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState(["Frontend", "React"]);
  const [duration, setDuration] = useState("Any duration");

  const [expandedSkill, setExpandedSkill] = useState(null);

  const masterSkillList = useMemo(() => {
    const set = new Set();
    Object.keys(SKILL_MAP).forEach((k) => set.add(k));
    Object.values(SKILL_MAP).forEach((arr) => arr.forEach((s) => set.add(s)));
    ["Frontend", "Backend", "DevOps", "Mobile"].forEach((s) => set.add(s));
    return Array.from(set).sort();
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );

    if (SKILL_MAP[skill]) {
      setExpandedSkill((prev) => (prev === skill ? null : skill));
    }
  };

  const handleApply = () => {
    const filters = { difficulty, skills: selectedSkills, duration };
    onApply(filters);
    onClose?.();
  };

  if (!open) return null;

  /* --------------------------------------------------------------------------
     UI
  -------------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Filter Projects</h2>
            <p className="text-sm text-gray-500 mt-0.5">Customize your project search</p>
          </div>

          <button className="p-2 rounded-lg hover:bg-gray-100" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <Stepper
            initialStep={1}
            backButtonText="Previous"
            nextButtonText="Continue"
            onFinalStepCompleted={handleApply}
          >

            {/* STEP 1 – DIFFICULTY */}
            <Step>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Difficulty Level</h3>

                <div className="grid grid-cols-2 gap-3">
                  {DIFFICULTIES.map((d) => {
                    const active = difficulty === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          active
                            ? "bg-[#2D3047] border-[#2D3047] text-yellow-400 shadow-lg"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Step>

            {/* STEP 2 – SKILLS */}
           {/* STEP 2: Skills */}
<Step>
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose Technical Skills</h3>
      <p className="text-sm text-gray-600">Select technologies you want to work with</p>
    </div>

    {(() => {
      const LIMITED_SKILLS = masterSkillList.slice(0, 10);

      // Flatten main + inline sub-skills
      let flatList = [];
      LIMITED_SKILLS.forEach((skill) => {
        flatList.push({ type: "main", label: skill });

        if (expandedSkill === skill && SKILL_MAP[skill]) {
          SKILL_MAP[skill].forEach((child) => {
            flatList.push({ type: "sub", label: child });
          });
        }
      });

      return (
        <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-3">

          {flatList.map((item) => {
            const selected = selectedSkills.includes(item.label);

            return (
              <button
                key={item.label}
                onClick={() => toggleSkill(item.label)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                  ${
                    selected
                      ? "bg-[#2D3047] border-[#2D3047] text-yellow-400"
                      : item.type === "main"
                      ? "bg-white border-gray-300 text-gray-800"
                      : "bg-yellow-50 border-yellow-300 text-gray-800"
                  }`}
              >
                {item.label}
              </button>
            );
          })}

        </div>
      );
    })()}

    {/* Selected summary */}
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Selected ({selectedSkills.length})
      </div>
      <div className="text-sm text-gray-900 font-medium">
        {selectedSkills.length ? selectedSkills.join(", ") : "No skills selected"}
      </div>
    </div>
  </div>

  <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `}</style>
</Step>


            {/* STEP 3 — DURATION */}
            <Step>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Duration</h3>

                <div className="grid grid-cols-2 gap-3">
                  {DURATIONS.map((d) => {
                    const active = duration === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          active
                            ? "bg-[#2D3047] border-[#2D3047] text-yellow-400 shadow-lg"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-br from-[#2D3047] to-[#1f2133] rounded-xl p-5 text-white shadow-xl mt-6">
                  <div className="text-sm font-semibold text-yellow-400 uppercase mb-3">
                    Filter Summary
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Difficulty:</span>
                      <span>{difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Skills:</span>
                      <span>{selectedSkills.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration:</span>
                      <span>{duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
}
