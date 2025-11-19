"use client"; // Required if using App Router

const ProjectCard = ({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  priority,
  priorityColor,
  progress,
  progressColor,
  team,
  dueDate,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div
            className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mr-3`}
          >
            <span className={`${iconColor} text-xl`}>{icon}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColor.bg} ${priorityColor.text}`}
        >
          {priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`${progressColor} h-2 transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        {/* Team Members */}
        <div className="flex -space-x-2">
          {team.map((member, index) => (
            <div
              key={index}
              className={`w-7 h-7 rounded-full border-2 border-white ${member.bg} flex items-center justify-center text-white text-[10px] font-medium`}
            >
              {member.initials}
            </div>
          ))}
        </div>

        {/* Due Date */}
        <span className="text-sm text-gray-500">Due: {dueDate}</span>
      </div>
    </div>
  );
};

export default ProjectCard;