/**
 * Custom Risk Scorer Service
 * Applies rule-based heuristics to determine URL safety.
 */

function calculateRiskScore(url, virusTotalResult) {
  let riskScore = 0;
  let reasons = [];

  // Rule 1: No HTTPS
  if (!url.startsWith('https://')) {
    riskScore += 30;
    reasons.push("No HTTPS — connection is not secure");
  }

  // Rule 2: Suspicious keywords
  const suspiciousKeywords = ['login', 'verify', 'secure', 'bank', 'update', 'confirm', 'account', 'password', 'signin', 'wallet', 'crypto', 'bonus', 'free', 'gift', 'prize'];
  if (suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
    riskScore += 25;
    reasons.push("URL contains highly suspicious keywords");
  }

  // Rule 10: Suspicious TLDs
  const suspiciousTLDs = ['.top', '.xyz', '.bid', '.gq', '.ml', '.tk', '.cf', '.link', '.pw'];
  if (suspiciousTLDs.some(tld => url.toLowerCase().endsWith(tld) || url.toLowerCase().includes(tld + '/'))) {
    riskScore += 30;
    reasons.push("URL uses a TLD commonly associated with phishing (.top, .xyz, etc.)");
  }

  // Rule 11: URL Shorteners
  const shorteners = ['bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'is.gd', 'buff.ly'];
  if (shorteners.some(s => url.toLowerCase().includes(s))) {
    riskScore += 20;
    reasons.push("URL uses a shortening service — often used to hide dangerous destinations");
  }

  // Rule 12: Double extensions
  if (/\.(exe|zip|pdf|docx|js)\.[a-z]+$/i.test(url)) {
    riskScore += 40;
    reasons.push("Double extension detected — possible malware disguise");
  }

  // Rule 3: Unusually long URL
  if (url.length > 75) {
    riskScore += 10;
    reasons.push("Unusually long URL");
  }

  // Rule 4: IP address instead of domain
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  if (ipRegex.test(url)) {
    riskScore += 25;
    reasons.push("URL uses raw IP address instead of domain");
  }

  // Rule 13: Homograph/Unicode Attack Detection
  if (/[^\u0000-\u007F]/.test(url)) {
    riskScore += 50;
    reasons.push("Unicode characters detected — likely a Homograph attack (disguised as a real site)");
  }

  // Rule 5: Excessive subdomains (e.g., login.microsoft.verify.com)
  const hostname = new URL(url).hostname;
  const subdomainCount = hostname.split('.').length - 2;
  if (subdomainCount >= 3) {
    riskScore += 25;
    reasons.push(`High subdomain depth (${subdomainCount} levels) — typical of phishing redirects`);
  }

  // Rule 14: Punycode detection
  if (hostname.startsWith('xn--')) {
    riskScore += 45;
    reasons.push("Punycode detected — common technique for domain spoofing");
  }

  // Rule 16: Dangerous terms in file path
  const path = new URL(url).pathname.toLowerCase();
  const dangerousTerms = ['malware', 'phish', 'virus', 'trojan', 'exploit', 'backdoor', 'spyware'];
  if (dangerousTerms.some(term => path.includes(term))) {
    riskScore += 40;
    reasons.push(`URL path contains dangerous term: "${dangerousTerms.find(t => path.includes(t))}"`);
  }

  // Rule 6: VirusTotal malicious engines
  if (virusTotalResult.malicious >= 3) {
    riskScore += 40;
    reasons.push("Flagged by multiple VirusTotal security engines");
  }

  // Rule 7: VirusTotal suspicious engines
  if (virusTotalResult.suspicious >= 2) {
    riskScore += 20;
    reasons.push("Marked suspicious by VirusTotal engines");
  }

  // Rule 8: @ symbol detection
  if (url.includes('@')) {
    riskScore += 20;
    reasons.push("URL contains @ symbol — possible redirect trick");
  }

  // Rule 9: Double slash obfuscation
  const protocolEndIndex = url.indexOf('://') + 3;
  if (url.substring(protocolEndIndex).includes('//')) {
    riskScore += 15;
    reasons.push("Double slash detected — possible obfuscation");
  }

  // Cap final score at 100
  riskScore = Math.min(riskScore, 100);

  return { riskScore, reasons };
}

module.exports = calculateRiskScore;
