"use client"; 

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register radar chart components (must be client-side)
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Radar chart sub-component
const SkillsRadarChart = ({ skills }) => {
  const data = {
    labels: skills.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Level",
        data: skills.map((skill) => skill.percent),
        backgroundColor: "rgba(59, 130, 246, 0.2)", // Tailwind blue-500 w/ transparency
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          font: { size: 12 },
          color: "#4B5563", // gray-700
        },
        grid: { color: "#E5E7EB" }, // gray-200
      },
    },
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Radar data={data} options={options} />;
};

// Main component
const SkillsStatistics = ({ skills = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Skills Statistics
      </h2>

      {/* Radar Chart */}
      <div className="h-64 mb-6">
        <SkillsRadarChart skills={skills} />
      </div>

      {/* Progress bars */}
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{skill.name}</span>
              <span className="text-gray-700">{skill.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${skill.percent}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsStatistics;