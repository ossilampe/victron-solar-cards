/*! Victron Solar Cards – Victron system (energy flow, today, MPPT, MultiPlus, controls) drawn in VRM style.
 *  Cards: custom:victron-flow-card, custom:victron-energy-card, custom:victron-mppt-card,
 *         custom:victron-multiplus-card, custom:victron-control-card
 *  Every value is an entity you pick in the card editor. Works with any Victron integration
 *  (Modbus, MQTT, VRM) as long as the sensors exist.  MIT License
 */
(() => {
  const VERSION = '1.0.0';

  // ---------------------------------------------------------------- texts
  const L = {
    de: {
      grid: 'NETZ', feedIn: 'Einspeisung', import: 'Bezug', inverter: 'Wechselrichter', acLoads: 'AC-VERBRAUCHER', battery: 'BATTERIE', rest: 'Rest',
      in: 'REIN', out: 'RAUS', now: 'Jetzt', today: 'Heute', yesterday: 'Gestern', week: 'Woche', month: 'Monat', year: 'Jahr', total: 'Gesamt',
      solar: 'SOLAR', dcLoads: 'DC-VERBRAUCHER', multi: 'MULTIPLUS',
      eSolar: 'SOLAR ERZEUGT', eSelf: 'Eigenverbrauch', eFeed: 'EINGESPEIST', eGrid: 'AUS DEM NETZ', eCons: 'HAUSVERBRAUCH', eAut: 'Autarkie',
      eBin: 'IN DEN AKKU', eBinS: 'geladen', eBout: 'AUS DEM AKKU', eBoutS: 'entladen', mImp: 'ZÄHLERSTAND BEZUG', mExp: 'ZÄHLERSTAND EINSPEISUNG', meter: 'Zähler',
      instance: 'Instanz', pvPower: 'PV-LEISTUNG', pv: 'PV', bat: 'BATTERIE', yToday: 'ERTRAG HEUTE', maxToday: 'MAX. HEUTE', yT: 'HEUTE', yY: 'GESTERN', yTot: 'GESAMT',
      relay: 'RELAIS', charger: 'REGLER', qOff: (n) => n + ' ausschalten?', qOn: (n) => n + ' einschalten?', qRelOff: (n) => 'Relais am ' + n + ' ausschalten?', qRelOn: (n) => 'Relais am ' + n + ' einschalten?',
      acIn: 'AC-EINGANG', acOut: 'AC-AUSGANG', inv: 'WECHSELRICHTER', dcBus: 'DC-Bus', apparent: 'Schein', mains: 'Netz', invS: 'WR', chg: 'Laden', device: 'VE.Bus Gerät', phase: 'Phase',
      ctlTitle: 'Steuerung MultiPlus-System', ctlShort: 'MultiPlus-System', alarm: 'Alarm', warning: 'Warnung', noAlarm: 'Kein Alarm',
      modes: { ON: 'Ein', CHARGER: 'Nur Laden', INVERTER: 'Nur WR', OFF: 'Aus' }, qMode: (m) => 'MultiPlus-System auf „' + m + '“ schalten?',
      forceCharge: 'Aus dem Netz laden', qFcOn: 'Akku jetzt aus dem Netz laden (ESS Force charge)?', qFcOff: 'Laden aus dem Netz beenden?',
      maxChg: 'Max. Ladestrom', unlimited: 'unbegrenzt', applying: ' · wird übernommen …', qChg: (a, b) => 'Max. Ladestrom von ' + a + ' auf ' + b + ' ändern?',
      confirm: 'Bitte bestätigen', cancel: 'Abbrechen', ok: 'OK',
      states: { OFF: 'Aus', LOW_POWER: 'Energiesparen', FAULT: 'Fehler', BULK: 'Bulk', ABSORPTION: 'Absorption', FLOAT: 'Float', STORAGE: 'Erhaltung', EQUALIZE: 'Ausgleich', PASSTHRU: 'Durchleitung', INVERTING: 'Wechselrichten', POWER_ASSIST: 'Power Assist', POWER_SUPPLY: 'Netzteil', EXTERNAL_CONTROL: 'Extern', IDLE: 'Ruhe', CHARGING: 'Lädt', DISCHARGING: 'Entlädt', UNAVAILABLE: 'offline', UNKNOWN: '--' },
      pick: 'Bitte im Karten-Editor die Sensoren auswählen.',
    },
    en: {
      grid: 'GRID', feedIn: 'Feed-in', import: 'Import', inverter: 'Inverter', acLoads: 'AC LOADS', battery: 'BATTERY', rest: 'left',
      in: 'IN', out: 'OUT', now: 'Now', today: 'Today', yesterday: 'Yesterday', week: 'Week', month: 'Month', year: 'Year', total: 'Total',
      solar: 'SOLAR', dcLoads: 'DC LOADS', multi: 'MULTIPLUS',
      eSolar: 'SOLAR YIELD', eSelf: 'Self-consumption', eFeed: 'FED IN', eGrid: 'FROM GRID', eCons: 'CONSUMPTION', eAut: 'Self-sufficiency',
      eBin: 'INTO BATTERY', eBinS: 'charged', eBout: 'FROM BATTERY', eBoutS: 'discharged', mImp: 'METER IMPORT', mExp: 'METER EXPORT', meter: 'Meter',
      instance: 'Instance', pvPower: 'PV POWER', pv: 'PV', bat: 'BATTERY', yToday: 'YIELD TODAY', maxToday: 'MAX TODAY', yT: 'TODAY', yY: 'YESTERDAY', yTot: 'TOTAL',
      relay: 'RELAY', charger: 'CHARGER', qOff: (n) => 'Switch ' + n + ' off?', qOn: (n) => 'Switch ' + n + ' on?', qRelOff: (n) => 'Switch the relay of ' + n + ' off?', qRelOn: (n) => 'Switch the relay of ' + n + ' on?',
      acIn: 'AC INPUT', acOut: 'AC OUTPUT', inv: 'INVERTER', dcBus: 'DC bus', apparent: 'Apparent', mains: 'Mains', invS: 'Inv', chg: 'Charge', device: 'VE.Bus device', phase: 'Phase',
      ctlTitle: 'MultiPlus system controls', ctlShort: 'MultiPlus system', alarm: 'Alarm', warning: 'Warning', noAlarm: 'No alarm',
      modes: { ON: 'On', CHARGER: 'Charger only', INVERTER: 'Inverter only', OFF: 'Off' }, qMode: (m) => 'Switch the MultiPlus system to “' + m + '”?',
      forceCharge: 'Charge from grid', qFcOn: 'Charge the battery from the grid now (ESS force charge)?', qFcOff: 'Stop charging from the grid?',
      maxChg: 'Max. charge current', unlimited: 'unlimited', applying: ' · applying …', qChg: (a, b) => 'Change max. charge current from ' + a + ' to ' + b + '?',
      confirm: 'Please confirm', cancel: 'Cancel', ok: 'OK',
      states: { OFF: 'Off', LOW_POWER: 'Low power', FAULT: 'Fault', BULK: 'Bulk', ABSORPTION: 'Absorption', FLOAT: 'Float', STORAGE: 'Storage', EQUALIZE: 'Equalize', PASSTHRU: 'Passthru', INVERTING: 'Inverting', POWER_ASSIST: 'Power assist', POWER_SUPPLY: 'Power supply', EXTERNAL_CONTROL: 'External control', IDLE: 'Idle', CHARGING: 'Charging', DISCHARGING: 'Discharging', UNAVAILABLE: 'offline', UNKNOWN: '--' },
      pick: 'Please pick the sensors in the card editor.',
    },
  };

  // ---------------------------------------------------------------- base
  const esc = (x) => String(x === undefined || x === null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  const list = (x) => (Array.isArray(x) ? x : x ? [x] : []).filter(Boolean);
  const T = (x, y, s, size, col, a, w) => `<text x='${x}' y='${y}' font-size='${size}' fill='${col || '#FFFFFF'}' text-anchor='${a || 'start'}' dominant-baseline='hanging' font-weight='${w || 400}'>${s}</text>`;
  const R = (x, y, w, h, r, fill, stroke, sw) => `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${r}' fill='${fill}' stroke='${stroke || 'none'}' stroke-width='${sw || 0}'/>`;
  const C = (cx, cy, r, fill) => `<circle cx='${cx}' cy='${cy}' r='${r}' fill='${fill}'/>`;
  const PILL = (xr, y, txt, bg, fg) => { const w = String(txt).length * 7.6 + 22; return R(xr - w, y, w, 24, 12, bg) + T(xr - w / 2, y + 6, esc(txt), 12, fg, 'middle', 700); };
  const SVG = (w, h, body) => `<svg viewBox='0 0 ${w} ${h}' width='100%' style='display:block' font-family='Roboto, Arial, sans-serif' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='${w}' height='${h}' fill='#0F1A26'/>${body}</svg>`;
  const BOX = (x, y, w, h, col, title, big, bigCol, subs, mob) => { const z = mob ? { t: 12, hh: 26, b: 22, by: 34, s: 11, sy: 64, sl: 16 } : { t: 13, hh: 28, b: 26, by: 38, s: 12, sy: 76, sl: 18 }; let s = R(x, y, w, h, 12, '#18293B', '#24384E', 1) + R(x, y, w, z.hh, 12, col) + R(x, y + z.hh - 12, w, 12, 0, col) + T(x + 12, y + 7, esc(title), z.t, '#0F1A26', 'start', 700) + T(x + 12, y + z.by, big, z.b, bigCol, 'start', 700); (subs || []).forEach((t, k) => { if (t) s += T(x + 12, y + z.sy + k * z.sl, esc(t), z.s, '#9FB3C8'); }); return s; };
  const FLOW = (d, pw, col) => { let s = `<path d='${d}' fill='none' stroke='#2B4560' stroke-width='3' stroke-linejoin='round'/>`; if (isNaN(pw) || Math.abs(pw) < 5) return s; const dur = Math.max(0.8, Math.min(4, 4.5 - Math.log10(Math.abs(pw)))).toFixed(2); const kp = pw >= 0 ? '0;1' : '1;0'; for (let k = 0; k < 3; k++) s += `<circle r='4.5' fill='${col}'><animateMotion dur='${dur}s' begin='-${(k * dur / 3).toFixed(2)}s' repeatCount='indefinite' path='${d}' keyPoints='${kp}' keyTimes='0;1' calcMode='linear'/></circle>`; return s; };
  const BELL = (cx, cy, lvl) => { const col = lvl === 2 ? '#E5484D' : (lvl === 1 ? '#F7AB3E' : (lvl === 0 ? '#5DBE6E' : '#6E8399')); const an = lvl >= 1 ? `<animate attributeName='opacity' values='1;0.25;1' dur='1s' repeatCount='indefinite'/>` : ''; return `<g fill='${col}'>${an}<path d='M${cx - 7},${cy + 4} L${cx + 7},${cy + 4} L${cx + 5},${cy + 1} L${cx + 5},${cy - 3} A5,5 0 0 0 ${cx - 5},${cy - 3} L${cx - 5},${cy + 1} Z'/><circle cx='${cx}' cy='${cy + 6.5}' r='1.8'/><circle cx='${cx}' cy='${cy - 8.3}' r='1.3'/></g>`; };
  const PWR = (x, y, on) => { const col = on ? '#5DBE6E' : '#E5484D'; const cx = x + 20, cy = y + 13; return R(x, y, 40, 24, 12, '#0F1A26', col, 2) + `<path d='M${cx - 4.4},${cy - 4.4} A6.2,6.2 0 1 0 ${cx + 4.4},${cy - 4.4}' fill='none' stroke='${col}' stroke-width='2' stroke-linecap='round'/><line x1='${cx}' y1='${cy - 8}' x2='${cx}' y2='${cy - 1}' stroke='${col}' stroke-width='2' stroke-linecap='round'/>`; };
  const MPPT = (x, y, on, led) => { let b = R(x, y, 110, 150, 10, '#1D5FAE', '#2F78CC', 1); for (let i = 0; i < 9; i++) b += R(x + 9 + i * 10.4, y + 8, 5, 52, 2, '#164B8C'); b += R(x + 10, y + 68, 90, 44, 4, '#0B0F14'); b += T(x + 55, y + 75, 'victron energy', 9, '#FFFFFF', 'middle', 700); b += T(x + 55, y + 89, 'SmartSolar', 8, '#9FB6CF', 'middle'); b += T(x + 55, y + 99, 'MPPT', 8, '#9FB6CF', 'middle'); b += C(x + 92, y + 105, 3, on ? led : '#2A3440'); b += R(x + 8, y + 118, 94, 24, 4, '#2A2F36'); for (let i = 0; i < 4; i++) b += C(x + 22 + i * 22, y + 130, 5, '#8A939C'); return b; };
  const MULTI = (x, y, mains, inv, chg, t) => { let b = R(x, y, 120, 190, 10, '#1D5FAE', '#2F78CC', 1); b += R(x + 8, y + 8, 104, 72, 6, '#E8EDF2'); b += T(x + 60, y + 16, 'victron energy', 10, '#1D5FAE', 'middle', 700); b += T(x + 60, y + 32, 'MultiPlus-II', 10, '#2A3440', 'middle', 600); [[mains, '#3CCF5A'], [inv, '#3CCF5A'], [chg, '#F7AB3E']].forEach(([on, c], i) => { b += C(x + 34 + i * 26, y + 58, 4.5, on ? c : '#B8C2CC'); }); b += T(x + 34, y + 66, t.mains, 6, '#5A6672', 'middle'); b += T(x + 60, y + 66, t.invS, 6, '#5A6672', 'middle'); b += T(x + 86, y + 66, t.chg, 6, '#5A6672', 'middle'); for (let i = 0; i < 10; i++) b += R(x + 14, y + 92 + i * 8, 92, 3, 1.5, '#164B8C'); b += R(x + 8, y + 174, 104, 10, 3, '#0B0F14'); return b; };
  const TAP = (x, y, w, h, e) => e ? `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='8' fill='#FFFFFF' fill-opacity='0' data-act='info' data-e='${esc(e)}' style='cursor:pointer'/>` : '';
  const SVC = (x, y, w, h, o) => o.e ? `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='8' fill='#FFFFFF' fill-opacity='0' data-act='svc' data-dom='${o.dom}' data-svc='${o.svc}' data-e='${esc(o.e)}'${o.data ? ` data-data='${esc(JSON.stringify(o.data))}'` : ''}${o.ask ? ` data-ask='${esc(o.ask)}'` : ''} style='cursor:pointer'/>` : '';

  class VicBase extends HTMLElement {
    setConfig(c) {
      if (!c) throw new Error('Invalid configuration');
      this._c = Object.assign({ layout: 'auto', language: 'auto' }, c);
      this._key = '';
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.addEventListener('click', (ev) => this._click(ev));
        this.shadowRoot.addEventListener('input', (ev) => this._slide(ev, false));
        this.shadowRoot.addEventListener('change', (ev) => this._slide(ev, true));
        this.shadowRoot.addEventListener('pointerdown', (ev) => { if (ev.target && ev.target.type === 'range') this._drag = true; });
      }
      if (this._h) this._render();
    }
    connectedCallback() {
      if (!this._ro && window.ResizeObserver) {
        this._ro = new ResizeObserver((en) => { const w = en[0].contentRect.width; if (!w) return; const m = w < 560; if (m !== this._mobW) { this._mobW = m; this._render(); } });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    getGridOptions() { return { columns: 'full', rows: 'auto' }; }
    getCardSize() { return 6; }
    set hass(h) {
      this._h = h;
      const k = this._ids().map((e) => { const s = h.states[e]; return s ? s.state + '@' + s.last_updated : '-'; }).join('|');
      if (k === this._key) return;
      this._key = k;
      if (this._drag) { this._pending = true; return; }
      this._render();
    }
    get _t() { const l = this._c.language && this._c.language !== 'auto' ? this._c.language : ((this._h && this._h.locale && this._h.locale.language) || 'en'); return L[String(l).slice(0, 2)] || L.en; }
    get _mob() { if (this._c.layout === 'mobile') return true; if (this._c.layout === 'desktop') return false; if (this.constructor.screenBased) return window.innerWidth < 768; return this._mobW !== undefined ? this._mobW : window.innerWidth < 768; }
    _ids() { const out = []; const walk = (v) => { if (typeof v === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(v)) out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(this._c); return out; }
    num(e) { const s = e && this._h.states[e]; return s ? parseFloat(s.state) : NaN; }
    st(e) { const s = e && this._h.states[e]; return s ? String(s.state) : 'unknown'; }
    f(e, d, u, pre) { const n = this.num(e); return (pre || '') + (isNaN(n) ? '--' : this._dec(n, d)) + (u || ''); }
    _dec(n, d) { const s = n.toFixed(d); return this._t === L.de ? s.replace('.', ',') : s; }
    W(n) { return isNaN(n) ? '-- W' : (Math.abs(n) >= 1000 ? this._dec(n / 1000, 2) + ' kW' : Math.round(n) + ' W'); }
    sum(ids) { let t = 0, ok = false; list(ids).forEach((e) => { const n = this.num(e); if (!isNaN(n)) { t += n; ok = true; } }); return ok ? t : NaN; }
    first(ids) { for (const e of list(ids)) { const n = this.num(e); if (!isNaN(n)) return n; } return NaN; }
    DE(s) { const k = String(s || '').toUpperCase(); return this._t.states[k] || s; }
    kwh(e) { const n = this.num(e); return isNaN(n) ? '--' : (n >= 1000 ? this._dec(n / 1000, 2) + ' MWh' : this._dec(n, n < 100 ? 2 : 1) + ' kWh'); }
    alarmLevel(alarms, error) {
      const al = list(alarms).map((e) => this.st(e).toUpperCase());
      const err = error ? this.st(error).toUpperCase() : 'OK';
      return (al.includes('ALARM') || !['OK', 'NONE', '0', 'UNKNOWN', 'UNAVAILABLE', 'NONDECODABLE', 'NO_ERROR'].includes(err)) ? 2 : (al.includes('WARNING') ? 1 : 0);
    }
    _render() {
      if (!this._h || !this._c || !this.shadowRoot) return;
      let body;
      try { body = this.draw(); } catch (x) { body = `<div style='padding:16px;color:#FF9EA1'>${esc(x.message)}</div>`; }
      this.shadowRoot.innerHTML = `<style>:host{display:block}.k{position:relative;background:#0F1A26;border:1px solid #1F3247;border-radius:14px;overflow:hidden;font-family:Roboto,Arial,sans-serif;line-height:0}.sl{position:absolute;border-radius:999px;background:#18293B;border:1px solid #24384E;box-sizing:border-box;overflow:hidden;container-type:size;line-height:1}.sl .fl{position:absolute;left:0;top:0;bottom:0;border-radius:999px}.sl .lb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-weight:700;font-size:55cqh;pointer-events:none;white-space:nowrap}.sl input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;touch-action:none}</style><div class='k'>${body}</div>`;
    }
    // slider overlay over an SVG of size W x H
    slider(id, x, y, w, h, W, H, o) {
      this._sl = this._sl || {}; this._sl[id] = o;
      const p = (o.value - o.min) / (o.max - o.min) * 100;
      return `<div class='sl' style='left:${x / W * 100}%;top:${y / H * 100}%;width:${w / W * 100}%;height:${h / H * 100}%'><div class='fl' style='width:${p}%;background:${o.color || '#387DC5'}'></div><div class='lb'>${esc(o.label(o.value))}</div><input type='range' data-sl='${id}' min='${o.min}' max='${o.max}' step='${o.step}' value='${o.value}' data-cur='${o.value}' aria-label='${esc(o.aria || '')}'></div>`;
    }
    _slide(ev, done) {
      const el = ev.target; if (!el || !el.dataset || !el.dataset.sl) return;
      const o = this._sl && this._sl[el.dataset.sl]; if (!o) return;
      const v = Number(el.value), c = Number(el.dataset.cur);
      const w = el.parentNode;
      w.querySelector('.fl').style.width = ((v - o.min) / (o.max - o.min) * 100) + '%';
      w.querySelector('.lb').textContent = o.label(v);
      if (!done) return;
      const finish = () => { this._drag = false; if (this._pending) { this._pending = false; this._render(); } };
      if (v === c) { finish(); return; }
      this._ask(o.ask(c, v)).then((ok) => {
        if (ok) { o.set(v); el.dataset.cur = String(v); } else { el.value = String(c); w.querySelector('.fl').style.width = ((c - o.min) / (o.max - o.min) * 100) + '%'; w.querySelector('.lb').textContent = o.label(c); }
        finish();
      });
    }
    _click(ev) {
      const el = ev.composedPath().find((x) => x && x.dataset && x.dataset.act);
      if (!el) return;
      ev.stopPropagation();
      const d = el.dataset;
      if (d.act === 'info') { this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: d.e } })); return; }
      if (d.act === 'svc') {
        const data = Object.assign({ entity_id: d.e }, d.data ? JSON.parse(d.data) : {});
        const go = () => this._h.callService(d.dom, d.svc, data);
        if (d.ask) this._ask(d.ask).then((ok) => { if (ok) go(); }); else go();
      }
    }
    _ask(msg) {
      const t = this._t;
      return new Promise((res) => {
        const o = document.createElement('div');
        o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:Roboto,Arial,sans-serif';
        const bs = 'height:42px;padding:0 20px;border-radius:10px;font:700 15px Roboto,Arial,sans-serif;cursor:pointer;';
        o.innerHTML = `<div style="background:#18293B;border:1px solid #2B4560;border-radius:14px;padding:18px;width:calc(100% - 48px);max-width:340px;color:#FFFFFF;box-shadow:0 10px 30px rgba(0,0,0,0.5)"><div style="font-size:17px;font-weight:700;margin-bottom:8px">${esc(t.confirm)}</div><div style="font-size:15px;color:#C9D6E3;line-height:1.4">${esc(msg)}</div><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px"><button data-a="0" style="${bs}background:#0F1A26;color:#FFFFFF;border:1px solid #2B4560">${esc(t.cancel)}</button><button data-a="1" style="${bs}background:#387DC5;color:#FFFFFF;border:none">${esc(t.ok)}</button></div></div>`;
        const fin = (ok) => { o.remove(); res(ok); };
        o.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) fin(b.dataset.a === '1'); else if (e.target === o) fin(false); });
        document.body.appendChild(o);
      });
    }
    static editorSchema() { return []; }
    static getConfigElement() { const el = document.createElement('victron-solar-cards-editor'); el._schema = this.editorSchema(); return el; }
  }

  // ---------------------------------------------------------------- energy flow
  class VictronFlowCard extends VicBase {
    static getStubConfig() { return { grid_power: [], load_power: [], pv_power: '', battery_power: '', battery_soc: '' }; }
    static editorSchema() {
      return [
        ['grid_power', 'sensor', true], ['load_power', 'sensor', true], ['pv_power', 'sensor'], ['battery_power', 'sensor'], ['battery_soc', 'sensor'], ['battery_voltage', 'sensor'], ['battery_current', 'sensor'],
        ['battery_state', 'sensor'], ['battery_time_to_go', 'sensor'], ['inverter_dc_power', 'sensor'], ['inverter_power', 'sensor', true], ['dc_loads', 'sensor'], ['vebus_state', 'sensor'], ['ess_state', 'sensor'],
        ['battery_in_today', 'sensor'], ['battery_out_today', 'sensor'], ['battery_in_total', 'sensor'], ['battery_out_total', 'sensor'],
        ['pv_today', 'sensor'], ['pv_yesterday', 'sensor'], ['pv_week', 'sensor'], ['pv_month', 'sensor'], ['pv_year', 'sensor'], ['pv_total', 'sensor'],
        ['multi_title', 'text'], ['solar_title', 'text'], ['grid_info', 'sensor'], ['load_info', 'sensor'],
      ];
    }
    draw() {
      const c = this._c, t = this._t, mob = this._mob;
      const g = list(c.grid_power), l = list(c.load_power);
      const grid = this.sum(g), load = this.sum(l), pv = this.num(c.pv_power), bat = this.num(c.battery_power), soc = this.num(c.battery_soc);
      const mdc = this.num(c.inverter_dc_power), dcl = this.num(c.dc_loads), inv = this.sum(c.inverter_power);
      const ttg = this.num(c.battery_time_to_go);
      const ttgTxt = !isNaN(ttg) && ttg > 0 ? Math.floor(ttg / 3600) + ' h ' + Math.round((ttg % 3600) / 60) + ' min' : '--';
      const socCol = isNaN(soc) ? '#FFFFFF' : (soc < 20 ? '#E5484D' : (soc < 50 ? '#F7AB3E' : '#5DBE6E'));
      const ph = (ids) => ids.length > 1 ? ids.map((e, i) => 'L' + (i + 1) + ' ' + Math.round(this.num(e) || 0) + ' W').join(' · ') : '';
      const gridSub = [!isNaN(grid) && grid < 0 ? t.feedIn : t.import, ph(g)];
      const multiSub = [list(c.inverter_power).length ? t.inverter + ' ' + this.W(inv) : '', c.ess_state ? 'ESS: ' + this.st(c.ess_state).replace(/_/g, ' ') : ''];
      const batSub = [this.W(bat) + (c.battery_voltage ? ' · ' + this.f(c.battery_voltage, 1, ' V') : '') + (c.battery_current ? ' · ' + this.f(c.battery_current, 1, ' A') : ''), (c.battery_state ? this.DE(this.st(c.battery_state)) + ' · ' : '') + (c.battery_time_to_go ? t.rest + ' ' + ttgTxt : '')];
      const socTxt = isNaN(soc) ? '-- %' : Math.round(soc) + ' %';
      const vb = c.vebus_state ? this.DE(this.st(c.vebus_state)) : this.W(inv);
      const multiT = c.multi_title || t.multi, solarT = c.solar_title || t.solar;
      const hasDc = !!c.dc_loads;
      let b = '';
      const btab = (x, y, w, m) => {
        if (!c.battery_in_today && !c.battery_in_total) return;
        const fs = m ? 10 : 11, rh = m ? 13 : 14; const c1 = x + w * 0.62, c2 = x + w - 12;
        b += R(x + 10, y - 5, w - 20, 1, 0, '#24384E') + T(c1, y, t.in, fs - 1, '#6E8399', 'end', 700) + T(c2, y, t.out, fs - 1, '#6E8399', 'end', 700);
        [[t.now, this.W(isNaN(bat) ? NaN : Math.max(bat, 0)), this.W(isNaN(bat) ? NaN : Math.max(-bat, 0)), c.battery_power, c.battery_power], [t.today, this.kwh(c.battery_in_today), this.kwh(c.battery_out_today), c.battery_in_today, c.battery_out_today], [t.total, this.kwh(c.battery_in_total), this.kwh(c.battery_out_total), c.battery_in_total, c.battery_out_total]].forEach(([k, a, o, ea, eo], i) => {
          const yy = y + rh * (i + 1);
          b += T(x + 12, yy, k, fs, '#9FB3C8', 'start', 600) + T(c1, yy, a, fs, '#FFFFFF', 'end', 600) + T(c2, yy, o, fs, '#FFFFFF', 'end', 600);
          b += TAP(c1 - w * 0.3, yy - 2, w * 0.3, rh, ea) + TAP(c1 + 4, yy - 2, c2 - c1 - 4, rh, eo);
        });
      };
      const stab = (x, y, w, m) => {
        const rows = [[t.today, c.pv_today], [t.yesterday, c.pv_yesterday], [t.week, c.pv_week], [t.month, c.pv_month], [t.year, c.pv_year], [t.total, c.pv_total]].filter((r) => r[1]);
        if (!rows.length) return;
        const fs = m ? 10 : 11, rh = m ? 14 : 15, y0 = y + (m ? 62 : 70);
        b += R(x + 10, y0, w - 20, 1, 0, '#24384E');
        rows.forEach(([k, e], i) => { const yy = y0 + 6 + rh * i; const last = e === c.pv_total; b += T(x + 12, yy, k, fs, last ? '#F7AB3E' : '#9FB3C8', 'start', last ? 700 : 600) + T(x + w - 12, yy, this.kwh(e), fs, last ? '#F7AB3E' : '#FFFFFF', 'end', last ? 700 : 600) + TAP(x + 6, yy - 2, w - 12, rh, e); });
      };
      if (!mob) {
        b += `<path d='M120,190 L${hasDc ? 840 : 480},190' fill='none' stroke='#2B4560' stroke-width='3'/>`;
        b += FLOW('M220,80 L380,80', grid, '#9FB3C8') + FLOW('M580,80 L740,80', load, '#4AB9C1') + FLOW('M480,140 L480,190', mdc, '#387DC5') + FLOW('M120,190 L120,230', bat, '#5DBE6E') + FLOW('M480,230 L480,190', pv, '#F7AB3E');
        if (hasDc) b += FLOW('M840,190 L840,230', dcl, '#C58AE0');
        b += BOX(20, 20, 200, 120, '#9FB3C8', t.grid, this.W(grid), '#FFFFFF', gridSub) + TAP(20, 20, 200, 120, c.grid_info || g[0]);
        b += BOX(380, 20, 200, 120, '#387DC5', multiT, esc(vb), '#FFFFFF', multiSub) + TAP(380, 20, 200, 120, c.vebus_state || list(c.inverter_power)[0]);
        b += BOX(740, 20, 200, 120, '#4AB9C1', t.acLoads, this.W(load), '#FFFFFF', [ph(l)]) + TAP(740, 20, 200, 120, c.load_info || l[0]);
        b += BOX(20, 230, 200, 172, socCol, t.battery, socTxt, socCol, batSub) + TAP(20, 230, 200, 106, c.battery_soc);
        btab(20, 344, 200, false);
        b += BOX(380, 230, 200, 172, '#F7AB3E', solarT, this.W(pv), '#F7AB3E', []) + TAP(380, 230, 200, 68, c.pv_power);
        stab(380, 230, 200, false);
        if (hasDc) b += BOX(740, 230, 200, 172, '#C58AE0', t.dcLoads, this.W(dcl), '#FFFFFF', []) + TAP(740, 230, 200, 172, c.dc_loads);
        return SVG(960, 422, b);
      }
      b += `<path d='M105,305 L295,305' fill='none' stroke='#2B4560' stroke-width='3'/>`;
      b += FLOW('M105,130 L105,225 L115,225', grid, '#9FB3C8') + FLOW('M285,225 L295,225 L295,130', load, '#4AB9C1') + FLOW('M200,280 L200,305', mdc, '#387DC5') + FLOW('M105,305 L105,330', bat, '#5DBE6E') + FLOW('M295,330 L295,305', pv, '#F7AB3E');
      b += BOX(20, 20, 170, 110, '#9FB3C8', t.grid, this.W(grid), '#FFFFFF', gridSub, true) + TAP(20, 20, 170, 110, c.grid_info || g[0]);
      b += BOX(210, 20, 170, 110, '#4AB9C1', t.acLoads, this.W(load), '#FFFFFF', [ph(l)], true) + TAP(210, 20, 170, 110, c.load_info || l[0]);
      b += BOX(115, 170, 170, 110, '#387DC5', multiT, esc(vb), '#FFFFFF', multiSub, true) + TAP(115, 170, 170, 110, c.vebus_state || list(c.inverter_power)[0]);
      b += BOX(20, 330, 170, 168, socCol, t.battery, socTxt, socCol, batSub, true) + TAP(20, 330, 170, 92, c.battery_soc);
      btab(20, 430, 170, true);
      b += BOX(210, 330, 170, 168, '#F7AB3E', solarT, this.W(pv), '#F7AB3E', [], true) + TAP(210, 330, 170, 60, c.pv_power);
      stab(210, 330, 170, true);
      if (!hasDc) return SVG(400, 514, b);
      b += R(20, 514, 360, 44, 12, '#18293B', '#24384E', 1) + R(20, 514, 6, 44, 3, '#C58AE0') + T(38, 529, t.dcLoads, 12, '#9FB3C8', 'start', 700) + T(366, 525, this.W(dcl), 20, '#FFFFFF', 'end', 700) + TAP(20, 514, 360, 44, c.dc_loads);
      return SVG(400, 574, b);
    }
  }

  // ---------------------------------------------------------------- energy today
  class VictronEnergyCard extends VicBase {
    static getStubConfig() { return { solar_today: '', grid_in_today: '', feed_in_today: '', consumption_today: '' }; }
    static editorSchema() { return [['solar_today', 'sensor'], ['feed_in_today', 'sensor', true], ['grid_in_today', 'sensor', true], ['consumption_today', 'sensor'], ['battery_in_today', 'sensor'], ['battery_out_today', 'sensor'], ['meter_import', 'sensor'], ['meter_export', 'sensor'], ['meter_name', 'text']]; }
    draw() {
      const c = this._c, t = this._t, mob = this._mob;
      const solar = this.num(c.solar_today), gin = this.first(c.grid_in_today), gout = this.first(c.feed_in_today), cons = this.num(c.consumption_today), bin = this.num(c.battery_in_today), bout = this.num(c.battery_out_today);
      const k = (n) => isNaN(n) ? '--' : this._dec(n, n < 10 ? 2 : 1);
      const pct = (n) => isNaN(n) ? '--' : Math.round(Math.max(0, Math.min(100, n))) + ' %';
      const aut = (!isNaN(cons) && cons > 0 && !isNaN(gin)) ? (1 - gin / cons) * 100 : NaN;
      const eig = (!isNaN(solar) && solar > 0 && !isNaN(gout)) ? (1 - gout / solar) * 100 : NaN;
      const mn = c.meter_name || t.meter;
      const tiles = [[t.eSolar, solar, '#F7AB3E', t.eSelf + ' ' + pct(eig), c.solar_today], [t.eFeed, gout, '#9FB3C8', mn, list(c.feed_in_today)[0]], [t.eGrid, gin, '#E07A5F', mn, list(c.grid_in_today)[0]], [t.eCons, cons, '#4AB9C1', t.eAut + ' ' + pct(aut), c.consumption_today], [t.eBin, bin, '#5DBE6E', t.eBinS, c.battery_in_today], [t.eBout, bout, '#C58AE0', t.eBoutS, c.battery_out_today]].filter((x) => x[4]);
      const fz = (n) => isNaN(n) ? '--' : n.toLocaleString(this._t === L.de ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 });
      const meters = [[t.mImp, c.meter_import, '#E07A5F'], [t.mExp, c.meter_export, '#9FB3C8']].filter((x) => x[1]);
      let b = '';
      if (!mob) {
        const n = Math.max(1, tiles.length), tw = (928 - (n - 1) * 8) / n;
        tiles.forEach(([tt, v, col, sub, e], i) => { const x = 16 + i * (tw + 8), y = 16; b += R(x, y, tw, 128, 12, '#18293B', '#24384E', 1) + R(x, y, tw, 6, 3, col) + T(x + 14, y + 20, tt, 12, '#8AA0B6', 'start', 700) + T(x + 14, y + 44, k(v), 30, col, 'start', 700) + T(x + 14, y + 80, 'kWh', 13, '#9FB3C8', 'start', 600) + T(x + 14, y + 104, esc(sub), 12, '#6E8399') + TAP(x, y, tw, 128, e); });
        if (!meters.length) return SVG(960, 160, b);
        const mw = (928 - (meters.length - 1) * 16) / meters.length;
        meters.forEach(([tt, e, col], i) => { const x = 16 + i * (mw + 16), y = 158; b += R(x, y, mw, 74, 12, '#18293B', '#24384E', 1) + R(x, y, 6, 74, 3, col) + T(x + 20, y + 14, tt, 12, '#8AA0B6', 'start', 700) + T(x + mw - 16, y + 15, esc(mn), 11, '#6E8399', 'end') + T(x + 20, y + 34, fz(this.num(e)) + `<tspan font-size='14' fill='#9FB3C8' font-weight='600'> kWh</tspan>`, 26, '#FFFFFF', 'start', 700) + TAP(x, y, mw, 74, e); });
        return SVG(960, 246, b);
      }
      tiles.forEach(([tt, v, col, sub, e], i) => { const x = 16 + (i % 2) * 192, y = 12 + Math.floor(i / 2) * 100; b += R(x, y, 176, 90, 12, '#18293B', '#24384E', 1) + R(x, y, 6, 90, 3, col) + T(x + 18, y + 12, tt, 11, '#8AA0B6', 'start', 700) + T(x + 18, y + 32, k(v) + `<tspan font-size='13' fill='#9FB3C8' font-weight='600'> kWh</tspan>`, 24, col, 'start', 700) + T(x + 18, y + 66, esc(sub), 11, '#6E8399') + TAP(x, y, 176, 90, e); });
      const y0 = 12 + Math.ceil(tiles.length / 2) * 100;
      meters.forEach(([tt, e, col], i) => { const x = 16 + i * 192, y = y0; b += R(x, y, 176, 90, 12, '#18293B', '#24384E', 1) + R(x, y, 6, 90, 3, col) + T(x + 18, y + 12, tt, 10, '#8AA0B6', 'start', 700) + T(x + 18, y + 32, fz(this.num(e)) + `<tspan font-size='12' fill='#9FB3C8' font-weight='600'> kWh</tspan>`, 20, '#FFFFFF', 'start', 700) + T(x + 18, y + 66, esc(mn), 11, '#6E8399') + TAP(x, y, 176, 90, e); });
      return SVG(400, y0 + (meters.length ? 102 : 0), b);
    }
  }

  // ---------------------------------------------------------------- MPPT
  class VictronMpptCard extends VicBase {
    static get screenBased() { return true; }
    static getStubConfig() { return { name: 'MPPT 1', state: '', pv_power: '' }; }
    static editorSchema() { return [['name', 'text'], ['subtitle', 'text'], ['state', 'sensor'], ['pv_power', 'sensor'], ['pv_voltage', 'sensor'], ['pv_current', 'sensor'], ['battery_voltage', 'sensor'], ['battery_current', 'sensor'], ['yield_today', 'sensor'], ['yield_yesterday', 'sensor'], ['yield_total', 'sensor'], ['max_power_today', 'sensor'], ['mode', 'select'], ['relay', 'switch'], ['alarms', 'sensor', true], ['error', 'sensor']]; }
    draw() {
      const c = this._c, t = this._t, mob = this._mob, name = c.name || 'MPPT';
      const raw = this.st(c.state), up = raw.toUpperCase();
      const on = !['OFF', 'UNAVAILABLE', 'UNKNOWN'].includes(up);
      const pillBg = up === 'FAULT' ? '#E5484D' : (on ? '#F7AB3E' : '#2B3B4C'), pillFg = on || up === 'FAULT' ? '#0F1A26' : '#9FB3C8';
      const led = up === 'FLOAT' ? '#3CCF5A' : '#F7AB3E';
      const hasRel = !!(c.relay && this._h.states[c.relay]), relOn = this.st(c.relay) === 'on';
      const modeOn = this.st(c.mode).toUpperCase() === 'ON';
      const yt = [[t.yT, this.kwh(c.yield_today), c.yield_today], [t.yY, this.kwh(c.yield_yesterday), c.yield_yesterday], [t.yTot, this.kwh(c.yield_total), c.yield_total]];
      let b = '';
      const sw = (x, y, w, h, label, o, act) => { b += T(x + 8, y + h / 2 - 6, label, 10, '#8AA0B6', 'start', 700); const tx = x + w - 34; b += R(tx, y + h / 2 - 8, 28, 16, 8, o ? '#5DBE6E' : '#2B4560') + C(o ? tx + 20 : tx + 8, y + h / 2, 6, '#FFFFFF') + act; };
      const modeAct = (x, y, w, h) => SVC(x, y, w, h, { dom: 'select', svc: 'select_option', e: c.mode, data: { option: modeOn ? 'OFF' : 'ON' }, ask: modeOn ? t.qOff(name) : t.qOn(name) });
      const tiles = (y) => {
        yt.forEach(([k, val, e], i) => { const x = 16 + i * 94; b += R(x, y, 86, 58, 8, '#18293B', '#24384E', 1) + T(x + 10, y + 8, k, 11, '#8AA0B6', 'start', 600) + T(x + 10, y + 28, val, 13, '#FFFFFF', 'start', 700) + TAP(x, y, 86, 58, e); });
        const x = 298; b += R(x, y, 86, 58, 8, '#18293B', '#24384E', 1);
        if (hasRel) { sw(x, y + 1, 86, 28, t.relay, relOn, SVC(x, y, 86, 29, { dom: 'switch', svc: 'toggle', e: c.relay, ask: relOn ? t.qRelOff(name) : t.qRelOn(name) })); b += R(x + 6, y + 29, 74, 1, 0, '#24384E'); sw(x, y + 29, 86, 28, t.charger, modeOn, modeAct(x, y + 29, 86, 29)); }
        else if (c.mode) sw(x, y + 15, 86, 28, t.charger, modeOn, modeAct(x, y, 86, 58));
      };
      b += T(16, 14, esc(name), mob ? 17 : 18, '#FFFFFF', 'start', 700);
      if (c.subtitle) b += T(16, 36, esc(c.subtitle), 11, '#6E8399');
      b += PILL(384, 12, this.DE(raw), pillBg, pillFg) + TAP(280, 10, 106, 28, c.state);
      b += BELL(186, 24, this.alarmLevel(c.alarms, c.error)) + TAP(174, 10, 24, 28, list(c.alarms)[0] || c.error);
      if (c.mode) b += PWR(202, 12, modeOn) + modeAct(200, 10, 44, 28);
      const x0 = mob ? 118 : 145;
      const row = (y, key, val, e) => { b += T(x0, y, key, 11, '#8AA0B6', 'start', 600) + T(384, y - 2, val, mob ? 14 : 15, '#FFFFFF', 'end', 600) + TAP(x0 - 4, y - 5, 388 - x0, mob ? 22 : 26, e); };
      b += mob ? `<g transform='translate(16,52) scale(0.76)'>` + MPPT(0, 0, on, led) + `</g>` : MPPT(16, 60, on, led);
      const yb = mob ? 52 : 60;
      b += T(x0, yb, t.pvPower, 11, '#8AA0B6', 'start', 600) + T(x0, yb + 16, this.W(this.num(c.pv_power)), mob ? 26 : 30, '#F7AB3E', 'start', 700) + TAP(x0 - 4, yb - 4, 388 - x0, 48, c.pv_power);
      const y1 = mob ? 102 : 122, dy = mob ? 22 : 26;
      row(y1, t.pv, this.f(c.pv_voltage, 1, ' V') + ' · ' + this.f(c.pv_current, 1, ' A'), c.pv_voltage);
      row(y1 + dy, t.bat, this.f(c.battery_voltage, 2, ' V') + ' · ' + this.f(c.battery_current, 1, ' A'), c.battery_current);
      row(y1 + 2 * dy, t.yToday, this.f(c.yield_today, 2, ' kWh'), c.yield_today);
      row(y1 + 3 * dy, t.maxToday, this.W(this.num(c.max_power_today)), c.max_power_today);
      if (mob) { tiles(196); return SVG(400, 266, b); }
      tiles(226); return SVG(400, 300, b);
    }
  }

  // ---------------------------------------------------------------- MultiPlus (one phase)
  class VictronMultiplusCard extends VicBase {
    static get screenBased() { return true; }
    static getStubConfig() { return { name: 'MultiPlus-II L1', state: '' }; }
    static editorSchema() { return [['name', 'text'], ['subtitle', 'text'], ['state', 'sensor'], ['input_voltage', 'sensor'], ['input_frequency', 'sensor'], ['input_power', 'sensor'], ['output_voltage', 'sensor'], ['output_current', 'sensor'], ['output_power', 'sensor'], ['output_frequency', 'sensor'], ['inverter_power', 'sensor'], ['apparent_power', 'sensor'], ['dc_voltage', 'sensor'], ['alarms', 'sensor', true], ['error', 'sensor']]; }
    draw() {
      const c = this._c, t = this._t, mob = this._mob;
      const raw = this.st(c.state), up = raw.toUpperCase();
      const inV = this.num(c.input_voltage), invP = this.num(c.inverter_power);
      const chg = ['BULK', 'ABSORPTION', 'FLOAT', 'STORAGE', 'EQUALIZE'].includes(up);
      const pillBg = up === 'FAULT' ? '#E5484D' : (up === 'OFF' || up === 'UNAVAILABLE' ? '#2B3B4C' : '#387DC5');
      const mains = !isNaN(inV) && inV > 180, invOn = up === 'INVERTING' || (!isNaN(invP) && Math.abs(invP) > 30);
      let b = T(16, 14, esc(c.name || 'MultiPlus'), mob ? 17 : 18, '#FFFFFF', 'start', 700);
      if (c.subtitle) b += T(16, 36, esc(c.subtitle), 11, '#6E8399');
      b += PILL(384, 12, this.DE(raw), pillBg, '#FFFFFF') + TAP(280, 10, 106, 28, c.state);
      b += BELL(222, 24, this.alarmLevel(c.alarms, c.error)) + TAP(210, 10, 24, 28, list(c.alarms)[0] || c.error);
      const x0 = mob ? 106 : 155;
      const blk = (y, k, line, big, col, e) => { b += T(x0, y, k, 11, '#8AA0B6', 'start', 600) + T(384, y - 1, line, mob ? 12 : 13, '#9FB3C8', 'end') + T(x0, y + 15, big, mob ? 19 : 22, col, 'start', 700) + TAP(x0 - 4, y - 4, 388 - x0, mob ? 44 : 52, e); };
      const ys = mob ? [54, 102, 150] : [60, 120, 180];
      b += mob ? `<g transform='translate(16,54) scale(0.6)'>` + MULTI(0, 0, mains, invOn, chg, t) + `</g>` : MULTI(16, 58, mains, invOn, chg, t);
      blk(ys[0], t.acIn, this.f(c.input_voltage, 0, ' V') + ' · ' + this.f(c.input_frequency, 2, ' Hz'), this.W(this.num(c.input_power)), '#9FB3C8', c.input_power);
      blk(ys[1], t.acOut, this.f(c.output_voltage, 0, ' V') + ' · ' + this.f(c.output_current, 2, ' A'), this.W(this.num(c.output_power)), '#4AB9C1', c.output_power);
      blk(ys[2], t.inv, this.f(c.output_frequency, 2, ' Hz'), this.W(invP), '#387DC5', c.inverter_power);
      const yd = mob ? 196 : 256;
      b += R(16, yd, 368, 32, 8, '#18293B', '#24384E', 1) + T(28, yd + 9, t.dcBus, 12, '#8AA0B6', 'start', 600) + T(372, yd + 8, this.f(c.dc_voltage, 2, ' V') + (c.apparent_power ? ' · ' + t.apparent + ' ' + this.f(c.apparent_power, 0, ' VA') : ''), 13, '#FFFFFF', 'end', 600) + TAP(16, yd, 368, 32, c.dc_voltage);
      return SVG(400, mob ? 240 : 300, b);
    }
  }

  // ---------------------------------------------------------------- controls
  class VictronControlCard extends VicBase {
    static getStubConfig() { return { mode: '', force_charge: '', charge_limit: '' }; }
    static editorSchema() { return [['title', 'text'], ['mode', 'select'], ['force_charge', 'switch'], ['charge_limit', 'number'], ['charge_target', 'input_number'], ['max_current', 'num'], ['alarms', 'sensor', true], ['error', 'sensor']]; }
    draw() {
      const c = this._c, t = this._t, mob = this._mob;
      const mode = this.st(c.mode).toUpperCase(), fc = this.st(c.force_charge) === 'on';
      const act = this.num(c.charge_limit), tgt = this.num(c.charge_target), cur = isNaN(tgt) ? act : tgt;
      const pend = !isNaN(tgt) && !isNaN(act) && Math.round(tgt) !== Math.round(act);
      const lvl = this.alarmLevel(c.alarms, c.error);
      const W = mob ? 400 : 960; let b = '';
      b += T(16, 14, esc(c.title || (mob ? t.ctlShort : t.ctlTitle)), mob ? 16 : 18, '#FFFFFF', 'start', 700);
      b += BELL(W - 26, 22, lvl) + T(W - 42, 15, lvl === 2 ? t.alarm : (lvl === 1 ? t.warning : t.noAlarm), 12, lvl === 2 ? '#E5484D' : (lvl === 1 ? '#F7AB3E' : '#5DBE6E'), 'end', 700) + TAP(W - 160, 8, 150, 30, list(c.alarms)[0] || c.error);
      const sel = c.mode && this._h.states[c.mode];
      const opts = sel ? (sel.attributes.options || []) : [];
      const modes = ['ON', 'CHARGER', 'INVERTER', 'OFF'].map((k) => [opts.find((o) => String(o).toUpperCase() === k) || k, t.modes[k], k]);
      const seg = (x, y, w, h, opt, label, k) => { const on = mode === k; const col = k === 'OFF' ? '#E5484D' : '#387DC5'; b += R(x, y, w, h, 10, on ? col : '#18293B', on ? col : '#24384E', on ? 0 : 1) + T(x + w / 2, y + h / 2 - 8, label, 15, on ? '#FFFFFF' : '#9FB3C8', 'middle', 700) + SVC(x, y, w, h, { dom: 'select', svc: 'select_option', e: c.mode, data: { option: opt }, ask: t.qMode(label) }); };
      const tog = (x, y, w, h) => { b += R(x, y, w, h, 10, '#18293B', fc ? '#F7AB3E' : '#24384E', fc ? 2 : 1) + T(x + 14, y + h / 2 - 8, t.forceCharge, 15, fc ? '#F7AB3E' : '#FFFFFF', 'start', 700); const tx = x + w - 62; b += R(tx, y + h / 2 - 12, 48, 24, 12, fc ? '#F7AB3E' : '#2B4560') + C(fc ? tx + 36 : tx + 12, y + h / 2, 9, '#FFFFFF') + SVC(x, y, w, h, { dom: c.force_charge.split('.')[0], svc: 'toggle', e: c.force_charge, ask: fc ? t.qFcOff : t.qFcOn }); };
      const H = mob ? 244 : 156;
      let ov = '';
      const bar = (x, y, w, h) => {
        const ent = c.charge_target || c.charge_limit; if (!ent) return;
        const MX = Number(c.max_current) || 400, ST = 10, UNL = MX + ST;
        const txt = (v) => v >= UNL ? t.unlimited : v + ' A';
        const v0 = isNaN(cur) ? 0 : (cur < 0 ? UNL : Math.min(MX, Math.max(0, Math.round(cur / ST) * ST)));
        ov += this.slider('chg', x, y, w, h, W, H, { min: 0, max: UNL, step: ST, value: v0, color: pend ? '#F7AB3E' : '#387DC5', aria: t.maxChg, label: (v) => t.maxChg + ' ' + txt(v) + (pend && v === v0 ? (mob ? ' …' : t.applying) : ''), ask: (a, z) => t.qChg(txt(a), txt(z)), set: (v) => { const dom = ent.split('.')[0]; this._h.callService(dom, 'set_value', { entity_id: ent, value: v >= UNL ? -1 : v }); } });
      };
      const segs = c.mode ? modes : [];
      if (!mob) {
        segs.forEach(([o, l, k], i) => seg(20 + i * 126, 48, 120, 40, o, l, k));
        if (c.force_charge) tog(560, 48, 380, 40);
        bar(20, 100, 920, 40);
        return SVG(960, H, b) + ov;
      }
      segs.forEach(([o, l, k], i) => seg(16 + (i % 2) * 190, 44 + Math.floor(i / 2) * 46, 178, 40, o, l, k));
      if (c.force_charge) tog(16, 140, 368, 40);
      bar(16, 192, 368, 38);
      return SVG(400, H, b) + ov;
    }
  }

  // ---------------------------------------------------------------- editor (generic, driven by editorSchema)
  const LABELS = {
    grid_power: 'Grid power (one or one per phase)', load_power: 'AC load power (one or one per phase)', pv_power: 'PV power', battery_power: 'Battery power', battery_soc: 'Battery SoC',
    battery_voltage: 'Battery voltage', battery_current: 'Battery current', battery_state: 'Battery state', battery_time_to_go: 'Battery time to go (s)', inverter_dc_power: 'Inverter DC power',
    inverter_power: 'Inverter power (per device)', dc_loads: 'DC loads (optional)', vebus_state: 'VE.Bus state', ess_state: 'ESS state', battery_in_today: 'Battery in today (kWh)', battery_out_today: 'Battery out today (kWh)',
    battery_in_total: 'Battery in total (kWh)', battery_out_total: 'Battery out total (kWh)', pv_today: 'PV today', pv_yesterday: 'PV yesterday', pv_week: 'PV week', pv_month: 'PV month', pv_year: 'PV year', pv_total: 'PV total',
    multi_title: 'Title inverter box', solar_title: 'Title solar box', grid_info: 'Entity opened on tap (grid)', load_info: 'Entity opened on tap (loads)',
    solar_today: 'Solar today (kWh)', feed_in_today: 'Fed in today (first available)', grid_in_today: 'From grid today (first available)', consumption_today: 'Consumption today', meter_import: 'Meter reading import', meter_export: 'Meter reading export', meter_name: 'Meter name',
    name: 'Name', subtitle: 'Subtitle', state: 'State', pv_voltage: 'PV voltage', pv_current: 'PV current', yield_today: 'Yield today', yield_yesterday: 'Yield yesterday', yield_total: 'Yield total', max_power_today: 'Max power today',
    mode: 'Mode (select)', relay: 'Relay (switch, optional)', alarms: 'Alarm sensors', error: 'Error code sensor', input_voltage: 'AC input voltage', input_frequency: 'AC input frequency', input_power: 'AC input power',
    output_voltage: 'AC output voltage', output_current: 'AC output current', output_power: 'AC output power', output_frequency: 'AC output frequency', inverter_power_one: 'Inverter power', apparent_power: 'Apparent power', dc_voltage: 'DC voltage',
    title: 'Title', force_charge: 'Force charge switch', charge_limit: 'Max. charge current (number)', charge_target: 'Charge current target (input_number, optional)', max_current: 'Slider maximum (A)', layout: 'Layout', language: 'Language',
  };
  class VicEditor extends HTMLElement {
    setConfig(c) { this._c = Object.assign({}, c); this._draw(); }
    set hass(h) { this._h = h; this._draw(); }
    _draw() {
      if (!this._h || !this._c || !this._schema) return;
      if (!this._f) {
        this._f = document.createElement('ha-form');
        this._f.computeLabel = (s) => LABELS[s.name] || s.name;
        this._f.addEventListener('value-changed', (ev) => { this._c = Object.assign({}, this._c, ev.detail.value); this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._f);
      }
      const sch = this._schema.map(([name, kind, multi]) => {
        if (kind === 'text') return { name, selector: { text: {} } };
        if (kind === 'num') return { name, selector: { number: { min: 10, max: 2000, step: 10, mode: 'box' } } };
        return { name, selector: { entity: Object.assign({ domain: kind }, multi ? { multiple: true } : {}) } };
      });
      sch.push({ name: 'layout', selector: { select: { mode: 'dropdown', options: ['auto', 'desktop', 'mobile'] } } }, { name: 'language', selector: { select: { mode: 'dropdown', options: ['auto', 'de', 'en'] } } });
      this._f.hass = this._h; this._f.data = this._c; this._f.schema = sch;
    }
  }

  const CARDS = [
    ['victron-flow-card', VictronFlowCard, 'Victron Energy Flow', 'Grid, inverter, loads, battery and solar with animated power flow'],
    ['victron-energy-card', VictronEnergyCard, 'Victron Energy Today', 'Energy of the day: solar, grid, consumption, battery'],
    ['victron-mppt-card', VictronMpptCard, 'Victron MPPT', 'One SmartSolar charge controller'],
    ['victron-multiplus-card', VictronMultiplusCard, 'Victron MultiPlus', 'One MultiPlus / Quattro (one phase)'],
    ['victron-control-card', VictronControlCard, 'Victron Controls', 'Inverter mode, force charge and max. charge current'],
  ];
  if (!customElements.get('victron-solar-cards-editor')) customElements.define('victron-solar-cards-editor', VicEditor);
  window.customCards = window.customCards || [];
  CARDS.forEach(([tag, cls, name, desc]) => {
    if (!customElements.get(tag)) customElements.define(tag, cls);
    if (!window.customCards.find((x) => x.type === tag)) window.customCards.push({ type: tag, name, description: desc, documentationURL: 'https://github.com/ossilampe/victron-solar-cards' });
  });
  console.info('%c VICTRON-SOLAR-CARDS %c ' + VERSION, 'background:#387DC5;color:#FFFFFF;font-weight:700', '');
})();
