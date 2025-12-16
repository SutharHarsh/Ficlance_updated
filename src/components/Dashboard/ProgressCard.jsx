'use client';
import React from 'react';

const ProgressCard = ({
  title,
  value,
  icon,
  iconBg = 'bg-indigo-100',
  iconColor = 'text-primary',
  progress = null, // Example: { value: 68, color: 'bg-primary', label: 'Some text', showPercent: true }
  changeText = '',
  statChangeIcon = null,
  statChangeColor = 'text-green-500',
}) => {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6 transition hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center text-lg`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
      </div>

      {/* Progress bar (if exists) */}
      {progress && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`${progress.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress.value}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 flex justify-between">
            <span>{progress.label ?? changeText}</span>
            {progress.showPercent && <span>{progress.value}%</span>}
          </div>
        </>
      )}

      {/* Change text (if no progress bar) */}
      {!progress && changeText && (
        <div className="flex items-center text-sm text-gray-500 mt-2">
          {statChangeIcon && (
            <div
              className={`w-5 h-5 flex items-center justify-center ${statChangeColor} mr-1`}
            >
              {statChangeIcon}
            </div>
          )}
          <span>{changeText}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;