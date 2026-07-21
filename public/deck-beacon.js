/*!
 * deck-beacon.js — Screwcap "Deck" portfolio telemetry hook (v1)
 * ---------------------------------------------------------------------------
 * Drop-in, dependency-free. Reports privacy-safe AGGREGATE signals UP to a
 * collector, and can pull feature flags DOWN. No PII ever leaves the page:
 * just a random per-browser session id + event names + numeric values.
 *
 * One copy per property. The Deck is only ever a read-layer over each
 * property's own data — so a title stays independently sellable.
 *
 * Usage:
 *   <script src="/deck-beacon.js" defer></script>
 *   <script>
 *     const deck = DeckBeacon.init({ title: 'dttau', collect: '/api/deck-collect' });
 *     deck.event('trip_logged', { pillar: 'running' });
 *     deck.revenue(49, 'annual');            // report a sale
 *     const flags = await deck.flags();      // optional; {} if not configured
 *   </script>
 *
 * Privacy: honours Do-Not-Track by default (set respectDNT:false to override).
 * Callers MUST NOT pass names, emails, or free text in props — props are for
 * low-cardinality tags only (e.g. { pillar:'gym', plan:'annual' }).
 */
(function (global) {
  'use strict';

  function rid(n) {
    var s = '', h = '0123456789abcdef';
    for (var i = 0; i < (n || 16); i++) s += h[(Math.random() * 16) | 0];
    return s;
  }

  // Stable, anonymous, per-browser id — lets the Deck compute returning-user
  // retention WITHOUT ever knowing who the user is.
  function sessionId() {
    var k = 'deck_sid';
    try {
      var v = localStorage.getItem(k);
      if (!v) { v = rid(16); localStorage.setItem(k, v); }
      return v;
    } catch (e) { return rid(16); } // private mode / storage blocked
  }

  // Strip anything that smells like free text — props are tags, not payloads.
  function safeProps(p) {
    if (!p || typeof p !== 'object') return undefined;
    var out = {}, n = 0;
    for (var k in p) {
      if (!Object.prototype.hasOwnProperty.call(p, k) || n >= 8) continue;
      var val = p[k];
      if (typeof val === 'number' || typeof val === 'boolean') { out[k] = val; n++; }
      else if (typeof val === 'string' && val.length <= 32) { out[k] = val; n++; }
    }
    return n ? out : undefined;
  }

  function Beacon(opts) {
    this.title = String(opts.title || 'unknown').slice(0, 40);
    this.collect = opts.collect || '/api/deck-collect';
    this.flagsUrl = opts.flags || null;
    this.mode = opts.mode || 'live';               // 'live' | 'demo'
    this.sid = sessionId();
    this.q = [];
    this.dnt = (opts.respectDNT !== false) &&
      (navigator.doNotTrack === '1' || global.doNotTrack === '1');
    this._flush = this._flush.bind(this);
    var self = this;
    // Flush on tab-hide (most reliable moment) and on unload.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') self._flush();
    });
    global.addEventListener('pagehide', this._flush);
  }

  Beacon.prototype.setMode = function (m) { this.mode = m; return this; };

  Beacon.prototype._push = function (name, value, props) {
    if (this.dnt) return this;
    this.q.push({ n: String(name).slice(0, 40), v: (value == null ? null : Number(value)), p: safeProps(props), t: Date.now() });
    if (this.q.length >= 12) this._flush();
    return this;
  };

  Beacon.prototype.session = function () { return this._push('session', 1); };
  Beacon.prototype.event = function (name, props) { return this._push(name, 1, props); };
  Beacon.prototype.revenue = function (amount, sku, props) {
    var p = props || {}; if (sku) p.sku = String(sku).slice(0, 32);
    return this._push('revenue', amount, p);
  };

  Beacon.prototype._flush = function () {
    if (this.dnt || !this.q.length) return;
    var batch = { title: this.title, sid: this.sid, mode: this.mode, events: this.q.splice(0, this.q.length) };
    var body = JSON.stringify(batch);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.collect, new Blob([body], { type: 'application/json' }));
        return;
      }
    } catch (e) { /* fall through to fetch */ }
    try {
      fetch(this.collect, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true });
    } catch (e) { /* never break the host app over telemetry */ }
  };

  Beacon.prototype.flags = function () {
    if (!this.flagsUrl) return Promise.resolve({});
    return fetch(this.flagsUrl + (this.flagsUrl.indexOf('?') < 0 ? '?' : '&') + 'title=' + encodeURIComponent(this.title))
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; });
  };

  var DeckBeacon = {
    init: function (opts) {
      opts = opts || {};
      var b = new Beacon(opts);
      // Auto-fire one session ping on init unless told not to.
      if (opts.autoSession !== false) b.session();
      return b;
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = DeckBeacon;
  global.DeckBeacon = DeckBeacon;
})(typeof window !== 'undefined' ? window : this);
