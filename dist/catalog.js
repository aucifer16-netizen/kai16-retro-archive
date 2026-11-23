const cards = [...document.querySelectorAll('#game-list .card')];
const buttons = [...document.querySelectorAll('.filters button')];
const input = document.querySelector('#search');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty');
const params = new URLSearchParams(location.search);

let platform = buttons.some(button => button.dataset.platform === params.get('platform'))
  ? params.get('platform') : '';
input.value = params.get('q') || '';

function render() {
  const query = input.value.trim().normalize('NFC').toLocaleLowerCase();
  let visible = 0;
  for (const card of cards) {
    const matchesPlatform = !platform || card.dataset.platforms.split(';').includes(platform);
    const matchesQuery = card.dataset.search.normalize('NFC').toLocaleLowerCase().includes(query);
    card.hidden = !(matchesPlatform && matchesQuery);
    if (!card.hidden) visible += 1;
  }
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.platform === platform));
  count.textContent = new Intl.NumberFormat('th').format(visible) + ' เกม';
  empty.hidden = visible !== 0;

  const url = new URL(location.href);
  if (platform) url.searchParams.set('platform', platform);
  else url.searchParams.delete('platform');
  if (query) url.searchParams.set('q', input.value.trim());
  else url.searchParams.delete('q');
  if (url.href !== location.href && location.protocol !== 'file:') {
    history.replaceState(null, '', url);
  }
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    platform = button.dataset.platform;
    render();
  });
}
input.addEventListener('input', render);
render();