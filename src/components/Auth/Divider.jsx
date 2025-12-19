"use client";

/**
 * Divider Component
 * Visual separator for "OR" between OAuth and email auth
 */
export default function Divider({ text = "or" }) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-border"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white dark:bg-card text-gray-500 dark:text-muted-foreground uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
