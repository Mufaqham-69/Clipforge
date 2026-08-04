import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-4xl mb-4 font-bold">One rate. Every episode.</h1>
      <p className="text-ink-dim mb-12">No per-clip fees. No seat limits. Cancel any time.</p>

      <div className="bg-surface border border-line rounded-md p-10 max-w-sm mx-auto">
        <p className="font-mono text-xs text-lime uppercase tracking-wider mb-2">Standard</p>
        <p className="font-display text-5xl mb-1 font-bold">$40</p>
        <p className="text-sm text-ink-dim mb-8">per workspace, per month</p>
        <ul className="text-sm text-left space-y-3 mb-8 text-ink-dim">
          <li>— Unlimited episodes and shows</li>
          <li>— Unlimited clip storyboards</li>
          <li>— Unlimited rendered clip downloads</li>
          <li>— TikTok, Reels, and Shorts caption formatting</li>
        </ul>
        <Link href="/signup" className="block bg-lime text-void font-semibold px-5 py-3 rounded-sm hover:bg-lime-dim transition-colors">
          Start free, add a card later
        </Link>
      </div>
    </main>
  );
}
