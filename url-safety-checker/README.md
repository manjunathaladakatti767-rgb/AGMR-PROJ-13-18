# URL Safety Checker API

A production-ready URL Safety Checker backend built with Node.js, Express, and MongoDB Atlas. It performs multi-layered security analysis using Google Safe Browsing, VirusTotal, and a custom rule-based scoring engine.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas cluster

### 2. Installation
```bash
git clone <repository-url>
cd url-safety-checker
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/urlSafetyDB
GOOGLE_API_KEY=your_google_safe_browsing_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

- **Google API Key**: Get it from the [Google Cloud Console](https://console.cloud.google.com/). Enable "Safe Browsing API".
- **VirusTotal API Key**: Get it from [VirusTotal Community](https://www.virustotal.com/gui/my-apikey).

### 4. Running the Server
```bash
node server.js
```

## 🔍 API Usage

### Check URL Safety
**POST** `/check-url`

**Request Body:**
```json
{
  "url": "http://suspicious-login.com/verify"
}
```

**Response:**
```json
{
  "url": "http://suspicious-login.com/verify",
  "status": "SUSPICIOUS",
  "riskScore": 55,
  "reasons": [
    "No HTTPS — connection is not secure",
    "URL contains suspicious keywords"
  ],
  "checkedBy": ["GoogleSafeBrowsing", "VirusTotal", "CustomScorer"],
  "cached": false
}
```

## 🛠️ Security Checks
1. **Google Safe Browsing**: Checks against known phishing/malware lists.
2. **VirusTotal**: Scans URL with 70+ antivirus engines.
3. **Custom Scorer**: Analyzes URL patterns (HTTPS, suspicious keywords, IP usage, double slashes, etc.).

## 🧪 Testing with cURL
```bash
curl -X POST http://localhost:5000/check-url \
-H "Content-Type: application/json" \
-d '{"url":"http://suspicious-login.com/verify"}'
```

## ❌ Common Errors
| Error | Cause | Fix |
|-------|-------|-----|
| `Valid URL is required` | Missing or invalid URL in request body | Ensure `url` string is present in JSON |
| `API Key Failure` | Invalid Google or VirusTotal key | Check your `.env` keys and API quotas |
| `MongoDB Connection Error` | IP not whitelisted in Atlas | Add your current IP to Atlas Network Access |
