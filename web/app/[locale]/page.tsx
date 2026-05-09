import { Gamepad2, Music, Radio, Shield, Wrench, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  const tFeatures = useTranslations("Features");
  const tMusic = useTranslations("Music");

  const features = [
    {
      icon: Music,
      title: tFeatures("list.music.title"),
      description: tFeatures("list.music.description")
    },
    {
      icon: Gamepad2,
      title: tFeatures("list.games.title"),
      description: tFeatures("list.games.description")
    },
    {
      icon: Wrench,
      title: tFeatures("list.utilities.title"),
      description: tFeatures("list.utilities.description")
    },
    {
      icon: Zap,
      title: tFeatures("list.setup.title"),
      description: tFeatures("list.setup.description")
    },
    {
      icon: Radio,
      title: tFeatures("list.uptime.title"),
      description: tFeatures("list.uptime.description")
    },
    {
      icon: Shield,
      title: tFeatures("list.secure.title"),
      description: tFeatures("list.secure.description")
    }
  ];

  const tags = ["quality", "noLag", "lyrics", "filters"] as const;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-24 bg-surface-container-lowest">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-on-surface">
                {tFeatures("title")}
              </h2>
              <p className="text-on-surface-variant text-base max-w-2xl mx-auto leading-relaxed">
                {tFeatures("description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Music Demo Section */}
        <section id="music" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="rounded-xl bg-surface-container p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-on-surface">
                  <span className="text-primary">{tMusic("title").split(" ")[0]}</span> {tMusic("title").split(" ").slice(1).join(" ")}
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  {tMusic("description")}
                </p>
                {/* MD3 Assist Chips */}
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-sm bg-secondary-container text-on-secondary-container text-sm font-medium">
                      {tMusic(`tags.${tag}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Element - MD3 Surface */}
              <div className="flex-1 w-full max-w-md">
                <div className="aspect-square rounded-xl bg-surface-container-highest flex items-center justify-center relative overflow-hidden shadow-(--shadow-elevation-2)">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent" />
                  <Music size={64} className="text-primary/40 relative z-10 animate-bounce" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-1 bg-on-surface/10 rounded-full mb-2 overflow-hidden">
                      <div className="h-full w-2/3 bg-primary rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant font-mono">
                      <span>2:14</span>
                      <span>3:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
