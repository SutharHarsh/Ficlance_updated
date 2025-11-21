// components/HowItWorks.jsx

import {
  RiFileTextLine,
  RiMessage3Line,
  RiGalleryLine,
  RiArrowRightLine,
} from 'react-icons/ri';

const features = [
  {
    title: 'AI-Generated Briefs',
    description:
      'Receive realistic project briefs tailored to your skill level and role. Each brief includes detailed requirements, timelines, and client expectations.',
    icon: <RiFileTextLine className="text-primary text-2xl" />,
    bg: 'bg-blue-100',
  },
  {
    title: 'Simulated Client Interactions',
    description:
      'Practice communication with AI clients who respond to your questions, provide feedback, and request revisions—just like real clients would.',
    icon: <RiMessage3Line className="text-primary text-2xl" />,
    bg: 'bg-purple-100',
  },
  {
    title: 'Portfolio Building',
    description:
      'Every completed project becomes part of your verified portfolio, complete with client reviews and communication snapshots that showcase your skills.',
    icon: <RiGalleryLine className="text-primary text-2xl" />,
    bg: 'bg-green-100',
  },
];

const HowItWorksCard = ({ icon, title, description, bg }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
    <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <a href="#" className="text-primary font-medium flex items-center hover:underline">
      Learn More
      <RiArrowRightLine className="ml-1 w-5 h-5" />
    </a>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Ficlance Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform simulates the entire freelance experience, from client briefs to feedback cycles.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <HowItWorksCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;