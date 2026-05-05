# PermGuard Ecosystem - Project Documentation

This document explains how the three main components of your PermGuard security system work together to protect your browsing experience.

## 🏗️ The 4 Main Components

1.  **PermGuard Dashboard (Frontend)**: The visual control center where you see your security reports and history.
2.  **PermGuard Backend (Central API)**: Handles user accounts, login, and stores your scanning history in MongoDB.
3.  **URL Safety Engine (The Brain)**: A dedicated high-speed service that analyzes URLs using 16+ security rules (HTTPS, Phishing detection, etc.).
4.  **Chrome Extension (The Collector)**: Lives in your browser to capture URLs from the address bar as you type.

---

## 🔄 How the Data Flows (Step-by-Step)

### Step 1: User Action
You type a URL like `http://test-site.xyz` into your Chrome address bar.

### Step 2: The Extension Captures the URL
The **Chrome Extension** detects the new URL. It checks if you are logged in. If you are, it sends that URL to the **URL Safety Engine** (Port 5001).

### Step 3: Security Analysis
The **URL Safety Engine** runs its analysis:
- Is it using HTTPS?
- Are there suspicious keywords like "bank" or "login"?
- Is it a dangerous domain like `.top`?
- *It generates a **Risk Score** (e.g., 75% Dangerous).*

### Step 4: Storage in Database
The Extension receives the result and immediately tells the **PermGuard Backend** (Port 5000): *"Hey, this user just visited a 75% dangerous site. Save this to their history!"*

### Step 5: Real-time Visualization
When you open your **Dashboard History**, you will see a new entry with the time, URL, and the red "DANGEROUS" badge.

---

## 🛠️ Port Map
| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 5174 | User interface and Dashboard |
| **Backend** | 5000 | Database, Users, and History Storage |
| **Safety Engine** | 5001 | The security scanning logic |

---

## 🛡️ The 16-Rule Scoring Engine (Technical Breakdown)

The URL Safety Engine calculates a **Risk Score (0-100)** by analyzing the "DNA" of a URL. Here is the weightage for each check:

### 1. Connection Security
- **No HTTPS**: +30 Points (Unencrypted connection is a primary risk).

### 2. Identity & Spoofing (Phishing Detection)
- **Homograph/Unicode Attack**: +50 Points (Detects fake characters used to spoof real sites).
- **Punycode Detection**: +45 Points (Detects masked international domains).
- **Suspicious Keywords**: +25 Points (login, verify, bank, wallet, crypto, etc.).
- **Scam Bait Keywords**: +25 Points (free, prize, gift, bonus, etc.).
- **Dangerous Paths**: +40 Points (Detects "malware", "phish", "virus" in the URL path).

### 3. Technical Obfuscation
- **Raw IP Usage**: +25 Points (Using numbers instead of a domain name).
- **Deep Subdomains**: +25 Points (Excessive nesting like `login.update.verify.com`).
- **URL Shorteners**: +20 Points (Using `bit.ly` or `tinyurl` to hide destinations).
- **Double Extensions**: +40 Points (e.g., `invoice.pdf.exe` - common malware trick).
- **@ Symbol Redirects**: +20 Points (Technique used to bypass security filters).
- **Double Slash Obfuscation**: +15 Points (Attempting to hide the real domain).

### 4. Verdict Thresholds
- **SAFE (0-39)**: Green 🟢 - Low risk, standard website behavior.
- **SUSPICIOUS (40-69)**: Orange 🟠 - Multiple red flags detected; exercise caution.
- **DANGEROUS (70-100)**: Red 🔴 - High-probability threat or confirmed malicious pattern.

---

## 🚀 Future Upgrades
- **Google Search Integration**: Pre-scanning search results before you click them.
- **Global Intelligence**: Adding Google Safe Browsing and VirusTotal API keys to detect 100% of known global threats.
