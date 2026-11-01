/* Charts used in the deck. Every value below is transcribed from the thesis (table/figure noted per dataset). */
(() => {
  'use strict';

  /* ---------- generic ranked bar chart ---------- */
  function rankChart(root, cfg) {
    const { rows, metrics, rowH = 40, nameW = 190, valW = 76, min = 0, max = 100,
            decimals = 2, suffix = '%', fontSize = 17, barH = 0.58, note = '', hint = '' } = cfg;
    let key = metrics[0].key;
    root.classList.add('rank');
    root.innerHTML = '';

    if (metrics.length > 1) {
      const tg = document.createElement('div');
      tg.className = 'toggle';
      tg.innerHTML = '<span>Rank by</span>';
      metrics.forEach((m, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = m.label;
        b.setAttribute('aria-pressed', String(i === 0));
        b.addEventListener('click', () => {
          key = m.key;
          tg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          render();
        });
        tg.appendChild(b);
      });
      root.appendChild(tg);
    }

    const list = document.createElement('div');
    list.className = 'rows';
    list.style.height = rows.length * rowH + 'px';
    list.style.fontSize = fontSize + 'px';
    root.appendChild(list);

    const noteEl = document.createElement('div');
    noteEl.className = 'note';
    noteEl.textContent = note;
    root.appendChild(noteEl);
    const det = document.createElement('div');
    det.className = 'detail';
    det.textContent = hint;
    root.appendChild(det);

    rows.forEach(r => {
      const el = document.createElement('div');
      el.className = 'row ' + (r.cls || '');
      el.tabIndex = 0;
      el.style.height = rowH + 'px';
      el.style.gridTemplateColumns = `${nameW}px 1fr ${valW}px`;
      el.innerHTML = '<span class="name"></span><div class="track"><div class="fill"></div></div><span class="val"></span>';
      const nm = el.querySelector('.name');
      nm.textContent = r.name;
      if (r.sub) { const s = document.createElement('i'); s.textContent = ' ' + r.sub; nm.appendChild(s); }
      el.querySelector('.track').style.height = Math.round(rowH * barH) + 'px';
      const show = () => { det.textContent = cfg.detail ? cfg.detail(r) : ''; };
      const clear = () => { det.textContent = hint; };
      el.addEventListener('mouseenter', show); el.addEventListener('focus', show);
      el.addEventListener('mouseleave', clear); el.addEventListener('blur', clear);
      list.appendChild(el);
      r.el = el;
    });

    function render() {
      [...rows].sort((a, b) => b.v[key] - a.v[key]).forEach((r, rank) => {
        r.el.style.transform = `translateY(${rank * rowH}px)`;
        r.el.querySelector('.fill').style.width = ((r.v[key] - min) / (max - min)) * 100 + '%';
        r.el.querySelector('.val').textContent = r.v[key].toFixed(decimals) + suffix;
      });
    }
    render();
  }

  /* ---------- Chapter 3: per-tool performance, simulated glioblastoma dataset (Table 3.3) ---------- */
  const TOOLS = [
    { name: 'CIRCexplorer2',        v: { f: 92.47, p: 99.82, s: 86.13 }, t: '7 min',  m: '20 GB', n: '6,270 detected' },
    { name: 'CIRIquant',            v: { f: 95.63, p: 99.93, s: 91.69 }, t: '13 min', m: '65 GB', n: '6,668 detected' },
    { name: 'circRNA_finder',       v: { f: 89.25, p: 97.18, s: 82.52 }, t: '7 min',  m: '20 GB', n: '6,171 detected' },
    { name: 'DCC',                  v: { f: 81.00, p: 75.55, s: 87.30 }, t: '34 min', m: '21 GB', n: '8,397 detected', cls: 'warn' },
    { name: 'find_circ',            v: { f: 91.99, p: 99.76, s: 85.34 }, t: '6 min',  m: '3 GB',  n: '6,217 detected' },
    { name: 'MapSplice',            v: { f: 91.69, p: 99.97, s: 84.67 }, t: '9 min',  m: '6 GB',  n: '6,155 detected' },
    { name: 'Segemehl',             v: { f: 76.46, p: 97.92, s: 62.72 }, t: '6 min',  m: '50 GB', n: '4,655 detected' },
    { name: 'Consensus (≥2 tools)', v: { f: 97.94, p: 99.83, s: 96.12 }, cls: 'ref', n: 'circRNAs called by ≥2 tools' },
  ];
  const toolsEl = document.getElementById('chart-tools');
  if (toolsEl) rankChart(toolsEl, {
    rows: TOOLS, rowH: 44, nameW: 196, valW: 82, max: 100, fontSize: 18,
    metrics: [{ key: 'f', label: 'F1' }, { key: 'p', label: 'Precision' }, { key: 's', label: 'Sensitivity' }],
    note: 'Simulated glioblastoma dataset (7,267 circRNAs); ≥2 BSJ reads required per call. Axis 0–100%.',
    hint: 'Hover a row for detail.',
    detail: r => `${r.name}: precision ${r.v.p.toFixed(2)}%, sensitivity ${r.v.s.toFixed(2)}%, F1 ${r.v.f.toFixed(2)}%` +
      (r.t ? ` · ${r.t} · ${r.m}` : '') + ` · ${r.n}`,
  });

  /* ---------- Chapter 5: bootstrap predictor selection frequency (200 resamples) ---------- */
  const BOOT = [
    { name: 'Gleason score', v: { c: 118 }, cls: 'ref', sub: '(clinical)' },
    { name: 'RNASEH2C', v: { c: 105 } }, { name: 'SSTR1', v: { c: 102 } }, { name: 'SPARC', v: { c: 94 } },
    { name: 'BGN', v: { c: 84 } }, { name: 'LIX1', v: { c: 68 } }, { name: 'NEU3', v: { c: 60 } },
    { name: 'MAPK8IP2', v: { c: 21 } }, { name: 'B4GALT1', v: { c: 16 } },
  ];
  const bootEl = document.getElementById('chart-boot');
  if (bootEl) rankChart(bootEl, {
    rows: BOOT, rowH: 40, nameW: 170, valW: 52, max: 200, decimals: 0, suffix: '', fontSize: 18,
    metrics: [{ key: 'c', label: 'Selections' }],
    note: 'Number of bootstrap samples (of 200) in which CoxBoost selected each predictor. Selected predictors shown.',
  });

  /* ---------- Chapter 5: comparison with published signatures, GSE46602 (Table 5.3) ---------- */
  const SIGS = [
    ['Agell', 12, .83, .98, .84, .82], ['Bibikova', 16, .83, .86, .89, .91], ['Bismar', 12, .76, .83, .78, .81],
    ['This study', 23, .71, .67, .78, .87], ['Ding', 4, .64, .55, .69, .80], ['Erho', 19, .89, .99, .91, .95],
    ['Glinsky', 11, .82, .81, .84, .81], ['Irshad', 19, .89, .92, .96, .96], ['Jia', 15, .79, .84, .83, .89],
    ['Klein', 12, .85, .90, .87, .89], ['Long', 24, .98, .99, 1.00, 1.00], ['Nakagawa', 17, .91, .97, .94, .99],
    ['Olmos', 9, .75, .89, .76, .79], ['Ramaswamy', 17, .86, .88, .90, .91], ['Ross', 6, .75, .86, .77, .81],
    ['Sharma', 16, .78, .77, .83, .86], ['Talantov', 3, .61, .52, .64, .61], ['Yu', 14, .81, .86, .81, .88],
  ].map(([name, g, c, a1, a3, a5]) => ({
    name, sub: `(${g})`, g, v: { c, a1, a3, a5 }, cls: name === 'This study' ? 'warn' : '',
  }));
  const sigEl = document.getElementById('chart-sigs');
  if (sigEl) rankChart(sigEl, {
    rows: SIGS, rowH: 23, nameW: 112, valW: 46, min: 0.5, max: 1, decimals: 2, suffix: '', fontSize: 14.5, barH: 0.62,
    metrics: [{ key: 'c', label: 'Harrell’s C' }, { key: 'a1', label: 'AUC 1 y' }, { key: 'a3', label: 'AUC 3 y' }, { key: 'a5', label: 'AUC 5 y' }],
    note: 'Axis starts at 0.5 (chance). (n) = number of genes. GSE46602 validation cohort (n = 36).',
    hint: 'Hover a row for all metrics.',
    detail: r => `${r.name} (${r.g} genes): C ${r.v.c.toFixed(2)}, AUC 1 y ${r.v.a1.toFixed(2)}, 3 y ${r.v.a3.toFixed(2)}, 5 y ${r.v.a5.toFixed(2)}`,
  });

  /* ---------- Chapter 4: pycircdb scaling (Table 4.2) ---------- */
  const plotEl = document.getElementById('plot-scaling');
  if (plotEl) {
    const NS = 'http://www.w3.org/2000/svg';
    const W = 560, H = 320, m = { l: 58, r: 40, t: 18, b: 54 };
    const pts = [
      { n: 100, t: 13.7, f: true }, { n: 1000, t: 16.2, f: true }, { n: 10000, t: 25.8, f: true },
      { n: 100000, t: 35.0 }, { n: 200000, t: 52.9 }, { n: 300000, t: 66.7 },
    ];
    const x = n => m.l + (Math.log10(n) - 2) / 3.6 * (W - m.l - m.r);
    const y = t => H - m.b - (t / 80) * (H - m.t - m.b);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'plot');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Wall-clock time versus number of input circRNAs');
    const add = (tag, attrs, text) => {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      if (text !== undefined) e.textContent = text;
      svg.appendChild(e);
      return e;
    };
    [0, 20, 40, 60, 80].forEach(t => {
      add('line', { class: 'gr', x1: m.l, x2: W - m.r, y1: y(t), y2: y(t) });
      add('text', { x: m.l - 8, y: y(t) + 4, 'text-anchor': 'end' }, t);
    });
    [100, 1000, 10000, 100000].forEach(n => {
      add('line', { class: 'ax', x1: x(n), x2: x(n), y1: H - m.b, y2: H - m.b + 5 });
      add('text', { x: x(n), y: H - m.b + 20, 'text-anchor': 'middle' }, n.toLocaleString('en-GB'));
    });
    add('line', { class: 'ax', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b });
    add('line', { class: 'ax', x1: m.l, x2: m.l, y1: m.t, y2: H - m.b });
    add('text', { x: (m.l + W - m.r) / 2, y: H - 10, 'text-anchor': 'middle' }, 'Input circRNAs (log scale)');
    add('text', { transform: `translate(16 ${(m.t + H - m.b) / 2}) rotate(-90)`, 'text-anchor': 'middle' }, 'Wall-clock time (s)');
    [true, false].forEach(f => {
      const series = pts.filter(p => !!p.f === f);
      add('polyline', { class: 'ln', points: series.map(p => `${x(p.n)},${y(p.t)}`).join(' ') });
    });
    pts.forEach(p => {
      const c = add('circle', { class: 'pt' + (p.f ? '' : ' open'), cx: x(p.n), cy: y(p.t), r: 5 });
      c.appendChild(Object.assign(document.createElementNS(NS, 'title'), { textContent: `${p.n.toLocaleString('en-GB')} circRNAs: ${p.t} s` }));
      add('text', { x: x(p.n) + 8, y: y(p.t) + 18, 'text-anchor': 'start' }, p.t.toFixed(1));
    });
    plotEl.appendChild(svg);
  }
})();
