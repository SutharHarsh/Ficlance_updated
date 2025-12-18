// app/components/PriceSection.tsx (or components/PriceSection.tsx if using Pages Router)

const plans = [
  {
    name: "rookie-mode",
    tagline: "start small, level up fast",
    features: [
      "Basic project simulations",
      "Clear, easy-to-follow briefs",
      "Work on projects that actually matter",
      "Sharpen your skills faster through hands-on projects",
      "Earn points for every completed project",
      "Designed for quick practice and steady momentum",
      "Great for starting your portfolio",
      "Build confidence through fast wins",
      "Start your journey and stand out with real experience"
    ],
    heightClass: "h-[470px]",
  },
];

const PriceSection = () => {
  return (
    <section className="bg-white py-16 mx-16 px-4 sm:px-6 lg:px-8" id="pricing">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <p className="text-gray-500 text-sm uppercase tracking-widest">
          choose your mode
        </p>
        <h2 className="text-4xl sm:text-5xl font-light text-gray-900">
          <span className="font-medium">Website Dev Journeys</span>{" "}
          for Every Level
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-600">
          From low-pressure practice projects to serious pro challenges, earn progress, level up, and build a portfolio that actually matters.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${plan.heightClass}`}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center gap-1">
                {plan.name}
                {plan.isPro && (
                  <span className="text-yellow-400 text-xl">•</span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>
              <ul className="space-y-2 text-gray-800 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
            </div>

            {/* Button */}
            <div className="mt-6">
              <button className="w-full bg-yellow-400 hover:bg-yellow-300 transition text-black font-medium text-sm py-3 px-4 rounded-full">
                find out the price <span className="ml-1">➜</span>
              </button>
              <p className="text-[11px] text-center text-gray-500 mt-1">
                and receive a commercial offer
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceSection;