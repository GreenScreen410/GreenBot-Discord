"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center h-10 w-10 rounded-full text-on-surface-variant hover:bg-on-surface/8 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-surface-container shadow-(--shadow-elevation-2)">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            <Link
              href="/commands"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors"
            >
              {t("commands")}
            </Link>
            <Link
              href="/#music"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors"
            >
              {t("music")}
            </Link>
            <Link
              href="/#games"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors"
            >
              {t("games")}
            </Link>
            <div className="pt-2 pb-1 px-4">
              <a
                href={process.env.NEXT_PUBLIC_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-(--shadow-elevation-1)"
              >
                {t("addToDiscord")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
