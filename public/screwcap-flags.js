/*! screwcap-flags.js — portfolio kill-switch / feature-flag reader (fail-open).
 * ---------------------------------------------------------------------------
 * Reads LIVE operational flags from the Deck and honours them client-side:
 *   • a kill switch (global OR this title) → full-screen maintenance overlay
 *   • a global maintenance banner → non-blocking amber strip
 *   • any other flags → window.SCREWCAP_FLAGS + a 'screwcap-flags' event so the
 *     game can gate its own features.
 *
 * FAIL-OPEN by design: any network/parse error = no flags = game runs normally.
 * A Deck outage can never brick a game. One copy per property (vendored, like
 * deck-beacon.js), so a sold title just deletes the file.
 *
 * Usage — set the title (its Deck slug) before loading, early in <head>:
 *   <script>window.SCREWCAP_TITLE='thechair';</script>
 *   <script src="/screwcap-flags.js"></script>
 */
(function () {
  'use strict';
  var TITLE = String(window.SCREWCAP_TITLE || 'unknown');
  var ENDPOINT = String(window.SCREWCAP_FLAGS_URL || 'https://screwcap-deck.vercel.app/api/flags');

  function whenBody(fn) {
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[<>&]/g, ''); }

  function overlay(msg) {
    if (document.getElementById('screwcap-kill')) return;
    var d = document.createElement('div');
    d.id = 'screwcap-kill';
    d.setAttribute('role', 'alertdialog');
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;' +
      'align-items:center;justify-content:center;background:#0b0f14;color:#e6edf3;' +
      'font:16px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;padding:24px;text-align:center';
    d.innerHTML = '<div style="max-width:520px">' +
      '<div style="font-size:42px;margin-bottom:14px">🛠️</div>' +
      '<div style="font-size:18px;font-weight:700;margin-bottom:8px">Back shortly</div>' +
      '<div style="color:#93a1b0">' + esc(msg || 'Down for a quick fix — back in a few minutes.') + '</div></div>';
    (document.body || document.documentElement).appendChild(d);
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) {}
  }

  function banner(msg) {
    if (!msg || document.getElementById('screwcap-banner')) return;
    var b = document.createElement('div');
    b.id = 'screwcap-banner';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483000;background:#c8952b;' +
      'color:#0b0f14;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;padding:8px 14px;' +
      'text-align:center;font-weight:700';
    b.textContent = String(msg).slice(0, 200);
    (document.body || document.documentElement).appendChild(b);
  }

  try {
    fetch(ENDPOINT + '?title=' + encodeURIComponent(TITLE), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (f) {
        if (!f) return;
        var g = f.global || {}, t = f.title || {};
        window.SCREWCAP_FLAGS = Object.assign({}, g, t);
        var kill = (t.kill_switch && t.kill_switch.on) ? t.kill_switch
                 : ((g.kill_switch && g.kill_switch.on) ? g.kill_switch : null);
        if (kill) { whenBody(function () { overlay(kill.message); }); return; }
        var mb = g.maintenance_banner;
        if (mb && mb.on && mb.message) whenBody(function () { banner(mb.message); });
        try { window.dispatchEvent(new CustomEvent('screwcap-flags', { detail: window.SCREWCAP_FLAGS })); } catch (e) {}
      })
      .catch(function () { /* fail-open */ });
  } catch (e) { /* fail-open */ }
})();
