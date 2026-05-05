/**
 * VirusTotal Service
 * Performs deep analysis of URLs using multiple antivirus engines.
 */
const axios = require('axios');

async function checkVirusTotal(url) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  const submitUrl = 'https://www.virustotal.com/api/v3/urls';

  try {
    // Step 1: Submit URL for analysis
    const submitResponse = await axios.post(
      submitUrl,
      new URLSearchParams({ url }).toString(),
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const analysisId = submitResponse.data.data.id;

    // Step 2: Wait 3 seconds before fetching results
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Get analysis results
    const resultUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;
    const resultResponse = await axios.get(resultUrl, {
      headers: { 'x-apikey': apiKey }
    });

    const stats = resultResponse.data.data.attributes.stats;

    return {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0
    };
  } catch (error) {
    console.error('VirusTotal API Error:', error.message);
    return { malicious: 0, suspicious: 0, harmless: 0, error: true };
  }
}

module.exports = checkVirusTotal;
