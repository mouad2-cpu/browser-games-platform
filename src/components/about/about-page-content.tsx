"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { LegalPageTitleSync } from "@/components/legal/legal-page-title-sync";
import { getAboutPageContent } from "@/lib/i18n/pages/about";
import { AboutScene } from "./about-scenes";
import "./about-page.css";

const SCENE_COLORS = {
  hero: "#9ee8b2",
  journey: "#c4b5fd",
  mission: "#fde047",
  promise: "#f9a8d4",
  team: "#7dd3fc",
  join: "#a78bfa",
} as const;

function scrollTo(id: string, block: ScrollLogicalPosition = "start") {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block });
}

function scrollToPromiseView() {
  document.getElementById("promise")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AboutPageContent() {
  const { locale } = useLanguage();
  const content = getAboutPageContent(locale);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    document.documentElement.classList.add("about-scroll-snap");
    const hash = window.location.hash.replace("#", "");
    if (hash === "promise") {
      requestAnimationFrame(() => scrollToPromiseView());
    } else if (hash) {
      requestAnimationFrame(() => scrollTo(hash));
    }
    return () => document.documentElement.classList.remove("about-scroll-snap");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.35, 0.5, 0.65], rootMargin: "-20% 0px -20% 0px" }
    );

    for (const section of content.sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [content.sections]);

  return (
    <>
      <LegalPageTitleSync titleKey="nav.about" />
      <article className="about-page" aria-label={content.ariaLabel}>
        <nav className="about-progress" aria-label={content.navAriaLabel}>
          {content.sections.map((section) => (
            <button
              key={section.id}
              type="button"
              aria-label={content.goToSectionAriaLabel(section.label)}
              aria-current={activeSection === section.id ? "true" : undefined}
              className={`about-progress-dot ${
                activeSection === section.id ? "about-progress-dot--active" : ""
              }`}
              onClick={() =>
                section.id === "promise" ? scrollToPromiseView() : scrollTo(section.id)
              }
            />
          ))}
        </nav>

        <AboutScene id="hero" bg={SCENE_COLORS.hero}>
          <p className="about-kicker">{content.hero.kicker}</p>
          <h1 className="about-hero-title">{content.hero.title}</h1>
          <p className="about-hero-sub">{content.hero.subtitle}</p>
          <button
            type="button"
            className="about-btn about-btn--primary"
            onClick={() => scrollTo("journey")}
          >
            <span>{content.hero.cta}</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </AboutScene>

        <AboutScene id="journey" bg={SCENE_COLORS.journey}>
          <h2 className="about-scene-title">{content.journey.title}</h2>
          <p className="about-scene-text">{content.journey.text}</p>
          <button
            type="button"
            className="about-btn about-btn--secondary"
            onClick={() => scrollTo("mission")}
          >
            {content.journey.cta}
          </button>
        </AboutScene>

        <AboutScene id="mission" bg={SCENE_COLORS.mission}>
          <h2 className="about-scene-title">{content.mission.title}</h2>
          <button
            type="button"
            className="about-btn about-btn--secondary"
            onClick={scrollToPromiseView}
          >
            {content.mission.cta}
          </button>
        </AboutScene>

        <AboutScene id="promise" bg={SCENE_COLORS.promise} className="about-scene--promise">
          <div id="promise-view" className="about-promise-view">
            <h2 className="about-scene-title">{content.promise.title}</h2>
            <div className="about-promise-grid">
              {content.promise.cards.map(({ icon, title, description }) => (
                <article key={title} className="about-promise-card">
                  <span className="about-promise-icon" aria-hidden>
                    {icon}
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <button
              id="promise-ready"
              type="button"
              className="about-btn about-btn--secondary"
              onClick={() => scrollTo("team")}
            >
              {content.promise.cta}
            </button>
          </div>
        </AboutScene>

        <AboutScene id="team" bg={SCENE_COLORS.team}>
          <h2 className="about-scene-title">{content.team.title}</h2>
          <p className="about-scene-text">{content.team.text}</p>
          <button
            type="button"
            className="about-btn about-btn--secondary"
            onClick={() => scrollTo("join")}
          >
            {content.team.cta}
          </button>
        </AboutScene>

        <AboutScene id="join" bg={SCENE_COLORS.join}>
          <h2 className="about-scene-title">{content.join.title}</h2>
          <p className="about-scene-text">{content.join.text}</p>
          <Link href="/" className="about-btn about-btn--primary" style={{ marginTop: "2rem" }}>
            <span>{content.join.cta}</span>
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </AboutScene>
      </article>
    </>
  );
}
