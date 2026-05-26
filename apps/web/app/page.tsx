"use client";

import { ArrowRight, BarChart3, Eye, PlayCircle, Route, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "~/components/user-menu";
import { useUser } from "~/hooks/api/auth";

const navItems = ["Product", "Solutions", "Pricing", "Resources"];

const features = [
  {
    icon: Route,
    title: "Dynamic Schemas",
    description:
      "Build adaptive forms that react to answers, route users through custom paths, and keep complex logic understandable.",
  },
  {
    icon: Eye,
    title: "Public or Unlisted",
    description:
      "Launch open forms, keep sensitive workflows unlisted, or restrict access by the teams and domains you trust.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track completion rates, drop-off points, and conversion patterns while responses are still flowing in.",
  },
];

const footerLinks = ["Terms", "Privacy", "Status", "Changelog"];

export default function Home() {
  const { user, isLoading, isError } = useUser();
  const isLoggedIn = Boolean(user) && !isError;
  const ctaHref = isLoggedIn ? "/dashboard" : "/signup";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground font-body antialiased selection:bg-primary selection:text-primary-foreground">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-heading text-2xl font-bold text-primary">
              FormFlow
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-body text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden font-body text-sm font-medium text-on-surface-variant transition-colors hover:text-primary md:block"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-[1440px] px-4 pb-24 pt-28 md:px-8 lg:px-16">
        <section className="grid min-h-[720px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="relative z-10 flex flex-col gap-6 lg:col-span-6 lg:pr-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Sparkles className="size-4 text-primary" />
              <span className="font-mono text-xs font-bold text-on-surface-variant">
                FORMFLOW V2.0 IS LIVE
              </span>
            </div>
            <h1 className="font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl">
              Build forms that <span className="text-primary">convert.</span>
            </h1>
            <p className="max-w-xl font-body text-lg leading-8 text-on-surface-variant">
              Design high-fidelity data collection experiences with dynamic schemas, advanced logic,
              and real-time analytics. Built for modern teams.
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row">
              <Link
                href={ctaHref}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {isLoggedIn ? "Open Dashboard" : "Start Building for Free"}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#product"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent px-6 py-3 font-body text-sm font-bold text-foreground transition-colors hover:border-white/30 hover:bg-white/5"
              >
                <PlayCircle className="size-4" />
                Watch Demo
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["AK", "JR", "SM"].map((initials) => (
                  <div
                    key={initials}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-surface-container font-heading text-xs font-bold text-primary"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="font-body text-sm text-on-surface-variant">
                Trusted by <strong className="text-foreground">10k+</strong> creators
              </p>
            </div>
          </div>

          <div className="relative z-10 lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
              <div className="flex h-8 items-center gap-2 border-b border-white/10 bg-white/5 px-4">
                <div className="size-2.5 rounded-full bg-surface-container-highest"></div>
                <div className="size-2.5 rounded-full bg-surface-container-highest"></div>
                <div className="size-2.5 rounded-full bg-surface-container-highest"></div>
                <div className="mx-auto font-mono text-[10px] font-bold text-on-surface-variant/70">
                  FORM BUILDER
                </div>
              </div>
              <div className="grid gap-6 p-6 md:p-8">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block font-mono text-xs font-bold text-on-surface-variant">
                      PROJECT NAME
                    </label>
                    <div className="flex h-11 items-center border-b border-white/20 px-2 font-body text-foreground">
                      Cyber-Luxe Launch Campaign
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-mono text-xs font-bold text-on-surface-variant">
                        TARGET AUDIENCE
                      </label>
                      <div className="flex h-11 items-center border-b border-white/20 px-2 font-body text-foreground">
                        Enterprise
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-xs font-bold text-on-surface-variant">
                        BUDGET RANGE
                      </label>
                      <div className="flex h-11 items-center border-b border-white/20 px-2 font-body text-primary">
                        $50k - $100k
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container">
                      <BarChart3 className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">
                        Conversion Probability
                      </p>
                      <p className="font-body text-xs text-on-surface-variant">
                        Based on historical data
                      </p>
                    </div>
                  </div>
                  <span className="font-heading text-3xl font-bold text-primary">87%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="mt-28">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
              Precision engineering for data
            </h2>
            <p className="mx-auto max-w-2xl font-body text-lg leading-8 text-on-surface-variant">
              Everything you need to create, manage, and analyze complex forms without compromising
              on design.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
                >
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-white/10 bg-surface-container">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-body leading-7 text-on-surface-variant">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="solutions" className="mt-24 border-y border-white/10 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ["48ms", "median response capture"],
              ["99.9%", "collection uptime target"],
              ["3.2x", "average form completion lift"],
            ].map(([value, label]) => (
              <div key={value}>
                <p className="font-heading text-5xl font-bold text-primary">{value}</p>
                <p className="mt-2 font-body text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="mt-24 flex flex-col items-start justify-between gap-6 rounded-xl border border-white/10 bg-white/5 p-8 md:flex-row md:items-center"
        >
          <div>
            <div className="mb-3 flex items-center gap-2 text-primary">
              <ShieldCheck className="size-5" />
              <span className="font-mono text-xs font-bold">NO CREDIT CARD REQUIRED</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Start with a production-ready workspace.
            </h2>
          </div>
          <Link
            href={ctaHref}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 md:w-auto"
          >
            {isLoggedIn ? "Open Dashboard" : "Get Started"}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>

      <footer
        id="resources"
        className="border-t border-outline-variant bg-background px-4 py-12 md:px-8 lg:px-16"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-6 md:flex-row">
          <div className="font-mono text-xs font-bold text-primary">FORMFLOW</div>
          <p className="text-center font-body text-sm text-on-surface-variant md:text-left">
            &copy; 2026 FormFlow Systems. Built for high-fidelity data collection.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((item) => (
              <a
                key={item}
                href="#resources"
                className="font-body text-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {isLoading && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-white/10 bg-surface-container px-3 py-2 font-body text-xs text-on-surface-variant shadow-lg">
          Checking session
        </div>
      )}
    </div>
  );
}
