(() => {
  'use strict';

  const SECTIONS = {
    intro:    'Introduction',
    review:   'Chapter 2 · Review',
    nfcore:   'Chapter 3 · nf-core/circrna',
    pycircdb: 'Chapter 4 · pycircdb',
    cerna:    'Chapter 5 · ceRNA signature',
    disc:     'Contributions and acknowledgements',
    appendix: 'Viva backup (not timed)',
  };
  const secColor = id => `var(--s-${id})`;

  const stage = document.getElementById('stage');
  document.querySelectorAll('#viva-detail .slide').forEach(slide => {
    slide.dataset.sec = 'appendix';
    slide.dataset.min = '0';
    slide.dataset.title = 'Detail · ' + slide.dataset.title;
    const kicker = slide.querySelector('.kicker');
    if (kicker) kicker.textContent = 'Viva backup · ' + kicker.textContent;
  });
  const slides = [...document.querySelectorAll('.slide')];
  const mainSlides = slides.filter(slide => slide.dataset.sec !== 'appendix');
  const backupSlides = slides.filter(slide => slide.dataset.sec === 'appendix');
  const notesEl = document.getElementById('notes');
  const overviewEl = document.getElementById('overview');
  const $ = id => document.getElementById(id);
  let idx = 0;

  /* ---------- per-slide time plan (data-min, minutes) ---------- */
  let cursor = 0;
  slides.forEach(s => {
    s._min = parseFloat(s.dataset.min || '0');
    s._start = cursor;
    cursor += s._min;
    s._end = cursor;
  });
  const TOTAL_MIN = cursor;

  const fragsOf = s => [...s.querySelectorAll('.frag')];
  const fmt = ms => {
    const s = Math.max(0, Math.floor(ms / 1000)), m = Math.floor(s / 60);
    return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };

  function fit() {
    const s = Math.min(innerWidth / 1280, (innerHeight - 40) / 720);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }

  /* ---------- section progress ticker ---------- */
  const TICKER_SECS = ['intro', 'review', 'nfcore', 'pycircdb', 'cerna', 'disc'];
  const tickerEl = document.createElement('div');
  tickerEl.id = 'ticker';
  tickerEl.setAttribute('aria-hidden', 'true');
  const tickEls = [];
  slides.forEach((s, k) => {
    if (!TICKER_SECS.includes(s.dataset.sec)) return;
    const t = document.createElement('i');
    t.className = 'tk-t';
    t.style.setProperty('--c', secColor(s.dataset.sec));
    tickerEl.appendChild(t);
    tickEls[k] = t;
  });
  stage.appendChild(tickerEl);

  function updateTicker() {
    tickerEl.style.display = (slides[idx].dataset.sec === 'appendix' || idx === 0) ? 'none' : 'flex';
    tickEls.forEach((t, k) => {
      if (!t) return;
      t.classList.toggle('done', k <= idx);
    });
  }

  function show(i, revealAll = false) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => {
      const on = k === idx;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', String(!on));
    });
    fragsOf(slides[idx]).forEach(f => f.classList.toggle('shown', revealAll));
    history.replaceState(null, '', '#' + (idx + 1));
    const backup = slides[idx].dataset.sec === 'appendix';
    $('counter').textContent = backup
      ? `Backup ${backupSlides.indexOf(slides[idx]) + 1} / ${backupSlides.length}`
      : `${mainSlides.indexOf(slides[idx]) + 1} / ${mainSlides.length}`;
    document.querySelector('#progress i').style.width = `${Math.min((idx + 1) / mainSlides.length, 1) * 100}%`;
    const note = slides[idx].querySelector('.notes');
    notesEl.innerHTML = note ? note.innerHTML : '';
    updateTicker();
    updateHud();
  }

  function next() {
    const hidden = fragsOf(slides[idx]).find(f => !f.classList.contains('shown'));
    if (hidden) { hidden.classList.add('shown'); return; }
    if (idx < slides.length - 1) {
      if (idx === 0 && !running && acc === 0) startTimer();
      show(idx + 1);
    }
  }

  function prev() {
    const shown = fragsOf(slides[idx]).filter(f => f.classList.contains('shown'));
    if (shown.length) { shown[shown.length - 1].classList.remove('shown'); return; }
    if (idx > 0) show(idx - 1, true);
  }

  /* ---------- timer and schedule status ---------- */
  let acc = 0, t0 = null, running = false;
  const elapsedMs = () => acc + (running ? performance.now() - t0 : 0);
  function startTimer() { if (!running) { t0 = performance.now(); running = true; } }
  function pauseTimer() { if (running) { acc += performance.now() - t0; running = false; } }
  function resetTimer() { acc = 0; t0 = null; running = false; updateHud(); }

  function updateHud() {
    const s = slides[idx];
    const sec = s.dataset.sec;
    const el = elapsedMs();
    $('clock').textContent = fmt(el);
    $('actchip').textContent = s._min > 0
      ? `${SECTIONS[sec]} · slide plan ${fmt(s._start * 60000)}–${fmt(s._end * 60000)} of ${fmt(TOTAL_MIN * 60000)}`
      : SECTIONS[sec];
    const st = $('status');
    st.className = ''; st.textContent = '';
    if (el < 1000 || s._min === 0) return;
    const min = el / 60000;
    if (min > s._end)        { st.textContent = `behind by ${fmt((min - s._end) * 60000)}`; st.className = 'behind'; }
    else if (min < s._start) { st.textContent = `ahead by ${fmt((s._start - min) * 60000)}`; st.className = 'ahead'; }
    else                     { st.textContent = 'on schedule'; st.className = 'ok'; }
  }
  setInterval(updateHud, 500);

  /* ---------- notes, overview, fullscreen ---------- */
  const toggleNotes = () => notesEl.classList.toggle('on');
  const toggleFull = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();

  function buildOverview() {
    let html = '', current = null;
    slides.forEach((s, k) => {
      if (s.dataset.sec !== current) {
        if (current) html += '</div>';
        current = s.dataset.sec;
        const mins = slides.filter(x => x.dataset.sec === current).reduce((a, x) => a + x._min, 0);
        html += `<h2>${SECTIONS[current]}${mins ? ` · ${mins} min` : ''}</h2><div class="grid">`;
      }
      html += `<button type="button" data-i="${k}" style="--c:${secColor(s.dataset.sec)}"><small>${k + 1}${s._min ? ` · ${s._min} min` : ''}</small>${s.dataset.title}</button>`;
    });
    $('overview-body').innerHTML = html + '</div>';
  }
  function toggleOverview(force) {
    const on = force ?? !overviewEl.classList.contains('on');
    overviewEl.classList.toggle('on', on);
    if (on) overviewEl.querySelectorAll('button').forEach(b => b.classList.toggle('cur', +b.dataset.i === idx));
  }
  overviewEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-i]');
    if (b) { show(+b.dataset.i); toggleOverview(false); }
  });

  /* ---------- input ---------- */
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const onButton = !!(e.target.closest && e.target.closest('button'));
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); next(); break;
      case ' ': case 'Enter': if (onButton) return; e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1, true); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'o': case 'O': toggleOverview(); break;
      case 'Escape': toggleOverview(false); break;
      case 'f': case 'F': toggleFull(); break;
      case 't': running ? pauseTimer() : startTimer(); updateHud(); break;
      case 'R': resetTimer(); break;
    }
  });
  document.addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.blur(); });
  $('btn-prev').onclick = prev;
  $('btn-next').onclick = next;
  $('btn-notes').onclick = toggleNotes;
  $('btn-overview').onclick = () => toggleOverview();
  $('btn-full').onclick = toggleFull;
  $('btn-timer').onclick = () => { running ? pauseTimer() : startTimer(); updateHud(); };

  let sx = null;
  addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    sx = null;
  });
  addEventListener('resize', fit);
  addEventListener('hashchange', () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (Number.isFinite(n) && n - 1 !== idx) show(n - 1);
  });

  /* ---------- boot ---------- */
  buildOverview();
  fit();
  const start = parseInt(location.hash.slice(1), 10);
  show(Number.isFinite(start) ? start - 1 : 0);
})();
