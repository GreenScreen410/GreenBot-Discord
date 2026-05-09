import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center transition-colors">
            <div className="h-3 w-3 rounded-full bg-primary" />
          </div>
          <span className="text-lg font-medium text-on-surface tracking-tight">GreenBot</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/commands" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors">
            {t("commands")}
          </Link>
          <Link href="/#music" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors">
            {t("music")}
          </Link>
          <Link href="/#games" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-on-surface/8 transition-colors">
            {t("games")}
          </Link>
        </div>

        {/* CTA & Language */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href={process.env.NEXT_PUBLIC_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-(--shadow-elevation-1) hover:shadow-(--shadow-elevation-2) hover:brightness-110 transition-all active:scale-[0.98]"
          >
            {t("addToDiscord")}
          </a>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
