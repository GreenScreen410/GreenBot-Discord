import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className="group rounded-lg bg-surface-container p-6 transition-all hover:bg-surface-container-high hover:shadow-(--shadow-elevation-1)"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-container text-on-primary-container group-hover:scale-105 transition-transform duration-300">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 text-lg font-medium text-on-surface tracking-tight">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  );
}
