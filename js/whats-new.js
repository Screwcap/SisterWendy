/**
 * What's New System for Sister Wendy's Dominoes
 * Shows a popup to returning players when there's a new version
 */

const WhatsNew = (() => {
  const CURRENT_VERSION = '0.9.7';
  const STORAGE_KEY = 'sw_last_seen_version';
  
  // Compare semantic versions: returns 1 if a > b, -1 if a < b, 0 if equal
  function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }
  
  // Get last seen version from localStorage
  function getLastSeenVersion() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '0.0.0';
    } catch (e) {
      return '0.0.0';
    }
  }
  
  // Save current version as seen
  function markAsSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
    } catch (e) {}
  }
  
  // Check if there are updates since last visit
  function hasUpdates() {
    const lastSeen = getLastSeenVersion();
    return compareVersions(CURRENT_VERSION, lastSeen) > 0;
  }
  
  // Create and show the popup
  function show() {
    // Remove existing popup if any
    document.getElementById('whats-new-overlay')?.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'whats-new-overlay';
    overlay.innerHTML = `
      <style>
        #whats-new-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3,6,8,0.92);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: wnFadeIn 0.3s ease;
        }
        @keyframes wnFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .wn-box {
          background: linear-gradient(160deg, rgba(12,18,14,0.99) 0%, rgba(8,10,8,0.99) 100%);
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 16px;
          padding: 28px 32px;
          max-width: 420px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.1);
          animation: wnSlideUp 0.4s cubic-bezier(0.34,1.4,0.64,1);
          position: relative;
        }
        @keyframes wnSlideUp {
          from { transform: translateY(30px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .wn-box::before {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8c76a, #c9a84c, transparent);
          opacity: 0.7;
        }
        .wn-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .wn-badge {
          display: inline-block;
          background: linear-gradient(135deg, #c9a84c, #8a6e30);
          color: #0a0600;
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          padding: 4px 14px;
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .wn-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #8a6e30 0%, #e8c76a 50%, #8a6e30 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }
        .wn-version {
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.85rem;
          color: rgba(240,230,204,0.5);
          letter-spacing: 1px;
        }
        .wn-changes {
          list-style: none;
          margin: 20px 0;
        }
        .wn-changes li {
          padding: 10px 0 10px 32px;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 1rem;
          color: rgba(240,230,204,0.85);
          line-height: 1.5;
        }
        .wn-changes li:last-child {
          border-bottom: none;
        }
        .wn-changes li::before {
          position: absolute;
          left: 0;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Cinzel', sans-serif;
        }
        .wn-changes li.new::before {
          content: 'NEW';
          background: rgba(100,255,150,0.2);
          color: #64ff96;
        }
        .wn-changes li.fix::before {
          content: 'FIX';
          background: rgba(255,200,100,0.2);
          color: #ffc864;
        }
        .wn-changes li.improved::before {
          content: '✨';
          background: none;
          padding: 0;
          font-size: 1rem;
        }
        .wn-quote {
          background: rgba(201,168,76,0.08);
          border-left: 3px solid #c9a84c;
          padding: 12px 16px;
          margin: 16px 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: rgba(240,230,204,0.6);
          font-family: 'EB Garamond', Georgia, serif;
        }
        .wn-quote strong {
          color: #c9a84c;
          font-style: normal;
        }
        .wn-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .wn-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          text-decoration: none;
        }
        .wn-btn-primary {
          background: linear-gradient(135deg, #c9a84c 0%, #e8c76a 50%, #c9a84c 100%);
          color: #0a0600;
          border: none;
          box-shadow: 0 4px 14px rgba(201,168,76,0.35);
        }
        .wn-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.5);
        }
        .wn-btn-secondary {
          background: transparent;
          color: rgba(240,230,204,0.6);
          border: 1px solid rgba(240,230,204,0.2);
        }
        .wn-btn-secondary:hover {
          background: rgba(240,230,204,0.05);
          border-color: rgba(240,230,204,0.4);
          color: rgba(240,230,204,0.9);
        }
      </style>
      <div class="wn-box">
        <div class="wn-header">
          <div class="wn-badge">✨ UPDATED</div>
          <h2 class="wn-title">What's New</h2>
          <div class="wn-version">Version ${CURRENT_VERSION} — "The Polish Update"</div>
        </div>
        
        <ul class="wn-changes">
          <li class="fix">Fixed tile highlighting — tiles stay lit when playable</li>
          <li class="fix">Exorcised the ghost tile shadow bug</li>
          <li class="fix">Fixed stuck states after Wendy's bonus turns</li>
          <li class="improved">Brighter board lighting</li>
          <li class="improved">Better zoom behavior as tiles accumulate</li>
        </ul>
        
        <div class="wn-quote">
          <strong>Sister Wendy says:</strong> "The demons have been cast out. The tiles behave now. Mostly."
        </div>
        
        <div class="wn-buttons">
          <button class="wn-btn wn-btn-primary" onclick="WhatsNew.dismiss()">Let's Play!</button>
          <a href="changelog.html" class="wn-btn wn-btn-secondary">Full History</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });
    
    // Close on Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        dismiss();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Track in GA if available
    if (typeof gtag === 'function') {
      gtag('event', 'whats_new_shown', { version: CURRENT_VERSION });
    }
  }
  
  // Dismiss popup and mark as seen
  function dismiss() {
    const overlay = document.getElementById('whats-new-overlay');
    if (overlay) {
      overlay.style.animation = 'wnFadeIn 0.2s ease reverse';
      setTimeout(() => overlay.remove(), 200);
    }
    markAsSeen();
    
    if (typeof gtag === 'function') {
      gtag('event', 'whats_new_dismissed', { version: CURRENT_VERSION });
    }
  }
  
  // Check and show if needed (call on page load)
  function check() {
    if (hasUpdates()) {
      // Delay slightly so it doesn't interrupt initial load
      setTimeout(() => show(), 1500);
    }
  }
  
  // Add "NEW" badge to changelog links if there are updates
  function addBadgeToLinks() {
    if (!hasUpdates()) return;
    
    document.querySelectorAll('a[href*="changelog"]').forEach(link => {
      if (!link.querySelector('.wn-link-badge')) {
        const badge = document.createElement('span');
        badge.className = 'wn-link-badge';
        badge.textContent = 'NEW';
        badge.style.cssText = `
          display: inline-block;
          background: linear-gradient(135deg, #c9a84c, #8a6e30);
          color: #0a0600;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 2px 6px;
          border-radius: 8px;
          margin-left: 6px;
          vertical-align: middle;
          animation: wnBadgePulse 2s ease-in-out infinite;
        `;
        link.appendChild(badge);
        
        // Add animation keyframes if not already present
        if (!document.getElementById('wn-badge-styles')) {
          const style = document.createElement('style');
          style.id = 'wn-badge-styles';
          style.textContent = `
            @keyframes wnBadgePulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `;
          document.head.appendChild(style);
        }
      }
    });
  }
  
  return {
    check,
    show,
    dismiss,
    hasUpdates: hasUpdates(),
    version: CURRENT_VERSION,
    addBadgeToLinks
  };
})();

// Auto-check on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    WhatsNew.check();
    WhatsNew.addBadgeToLinks();
  });
} else {
  WhatsNew.check();
  WhatsNew.addBadgeToLinks();
}
