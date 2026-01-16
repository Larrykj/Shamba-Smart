"use client";

import Hero from '@/components/Hero';
import PlantingForm from '@/components/PlantingForm';
import ImpactMetrics from '@/components/ImpactMetrics';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import MarketPrices from '@/components/MarketPrices';
import IndigenousKnowledge from '@/components/IndigenousKnowledge';
import PremiumFeatures from '@/components/PremiumFeatures';
import Pricing from '@/components/Pricing';
import UssdSimulator from '@/components/UssdSimulator';
import Partners from '@/components/Partners';
import CallToAction from '@/components/CallToAction';

export default function Home() {
  return (
    <div>
      {/* Hero with live weather preview */}
      <Hero />

      {/* Main tool - Planting Calendar */}
      <PlantingForm />

      {/* Social proof - Impact stats */}
      <ImpactMetrics />

      {/* Core value proposition */}
      <section id="features">
        <Features />
      </section>

      {/* Trust building - Farmer stories */}
      <Testimonials />

      {/* Live data - Market prices */}
      <MarketPrices />

      {/* Community engagement */}
      <IndigenousKnowledge />

      {/* Enterprise capabilities */}
      <section id="about">
        <PremiumFeatures />
      </section>

      {/* Monetization model */}
      <Pricing />

      {/* Accessibility demo */}
      <UssdSimulator />

      {/* Credibility - Partners */}
      <Partners />

      {/* Conversion - CTA */}
      <CallToAction />
    </div>
  );
}
