export function FitZoneLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-red-500"
      >
        {/* Dumbbell icon */}
        <rect x="2" y="16" width="6" height="8" rx="1" fill="currentColor" />
        <rect x="32" y="16" width="6" height="8" rx="1" fill="currentColor" />
        <rect x="8" y="18" width="24" height="4" rx="2" fill="currentColor" />
        <rect x="14" y="14" width="4" height="12" rx="2" fill="currentColor" />
        <rect x="22" y="14" width="4" height="12" rx="2" fill="currentColor" />
      </svg>
      <span className="text-2xl font-bold text-white">
        Fit<span className="text-red-500">Zone</span>
      </span>
    </div>
  )
}
