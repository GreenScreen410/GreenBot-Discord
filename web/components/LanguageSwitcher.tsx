"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ko" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center h-10 w-10 rounded-full text-on-surface-variant hover:bg-on-surface/8 transition-colors"
      aria-label="Switch Language"
      type="button"
    >
      <Globe size={20} />
    </button>
  );
}
