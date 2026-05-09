import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-primary/40 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* MD3 Assist Chip style badge */}
        <div className="inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-high px-4 py-2 text-sm text-on-surface-variant mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>{t("version")}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-on-surface whitespace-pre-line">
          {t("title")}
        </h1>

        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("description")}
        </p>

        {/* MD3 Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Filled Button */}
          <a
            href={process.env.NEXT_PUBLIC_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-14 px-8 rounded-full bg-primary text-on-primary font-medium shadow-(--shadow-elevation-1) hover:shadow-(--shadow-elevation-2) hover:brightness-110 transition-all active:scale-[0.98] w-full sm:w-auto"
          >
            {t("addToDiscord")}
          </a>
          {/* Tonal Button */}
          <Link
            href="/commands"
            className="flex items-center justify-center h-14 px-8 rounded-full bg-secondary-container text-on-secondary-container font-medium hover:shadow-(--shadow-elevation-1) transition-all active:scale-[0.98] w-full sm:w-auto"
          >
            {t("viewFeatures")}
          </Link>
        </div>

        {/* Terminal Mockup - MD3 Surface Container */}
        <div className="mt-20 mx-auto max-w-4xl rounded-xl bg-surface-container-high p-6 shadow-(--shadow-elevation-2)">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-error/50" />
            <div className="h-3 w-3 rounded-full bg-tertiary/50" />
            <div className="h-3 w-3 rounded-full bg-primary/50" />
          </div>
          <div className="font-mono text-sm text-left space-y-2 text-on-surface-variant">
            <p><span className="text-primary">user@discord:~$</span> {t("status.command")}</p>
            <p className="text-on-surface-variant/60">{t("status.searching")}</p>
            <p className="text-primary">{t("status.playing")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
