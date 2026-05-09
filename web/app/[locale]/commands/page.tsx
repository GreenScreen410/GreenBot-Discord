import {
  CircleDollarSign,
  ClipboardList,
  Command,
  Cpu,
  Gamepad2,
  Info,
  Music,
  Sparkles,
  TrendingUp,
  Wrench
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getCommands } from "@/lib/commands";

const CategoryIcons: Record<string, React.ElementType> = {
  activity: Gamepad2,
  info: Info,
  money: CircleDollarSign,
  music: Music,
  record: ClipboardList,
  stock: TrendingUp,
  system: Cpu,
  utility: Wrench,
};

export default function CommandsPage() {
  const commands = getCommands();
  const categories = Object.keys(commands);
  const t = useTranslations("Commands");
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 py-32 container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-on-surface">
            {t("title")}
          </h1>
          <p className="text-on-surface-variant text-base max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            const Icon = CategoryIcons[category] || Sparkles;

            return (
              <section key={category} id={category} className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
                  <Icon className="text-primary" />
                  <h2 className="text-xl font-medium text-on-surface capitalize">{category}</h2>
                  <span className="text-xs bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant ml-auto">
                    {t("count", { count: commands[category].length })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {commands[category].map((cmd) => {
                    const name = cmd.name_localizations?.[locale] || cmd.name;
                    const description = cmd.description_localizations?.[locale] || cmd.description;

                    if (cmd.subcommands && cmd.subcommands.length > 0) {
                      return cmd.subcommands.map((sub) => {
                        const subName = sub.name_localizations?.[locale] || sub.name;
                        const subDesc = sub.description_localizations?.[locale] || sub.description;
                        return (
                          <div
                            key={`${cmd.name}-${sub.name}`}
                            className="group rounded-lg bg-surface-container p-5 hover:bg-surface-container-high transition-colors"
                          >
                            <div className="mb-2">
                              <span className="text-sm text-primary bg-primary-container/30 px-2.5 py-1 rounded-sm">
                                /{name} {subName}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                              {subDesc}
                            </p>
                          </div>
                        );
                      });
                    }

                    return (
                      <div
                        key={cmd.name}
                        className="group rounded-lg bg-surface-container p-5 hover:bg-surface-container-high transition-colors"
                      >
                        <div className="mb-2">
                          <span className="text-sm text-primary bg-primary-container/30 px-2.5 py-1 rounded-sm">
                            /{name}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                          {description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 rounded-xl bg-surface-container">
            <Command className="mx-auto h-12 w-12 text-on-surface-variant/50 mb-4" />
            <p className="text-on-surface-variant">{t("empty")}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
