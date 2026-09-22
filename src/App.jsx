import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('rankwise-theme') === 'light'
  })

  const [website, setWebsite] = useState('')
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [auditResult, setAuditResult] = useState(null)

  useEffect(() => {
    document.body.classList.toggle('light-theme', isLight)

    localStorage.setItem(
      'rankwise-theme',
      isLight ? 'light' : 'dark'
    )
  }, [isLight])

  const toggleTheme = () => {
    setIsLight((current) => !current)
  }

  const runAudit = async (event) => {
    event.preventDefault()

    setAuditError('')
    setAuditResult(null)

    const trimmedWebsite = website.trim()

    if (!trimmedWebsite) {
      setAuditError('Please enter your website URL.')
      return
    }

    setAuditLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          website: trimmedWebsite,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to complete the audit.'
        )
      }

      setAuditResult(data)
    } catch (error) {
      setAuditError(
        error.message ||
          'Unable to connect to the Rankwise audit server.'
      )
    } finally {
      setAuditLoading(false)
    }
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-good'
    if (score >= 60) return 'score-medium'
    return 'score-low'
  }

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-content">
          <a href="/" className="logo">
            Rank<span>wise</span>
          </a>

          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                isLight
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
              title={
                isLight
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
            >
              {isLight ? '☾' : '☀'}
            </button>

            <a href="#contact" className="nav-button">
              Free SEO Audit
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                Local SEO & Google Maps Experts
              </div>

              <h1>
                Rank Better.
                <br />
                <span>Get Found.</span>
                <br />
                Grow Faster.
              </h1>

              <p>
                Rankwise helps local businesses improve their Google Maps
                visibility, local search rankings, and online presence.
              </p>

              <div className="hero-actions">
                <a href="#contact" className="primary-button">
                  Get Free SEO Audit
                  <span>→</span>
                </a>

                <a href="#services" className="secondary-button">
                  Explore Services
                </a>
              </div>

              <div className="hero-trust">
                <div>
                  <strong>500+</strong>
                  <span>Businesses</span>
                </div>

                <div>
                  <strong>50+</strong>
                  <span>Cities</span>
                </div>

                <div>
                  <strong>20+</strong>
                  <span>Industries</span>
                </div>
              </div>
            </div>

            {/* Ranking Card */}
            <div className="hero-visual">
              <div className="glow"></div>

              <div className="ranking-card">
                <div className="ranking-header">
                  <div>
                    <span className="small-label">GOOGLE MAPS</span>
                    <h3>Local Rankings</h3>
                  </div>

                  <div className="ranking-icon">↗</div>
                </div>

                <div className="search-box">
                  <span>⌕</span>
                  <span>best local business near me</span>
                </div>

                <div className="ranking-item">
                  <div className="rank-number">01</div>

                  <div className="business-info">
                    <strong>Your Business</strong>
                    <span>★★★★★ 4.9 · Local Business</span>
                  </div>

                  <div className="rank-up">↑</div>
                </div>

                <div className="ranking-item second">
                  <div className="rank-number">02</div>

                  <div className="business-info">
                    <strong>Competitor</strong>
                    <span>★★★★☆ 4.6 · Local Business</span>
                  </div>
                </div>

                <div className="ranking-item third">
                  <div className="rank-number">03</div>

                  <div className="business-info">
                    <strong>Competitor</strong>
                    <span>★★★★☆ 4.5 · Local Business</span>
                  </div>
                </div>

                <div className="ranking-footer">
                  <span>Visibility Score</span>
                  <strong>94%</strong>
                </div>
              </div>

              <div className="floating-card">
                <span>↗</span>

                <div>
                  <strong>+42%</strong>
                  <small>Visibility</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats">
          <div className="container stats-grid">
            <div>
              <strong>500+</strong>
              <span>Businesses Helped</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Cities Reached</span>
            </div>

            <div>
              <strong>20+</strong>
              <span>Industries</span>
            </div>

            <div>
              <strong>4.9★</strong>
              <span>Client Rating</span>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="services" id="services">
          <div className="container">
            <div className="section-heading">
              <span>WHAT WE DO</span>

              <h2>
                Everything you need to
                <br />
                <em>get found locally.</em>
              </h2>

              <p>
                Build a stronger local presence and turn nearby searches into
                real customers.
              </p>
            </div>

            <div className="service-grid">
              <div className="service-card">
                <div className="service-icon">◎</div>

                <h3>Google Maps SEO</h3>

                <p>
                  Improve your visibility in Google Maps and local search
                  results.
                </p>

                <a href="#contact">Learn more →</a>
              </div>

              <div className="service-card">
                <div className="service-icon">⌕</div>

                <h3>Local SEO</h3>

                <p>
                  Optimize your online presence for customers searching in
                  your area.
                </p>

                <a href="#contact">Learn more →</a>
              </div>

              <div className="service-card">
                <div className="service-icon">★</div>

                <h3>Reputation Management</h3>

                <p>
                  Build trust with a stronger review profile and customer
                  reputation.
                </p>

                <a href="#contact">Learn more →</a>
              </div>

              <div className="service-card">
                <div className="service-icon">↗</div>

                <h3>SEO Audit</h3>

                <p>
                  Find the problems holding your local visibility back and
                  identify growth opportunities.
                </p>

                <a href="#contact">Run free audit →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Free SEO Audit */}
        <section className="audit-section" id="contact">
          <div className="container">
            <div className="audit-card">
              <div className="audit-intro">
                <span className="audit-label">FREE SEO AUDIT</span>

                <h2>
                  See how your website
                  <br />
                  <em>is performing.</em>
                </h2>

                <p>
                  Enter your website and Rankwise will analyze important SEO
                  signals and show you what is working and what needs
                  improvement.
                </p>
              </div>

              <form className="audit-form" onSubmit={runAudit}>
                <label htmlFor="website">
                  Website URL
                </label>

                <div className="audit-input-row">
                  <input
                    id="website"
                    type="text"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(event) =>
                      setWebsite(event.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="audit-submit"
                    disabled={auditLoading}
                  >
                    {auditLoading ? 'Analyzing...' : 'Analyze Website'}
                    {!auditLoading && <span>→</span>}
                  </button>
                </div>

                {auditError && (
                  <div className="audit-error">
                    {auditError}
                  </div>
                )}
              </form>

              {auditResult && (
                <div className="audit-results">
                  <div className="audit-results-header">
                    <div>
                      <span className="small-label">
                        AUDIT RESULTS
                      </span>

                      <h3>{auditResult.website}</h3>
                    </div>

                    <div
                      className={`audit-score ${getScoreClass(
                        auditResult.score
                      )}`}
                    >
                      <strong>{auditResult.score}</strong>
                      <span>/100</span>
                    </div>
                  </div>

                  <div className="audit-summary">
                    <div>
                      <strong>
                        {auditResult.summary.passed}
                      </strong>
                      <span>Passed</span>
                    </div>

                    <div>
                      <strong>
                        {auditResult.summary.warnings}
                      </strong>
                      <span>Warnings</span>
                    </div>

                    <div>
                      <strong>
                        {auditResult.summary.failed}
                      </strong>
                      <span>Failed</span>
                    </div>
                  </div>

                  <div className="audit-checks">
                    {auditResult.checks.map((check) => (
                      <div
                        className="audit-check"
                        key={check.name}
                      >
                        <div className="audit-check-name">
                          <span
                            className={`check-status ${check.status}`}
                          >
                            {check.status === 'pass'
                              ? '✓'
                              : check.status === 'warning'
                                ? '!'
                                : '×'}
                          </span>

                          <strong>{check.name}</strong>
                        </div>

                        <p>{check.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="audit-page-details">
                    <h4>Page Details</h4>

                    <div className="page-detail-grid">
                      <div>
                        <span>H1 Headings</span>
                        <strong>
                          {auditResult.page.h1Count}
                        </strong>
                      </div>

                      <div>
                        <span>Images</span>
                        <strong>
                          {auditResult.page.images}
                        </strong>
                      </div>

                      <div>
                        <span>Images Without Alt</span>
                        <strong>
                          {auditResult.page.imagesWithoutAlt}
                        </strong>
                      </div>

                      <div>
                        <span>Structured Data</span>
                        <strong>
                          {auditResult.page.structuredData}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App