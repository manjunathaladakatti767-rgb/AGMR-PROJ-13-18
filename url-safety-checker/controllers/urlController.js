/**
 * URL Controller
 * Main logic for checking URL safety, caching results, and saving to database.
 */
const UrlReport = require('../models/UrlReport');
const googleSafeBrowsing = require('../services/googleSafeBrowsing');
const virusTotal = require('../services/virusTotal');
const calculateRiskScore = require('../services/customScorer');
const GlobalPolicy = require('../models/GlobalPolicy');

const checkUrl = async (req, res) => {
  const { url } = req.body;

  // Step 1: Validate input
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Valid URL is required" });
  }

  try {
    // Step 2: Global Policy Check (Manual Overrides)
    const policy = await GlobalPolicy.findOne({ name: 'default_policy' });
    if (policy) {
      // Normalize the URL for checking
      const normalizedUrl = url.toLowerCase().replace(/\/$/, '');

      // Check Whitelist first
      const isWhitelisted = policy.whitelist.some(domain => 
        normalizedUrl.includes(domain.toLowerCase().trim().replace(/\/$/, ''))
      );
      if (isWhitelisted) {
        return res.json({
          url,
          status: 'SAFE',
          riskScore: 0,
          reasons: ['Manually whitelisted by Administrator'],
          checkedBy: ['GlobalPolicy'],
          recommendation: 'This site is verified by your administrator.'
        });
      }

      // Check Blacklist
      const isBlacklisted = policy.blacklist.some(domain => 
        normalizedUrl.includes(domain.toLowerCase().trim().replace(/\/$/, ''))
      );
      if (isBlacklisted) {
        return res.json({
          url,
          status: 'DANGEROUS',
          riskScore: 100,
          reasons: ['Manually blacklisted by Administrator'],
          checkedBy: ['GlobalPolicy'],
          recommendation: '🚨 CRITICAL: Your administrator has blocked this site globally.'
        });
      }
    }
    // Caching temporarily disabled for live rule testing
    /*
    const existingReport = await UrlReport.findOne({ url });
    if (existingReport) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (existingReport.createdAt > oneDayAgo) {
        return res.json({
          url: existingReport.url,
          status: existingReport.status,
          riskScore: existingReport.riskScore,
          reasons: existingReport.reasons,
          checkedBy: existingReport.checkedBy,
          cached: true
        });
      }
    }
    */

    let status = "SAFE";
    let riskScore = 0;
    let reasons = [];
    let checkedBy = [];

    // Determine threshold
    const threshold = req.body.customThreshold || (policy ? policy.sensitivityThreshold : 70);

    // Step 3: Google Safe Browsing check
    const googleResult = await googleSafeBrowsing(url);
    checkedBy.push("GoogleSafeBrowsing");
    
    if (googleResult.flagged) {
      riskScore = 100;
      // ONLY mark as dangerous if riskScore >= threshold
      if (riskScore >= threshold) {
        status = "DANGEROUS";
      } else {
        status = "SUSPICIOUS"; // Downgrade to suspicious if user has a very high threshold
      }
      reasons = [googleResult.reason];
    } else {
      // Step 4: VirusTotal check (only if Google didn't flag)
      const vtResult = await virusTotal(url);
      checkedBy.push("VirusTotal");

      // Step 5: Custom risk scoring
      const scoringResult = calculateRiskScore(url, vtResult);
      riskScore = scoringResult.riskScore;
      reasons = scoringResult.reasons;
      checkedBy.push("CustomScorer");

      // Determine final status
      if (riskScore >= threshold) {
        status = "DANGEROUS";
      } else if (riskScore >= threshold / 1.75) {
        status = "SUSPICIOUS";
      } else {
        status = "SAFE";
      }
    }

    // Generate Recommendation
    let recommendation = "This site appears safe. You can browse normally.";
    if (status === "DANGEROUS") {
      recommendation = "🚨 CRITICAL: This site is highly likely to be malicious. We strongly recommend you close this tab immediately.";
    } else if (status === "SUSPICIOUS") {
      if (reasons.some(r => r.includes("No HTTPS"))) {
        recommendation = "⚠️ WARNING: This site uses an unencrypted connection. DO NOT enter passwords, credit cards, or any personal data as it will leak to hackers.";
      } else {
        recommendation = "⚠️ CAUTION: This site has multiple security red flags. Be careful about what you click on this page.";
      }
    }

    // Step 6: Save/Update in MongoDB
    const updatedReport = await UrlReport.findOneAndUpdate(
      { url },
      { url, status, riskScore, reasons, checkedBy, recommendation },
      { upsert: true, new: true, runValidators: true }
    );

    // Step 7: Respond
    res.json({
      url: updatedReport.url,
      status: updatedReport.status,
      riskScore: updatedReport.riskScore,
      reasons: updatedReport.reasons,
      checkedBy: updatedReport.checkedBy,
      recommendation: updatedReport.recommendation,
      cached: false
    });

  } catch (error) {
    console.error('URL Check Controller Error:', error);
    res.status(500).json({ error: "Internal server error occurred while checking URL" });
  }
};

module.exports = { checkUrl };
