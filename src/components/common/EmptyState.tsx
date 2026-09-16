import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = "🧳",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="glass-soft flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
      <span className="text-[32px]" aria-hidden>
        {icon}
      </span>
      <p className="mt-3 text-[15px] font-semibold text-[#292533]">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-[#918b9c]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
