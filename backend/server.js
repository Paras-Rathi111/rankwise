const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

const normalizeUrl = (url) => {
  if (!url) return null

  let normalizedUrl = url.trim()

  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  return normalizedUrl
}

const calculateScore = (checks) => {
  const passed = checks.filter((check) => check.status === 'pass').length
  const total = checks.length

  return total ? Math.round((passed / total) * 100) : 0
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Rankwise Audit API is running',
  })
})

app.post('/api/audit', async (req, res) => {
  try {
    const { website } = req.body

    if (!website) {
      return res.status(400).json({
        success: false,
        message: 'Website URL is required',
      })
    }

    const url = normalizeUrl(website)

    let response

    try {
      response = await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; RankwiseBot/1.0)',
        },
      })
    } catch (error) {
      console.error('Website fetch error:', error.message)

      return res.status(400).json({
        success: false,
        message:
          'Unable to access this website. Please check the URL and try again.',
      })
    }

    const $ = cheerio.load(response.data)

    const title = $('title').first().text().trim()

    const metaDescription =
      $('meta[name="description"]').attr('content')?.trim() || ''

    const h1Count = $('h1').length

    const canonical =
      $('link[rel="canonical"]').attr('href')?.trim() || ''

    const images = $('img')

    const imagesWithoutAlt = images.filter((_, element) => {
      const alt = $(element).attr('alt')
      return !alt || !alt.trim()
    }).length

    const structuredData =
      $('script[type="application/ld+json"]').length

    const checks = [
      {
        name: 'HTTPS',
        status: url.startsWith('https://') ? 'pass' : 'fail',
        message: url.startsWith('https://')
          ? 'Website uses HTTPS.'
          : 'Website is not using HTTPS.',
      },

      {
        name: 'Page Title',
        status: title ? 'pass' : 'fail',
        message: title
          ? `Page title found: "${title}"`
          : 'Page title is missing.',
      },

      {
        name: 'Meta Description',
        status:
          metaDescription.length >= 50 &&
          metaDescription.length <= 160
            ? 'pass'
            : 'warning',
        message: metaDescription
          ? `Meta description is ${metaDescription.length} characters long.`
          : 'Meta description is missing.',
      },

      {
        name: 'H1 Heading',
        status: h1Count === 1 ? 'pass' : 'warning',
        message:
          h1Count === 1
            ? 'Exactly one H1 heading was found.'
            : `Found ${h1Count} H1 headings.`,
      },

      {
        name: 'Canonical URL',
        status: canonical ? 'pass' : 'warning',
        message: canonical
          ? 'Canonical URL is present.'
          : 'Canonical URL is missing.',
      },

      {
        name: 'Image Alt Text',
        status: imagesWithoutAlt === 0 ? 'pass' : 'warning',
        message:
          imagesWithoutAlt === 0
            ? 'All images have alt text.'
            : `${imagesWithoutAlt} image(s) are missing alt text.`,
      },

      {
        name: 'Structured Data',
        status: structuredData > 0 ? 'pass' : 'warning',
        message:
          structuredData > 0
            ? 'Structured data was found.'
            : 'No JSON-LD structured data was found.',
      },
    ]

    const score = calculateScore(checks)

    const passed = checks.filter(
      (check) => check.status === 'pass'
    ).length

    const warnings = checks.filter(
      (check) => check.status === 'warning'
    ).length

    const failed = checks.filter(
      (check) => check.status === 'fail'
    ).length

    res.json({
      success: true,

      website: url,

      score,

      summary: {
        passed,
        warnings,
        failed,
      },

      page: {
        title,
        metaDescription,
        h1Count,
        canonical,
        images: images.length,
        imagesWithoutAlt,
        structuredData,
      },

      checks,
    })
  } catch (error) {
    console.error('Audit error:', error)

    res.status(500).json({
      success: false,
      message: 'Something went wrong while running the audit.',
    })
  }
})

// ===============================
// OpenStreetMap Business Search
// ===============================

app.post('/api/search-places', async (req, res) => {
  try {
    const { query } = req.body

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      })
    }

    const searchQuery = query.trim()

    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: searchQuery,
          format: 'jsonv2',
          addressdetails: 1,
          limit: 5,
          'accept-language': 'en',
        },

        headers: {
          'User-Agent': 'Rankwise/1.0 (SEO business search)',
        },

        timeout: 10000,
      }
    )

    const places = response.data.map((place) => ({
      id: place.place_id,
      name: place.name || place.display_name.split(',')[0],
      address: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
      type: place.type,
      category: place.category,
    }))

    res.json({
      success: true,
      places,
      attribution: '© OpenStreetMap contributors',
    })
  } catch (error) {
    console.error('Place search error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to search businesses right now.',
    })
  }
})

const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Rankwise Audit API running on port ${PORT}`)
})