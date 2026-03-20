"use client";

interface AiImageBadgeProps {
  imageUrl?: string | null;
  className?: string;
}

/**
 * Displays a "Gen From AI" badge at the bottom-left corner
 * when the image URL contains "ai-generated" indicating it was
 * created by AI image generation.
 */
export default function AiImageBadge({ imageUrl, className = "" }: AiImageBadgeProps) {
  if (!imageUrl || !imageUrl.includes("ai-generated")) return null;

  return (
    <div
      className={`absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20 shadow-lg ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3 h-3 text-purple-400"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
        Gen From AI
      </span>
    </div>
  );
}
