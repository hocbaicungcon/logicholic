// Static article navigation; no game engine is needed on reading pages.
(() => {
  const dropdown = document.getElementById('game-menu-dropdown');
  const triggers = [document.getElementById('header-brand-name'), document.getElementById('btn-game-menu')];
  const search = document.getElementById('game-search-input');
  const clear = document.getElementById('btn-clear-game-search');
  let opener;
  function setOpen(open) {
    dropdown.classList.toggle('active', open);
    triggers.forEach(button => button.setAttribute('aria-expanded', String(open)));
    if (open) search.focus();
  }
  triggers.forEach(button => {
    button.setAttribute('aria-controls', dropdown.id);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => { opener = button; setOpen(!dropdown.classList.contains('active')); });
  });
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target) && !triggers.some(button => button.contains(event.target))) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dropdown.classList.contains('active')) { setOpen(false); opener?.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (!dropdown.contains(event.target) && !triggers.some(button => button.contains(event.target))) setOpen(false);
  });
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  function filter() {
    const query = normalize(search.value.trim());
    let count = 0;
    dropdown.querySelectorAll('.game-nav-item').forEach(link => {
      link.hidden = !normalize(link.textContent).includes(query);
      if (!link.hidden) count++;
    });
    clear.style.display = query ? '' : 'none';
    document.getElementById('game-search-empty').style.display = count ? 'none' : '';
  }
  search.addEventListener('input', filter);
  clear.addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
  const themes = ['dark', 'light', 'sepia', 'eink'];
  const themeButton = document.getElementById('btn-theme-cycle');
  function cycleTheme() {
    const next = themes[(themes.indexOf(document.documentElement.dataset.theme || 'dark') + 1) % themes.length];
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('sudoku-coach-theme', next); localStorage.setItem('logicholic-theme-user-choice', 'true'); } catch (_) {}
  }
  themeButton.addEventListener('click', cycleTheme);
  document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 't' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.matches('input,textarea,select,[contenteditable]')) cycleTheme();
  });
})();
