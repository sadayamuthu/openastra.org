import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col gap-32">

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-subtle text-text-muted text-xs tracking-widest uppercase">
          <span className="text-accent-cyan">✦</span> Open Source Security Tools
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight max-w-3xl text-accent-cyan">
          The North Star for Autonomous Systems
        </h1>
        <p className="text-text-muted text-lg max-w-xl leading-relaxed">
          OpenAstra builds open source tools that bring NIST-grade security compliance
          into every developer's workflow — automatically, at commit time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/controlgate"
            className="px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
          >
            Explore ControlGate
          </Link>
          <Link
            to="/ncsb"
            className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
          >
            Explore NCSB
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary text-center">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProductCard
            icon="🛡️"
            name="ControlGate"
            tagline="NIST RMF & FedRAMP Compliance Gate"
            description="An AI-powered pre-commit and pre-merge security gate. Scans your code changes against 370 non-negotiable NIST SP 800-53 Rev. 5 controls across 18 security gates — before every commit."
            href="/controlgate"
          />
          <ProductCard
            icon="📋"
            name="NCSB"
            tagline="NIST Cloud Security Baseline"
            description="Merges NIST SP 800-53 Rev. 5, SP 800-53B, and FedRAMP OSCAL baselines into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your policy engines."
            href="/ncsb"
          />
        </div>
      </section>

      {/* About */}
      <section className="flex flex-col items-center text-center gap-4 pb-8">
        <h2 className="text-2xl font-semibold text-text-primary">About OpenAstra</h2>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          OpenAstra is a research services company focused on autonomous systems security.
          We build open source tools that make NIST compliance traceable, automated, and
          accessible to every engineering team — from solo developers to enterprise cloud teams.
        </p>
      </section>

    </div>
  )
}
