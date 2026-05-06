// Background script to monitor tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Trigger on URL change OR completion to capture AJAX/SPA navigation
  if ((changeInfo.url || changeInfo.status === 'complete') && tab.url && tab.url.startsWith('http')) {
    console.log('--- NEW NAVIGATION DETECTED ---');
    console.log('URL:', tab.url);
    console.log('Tab ID:', tabId);
    checkAndSaveUrl(tab.url, tabId);
  }
});

async function checkAndSaveUrl(url, tabId) {
  try {
    console.log('1. Checking storage for user session...');
    const result = await chrome.storage.local.get(['userInfo']);
    
    if (!result.userInfo) {
      console.warn('⚠️ ABORT: No user session found in extension. Please log in via the popup!');
      return;
    }

    const userInfo = JSON.parse(result.userInfo);
    console.log('2. User found:', userInfo.email);

    // Skip scanning if it's our own dashboard or internal pages
    if (url.includes('localhost:5173') || url.includes('localhost:5175')) {
      console.log('3. Internal URL detected. Skipping scan.');
      return;
    }

    console.log('4. Fetching Personal Risk Threshold (5000)...');
    let personalThreshold = 70;
    try {
      const settingsRes = await fetch('http://localhost:5000/api/settings', {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        personalThreshold = settingsData.data.riskThreshold;
        console.log('✅ Personal Threshold found:', personalThreshold);
      }
    } catch (e) {
      console.warn('Could not fetch personal settings, using defaults.');
    }

    console.log('5. Calling Safety Engine (5001)...');
    const scanResponse = await fetch('http://localhost:5001/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url,
        customThreshold: personalThreshold
      })
    });
    
    const scanData = await scanResponse.json();
    console.log('6. Scan Result:', scanData);

    if (!scanResponse.ok) {
      console.error('❌ Safety Engine Error:', scanData.message);
      return;
    }

    // Redirect if dangerous
    if (scanData.status === 'DANGEROUS') {
      console.log('🛑 DANGER! Redirecting to blocked page...');
      const blockedPageUrl = chrome.runtime.getURL('blocked.html') + `?url=${encodeURIComponent(url)}`;
      chrome.tabs.update(tabId, { url: blockedPageUrl });
    } 
    else if (scanData.status === 'SAFE') {
      console.log('✅ Site is safe. Showing notification...');
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: showSafeToast
      }).catch(err => console.log('Notification suppressed on this page type.'));
    }

    console.log('6. Saving to Dashboard History (5000)...');
    const historyResponse = await fetch('http://localhost:5000/api/history', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        url: scanData.url,
        status: scanData.status,
        riskScore: scanData.riskScore,
        reasons: scanData.reasons,
        recommendation: scanData.recommendation
      })
    });

    if (historyResponse.ok) {
      console.log('✅ SUCCESS: Record saved to dashboard!');
    } else {
      const historyData = await historyResponse.json();
      console.error('❌ Dashboard API Error:', historyData.message);
    }

  } catch (error) {
    console.error('🛑 CRITICAL ERROR in background script:', error);
  }
}

function showSafeToast() {
  if (document.getElementById('accessshield-safe-toast')) return;
  const toast = document.createElement('div');
  toast.id = 'accessshield-safe-toast';
  toast.innerHTML = '🛡️ <b>AccessShield Verified:</b> This website is safe. You can easily access it.';
  Object.assign(toast.style, {
    position: 'fixed', top: '20px', right: '20px', padding: '12px 24px',
    background: '#10b981', color: 'white', borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '999999',
    fontFamily: 'system-ui, sans-serif', fontSize: '14px',
    transition: 'all 0.5s ease', opacity: '0', transform: 'translateY(-20px)'
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 100);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}
