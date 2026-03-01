export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          © {new Date().getFullYear()} OpenAstra. Open source, MIT licensed.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/sadayamuthu/controlgate"
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
          >
            ControlGate ↗
          </a>
          <a
            href="https://github.com/sadayamuthu/nist-cloud-security-baseline"
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
          >
            NCSB ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
