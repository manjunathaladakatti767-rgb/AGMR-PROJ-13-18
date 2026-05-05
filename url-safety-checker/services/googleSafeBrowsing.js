/**
 * Google Safe Browsing Service
 * Checks URLs against Google's database of unsafe web resources.
 */
const axios = require('axios');

async function checkGoogleSafeBrowsing(url) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    client: { clientId: "url-safety-checker", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  try {
    const response = await axios.post(endpoint, requestBody);
    
    if (response.data.matches && response.data.matches.length > 0) {
      const threatType = response.data.matches[0].threatType;
      return { 
        flagged: true, 
        reason: `Flagged by Google Safe Browsing (threat type: ${threatType})` 
      };
    }

    return { flagged: false };
  } catch (error) {
    console.error('Google Safe Browsing API Error:', error.message);
    return { flagged: false, error: true };
  }
}

module.exports = checkGoogleSafeBrowsing;
