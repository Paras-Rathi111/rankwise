import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [website, setWebsite] = useState('')
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [auditResult, setAuditResult] = useState(null)

const [rankingSearch, setRankingSearch] = useState('')
const [rankingResults, setRankingResults] = useState([])
const [rankingLoading, setRankingLoading] = useState(false)
const [rankingError, setRankingError] = useState('')

useEffect(() => {
  const elements = document.querySelectorAll(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
  entry.target.classList.add('visible')
} else {
  entry.target.classList.remove('visible')
}
      })
    },
    {
      threshold: 0.15,
    }
  )

  elements.forEach((element) => observer.observe(element))

  return () => observer.disconnect()
}, [])

const handleRankingSearch = async (event) => {
  event.preventDefault()

  const query = rankingSearch.trim()

  if (!query) return

  setRankingLoading(true)
  setRankingError('')

  try {
    const response = await fetch(
      'http://localhost:5001/api/search-places',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Unable to search businesses.'
      )
    }

    setRankingResults(data.places || [])
  } catch (error) {
    console.error('Business search error:', error)

    setRankingError(
      error.message || 'Unable to search businesses.'
    )

    setRankingResults([])
  } finally {
    setRankingLoading(false)
  }
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
      const response = await fetch('https://rankwise-api-pvv8.onrender.com/api/audit', {
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
            <a href="#blog">Blog</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="nav-actions">
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
                    <div className="maps-title">
  <img
    src="/rankwise/google-maps-logo.svg"
    alt="Google Maps"
    className="google-maps-logo"
  />

  <div>
    <span className="small-label">LOCAL SEARCH</span>
    <h3>Business Results</h3>
  </div>
</div>
                  </div>
                </div>

                <form className="search-box" onSubmit={handleRankingSearch}>
  <span className="search-icon">⌕</span>

  <input
    type="text"
    value={rankingSearch}
    onChange={(event) => setRankingSearch(event.target.value)}
    placeholder="Search local business..."
    aria-label="Search local business"
  />

  <button type="submit" aria-label="Search">
    →
  </button>
</form>

                {rankingLoading && (
  <div className="ranking-message">
    Searching businesses...
  </div>
)}

{rankingError && (
  <div className="ranking-message ranking-error">
    {rankingError}
  </div>
)}

{!rankingLoading &&
  !rankingError &&
  rankingResults.length === 0 && (
    <div className="ranking-message">
      Search for a local business to see results.
    </div>
  )}

{!rankingLoading &&
  rankingResults.map((place, index) => (
    <div
      className={`ranking-item ${
        index === 1 ? 'second' : index === 2 ? 'third' : ''
      }`}
      key={place.id}
    >
      <div className="rank-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="business-info">
        <strong>{place.name}</strong>

        <span>
          {place.type || 'Local Business'}
        </span>

        <small>{place.address}</small>
      </div>

      {index === 0 && (
        <div className="rank-up">↑</div>
      )}
    </div>
  ))}

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
        <section className="stats scroll-reveal">
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
        <section className="services scroll-reveal" id="services">
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
              <div className="service-card scroll-reveal scroll-delay-1">
                <div className="service-icon">◎</div>

                <h3>Google Maps SEO</h3>

                <p>
                  Improve your visibility in Google Maps and local search
                  results.
                </p>

                <a href="#google-maps-seo">Learn more →</a>
              </div>

              <div className="service-card scroll-reveal scroll-delay-2">
                <div className="service-icon">⌕</div>

                <h3>Local SEO</h3>

                <p>
                  Optimize your online presence for customers searching in
                  your area.
                </p>

                <a href="#contact">Learn more →</a>
              </div>

              <div className="service-card scroll-reveal scroll-delay-3">
                <div className="service-icon">★</div>

                <h3>Reputation Management</h3>

                <p>
                  Build trust with a stronger review profile and customer
                  reputation.
                </p>

                <a href="#contact">Learn more →</a>
              </div>

              <div className="service-card scroll-reveal scroll-delay-4">
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

        {/* Google Maps SEO Details */}
<section className="service-details scroll-reveal" id="google-maps-seo">
  <div className="container">
    <div className="service-details-content">

      <span className="section-label">GOOGLE MAPS SEO</span>

      <h2>
        Get discovered by customers
        <br />
        <em>near you.</em>
      </h2>

      <p>
        Rankwise helps businesses strengthen their local search presence
        and make it easier for nearby customers to discover their services.
      </p>

      <div className="service-details-grid">

        <div>
          <span>01</span>
          <h3>Local Visibility</h3>
          <p>
            Improve your business presence across local search experiences.
          </p>
        </div>

        <div>
          <span>02</span>
          <h3>Business Profile</h3>
          <p>
            Identify important profile and local search optimization opportunities.
          </p>
        </div>

        <div>
          <span>03</span>
          <h3>Local Strategy</h3>
          <p>
            Build a stronger strategy for reaching customers in your target area.
          </p>
        </div>

      </div>

      <a href="#contact" className="primary-button">
        Get Free SEO Audit
        <span>→</span>
      </a>

    </div>
  </div>
</section>

        {/* Free SEO Audit */}
        <section className="audit-section scroll-reveal" id="contact">
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