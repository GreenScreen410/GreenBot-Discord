import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
            <span className="font-medium text-on-surface tracking-tight">GreenBot</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <a
              href="https://github.com/GreenScreen410/GreenBot-Discord"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-on-surface/8 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/GreenScreen410/GreenBot-Discord/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-on-surface/8 transition-colors"
            >
              {t("support")}
            </a>
          </div>

          <p className="text-sm text-on-surface-variant">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
