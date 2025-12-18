"use client";

/**
 * AuthCard Component
 * Premium authentication card container with responsive design
 * Lighter, more elegant version for two-column layout
 */
export default function AuthCard({ children, title, subtitle, compact = false }) {
  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className={`${compact ? 'mb-6' : 'mb-8'}`}>
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
