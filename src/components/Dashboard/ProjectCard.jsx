"use client";
import Link from 'next/link';
import { RiLayout4Line } from 'react-icons/ri';

const ProjectCard = ({
  id,
  title,
  description,
  icon,
  iconBg,
  iconColor,
  priority,
  priorityColor,
  progress,
  progressColor,
  dueDate,
}) => {
  // Default icon if not provided
  const IconComponent = icon || <RiLayout4Line />;

  return (
    <Link href={`/chat/${id}`}>
      <div className="border border-border rounded-xl p-5 bg-secondary dark:bg-card-foreground shadow-sm dark:hover:bg-accent hover:shadow-md transition-all duration-300 cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div
              className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mr-3`}
            >
              <span className={`${iconColor} text-xl`}>
                {typeof IconComponent === 'string' ? <RiLayout4Line /> : IconComponent}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColor.bg} ${priorityColor.text}`}
          >
            {priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-foreground mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className={`${progressColor} h-2 transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer - Due Date Only */}
        <div className="flex justify-end items-center">
          <span className="text-sm text-foreground">Due: {dueDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;