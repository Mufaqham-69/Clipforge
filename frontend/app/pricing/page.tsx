"use client";

import Link from "next/link";
import { useState } from "react";

const FAQ_BILLING = [
  {
    q: "Can I cancel my plan at any time?",
    a: "Absolutely. There are no contracts or long-term commitments. You can cancel your subscription from your dashboard billing settings in one click, and you will retain access until the end of your billing cycle.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes! If you subscribe and decide ClipForge isn't a good fit for your show, just email us within the first 14 days and we will issue a full refund, no questions asked.",
  },
  {
    q: "What does 'unlimited episodes' actually mean?",
    a: "Unlike competitors who charge per minute processed or restrict you to a set number of clips, we offer true unlimited processing for your workspace. Process as many episodes as you produce, and export as many clips as you like.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className="mesh-bg min-h-screen text-ink pb-20">
      {/* Top Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-line/30 mb-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void">
            CF
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Clip<span className="text-lime">Forge</span>
          </span>
        </Link>
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/" className="text-ink-dim hover:text-ink transition-colors">
            Home
          </Link>
          <Link href="/login" className="text-ink-dim hover:text-ink transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-lime text-void font-bold px-4 py-2 rounded-md hover:bg-lime/90 transition-all shadow-[0_0_15px_rgba(212,255,63,0.2)]"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Main Pricing content */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4 font-bold tracking-tight">
          Simple pricing. <span className="gradient-text">Complete automation.</span>
        </h1>
        <p className="text-ink-dim mb-10 max-w-md mx-auto text-sm md:text-base">
          Unlimited transcripts. Unlimited storyboard clips. Standardized pricing built for creators.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? "text-ink font-semibold" : "text-ink-dim"}`}>
            Billed Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-surface-raised border border-line rounded-full p-1 relative transition-colors duration-300"
          >
            <div
              className={`w-6 h-6 bg-lime rounded-full absolute top-1 transition-all duration-300 ${
                isAnnual ? "left-7" : "left-1"
              }`}
            />
          </button>
          <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? "text-ink font-semibold" : "text-ink-dim"}`}>
            <span>Billed Annually</span>
            <span className="bg-lime/10 text-lime text-[10px] font-bold px-2 py-0.5 rounded border border-lime/30 uppercase tracking-wide">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Card */}
        <div className="relative max-w-md mx-auto bg-surface border border-lime/30 rounded-xl p-8 md:p-10 shadow-[0_0_40px_rgba(212,255,63,0.04)] mb-20 group">
          {/* Best Value floating badge */}
          <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-lime to-violet text-void text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
            Best Value
          </div>

          <p className="font-mono text-xs text-lime uppercase tracking-widest mb-3 font-bold">Creator Suite</p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="font-display text-6xl font-extrabold tracking-tight text-ink">
              ${isAnnual ? "32" : "40"}
            </span>
            <span className="text-ink-dim text-sm">/ month</span>
          </div>
          <p className="text-xs text-ink-dim mb-8">
            {isAnnual ? "Billed annually ($384/year)" : "Billed monthly, cancel anytime"}
          </p>

          <ul className="text-sm text-left space-y-4 mb-10 border-t border-line/60 pt-8">
            {[
              "Unlimited episode uploads and transcripts",
              "Unlimited AI clip storyboards",
              "Unlimited rendered clip downloads",
              "Dynamic virality score and reasoning dashboard",
              "Auto-generated TikTok, Reels, & Shorts captions",
              "Multi-show agency workspace options",
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-ink-dim font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="block w-full bg-lime text-void font-bold px-6 py-3.5 rounded-lg text-center hover:bg-lime/90 transition-all duration-300 shadow-[0_0_20px_rgba(212,255,63,0.1)] hover:shadow-[0_0_30px_rgba(212,255,63,0.3)] transform hover:-translate-y-0.5"
          >
            Start free, add card later
          </Link>
          <p className="text-[10px] text-ink-dim/60 mt-3 font-mono">1-episode free trial automatically active</p>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-2xl mx-auto border-t border-line/50 pt-16">
          <h3 className="font-display text-2xl font-bold mb-8">Billing & Subscriptions FAQ</h3>
          <div className="space-y-4 text-left">
            {FAQ_BILLING.map((faq, idx) => {
              const isOpen = !!faqOpen[idx];
              return (
                <div
                  key={idx}
                  className="bg-surface-raised border border-line/50 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-display font-semibold text-ink hover:text-lime transition-colors"
                  >
                    <span className="text-sm md:text-base">{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-ink-dim transition-transform duration-300 ${
                        isOpen ? "transform rotate-180 text-lime" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[150px] border-t border-line/50 p-5 bg-surface/30" : "max-h-0"
                    }`}
                  >
                    <p className="text-xs md:text-sm text-ink-dim leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
