import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const games = JSON.parse(readFileSync(new URL('./games.json', import.meta.url), 'utf8'));
const facebook = 'https://www.facebook.com/people/แปล-mod-by-kai16/61593778466354/';
const platforms = ['Super Famicom / SNES', 'Nintendo 64', 'PlayStation', 'PlayStation 5', 'Xbox Series X|S'];
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

function page(title, content, base = '', script = '', home = base || './') {
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="คลังแพตช์และคู่มือเกมภาษาไทยของ kai16">
<title>${escape(title)}</title>
<link rel="stylesheet" href="${base}site.css">
</head>
<body>
<a class="skip" href="#main">ข้ามไปยังเนื้อหา</a>
<header class="top"><div class="wrap topline">
<a class="brand" href="${home}"><b aria-hidden="true">K</b><span>KAI16<span class="dim">.ARCHIVE</span></span></a>
<nav aria-label="เมนูหลัก"><a href="${home}">คลังเกม</a><a href="${facebook}">Facebook</a></nav>
</div></header>
<main class="wrap" id="main">${content}</main>
<footer class="wrap footer"><a href="${facebook}">แปล mod by kai16</a><span>คลังแพตช์และคู่มือเกมภาษาไทย</span></footer>
${script}</body></html>`;
}

function card(game) {
  return `<article class="card" data-platforms="${escape(game.platforms.join(';'))}" data-search="${escape([game.title, game.subtitle, game.type, ...game.platforms, game.postText].join(' '))}">
<a class="card-link" href="games/${game.id}/">
<div class="card-image ${game.id}">${game.images?.[0] ? `<img src="media/${game.images[0]}" alt="" loading="lazy">` : `<div class="cover-placeholder"><strong>${escape(game.cover || game.title)}</strong><small>${escape(game.platforms[0])}</small></div>`}<span>${escape(game.type)}</span></div>
<div class="card-body"><p class="platform">${game.platforms.map(escape).join(' / ')}</p>
<h3>${escape(game.title)}</h3><p class="subtitle">${escape(game.subtitle)}</p>
<span class="card-open">ดูรายละเอียด</span></div></a></article>`;
}

function detail(game) {
  const gallery = game.images?.length ? game.images.map((image, index) => `
<figure><a href="../../media/${image}" aria-label="เปิดภาพเต็ม ภาพที่ ${index + 1}"><img src="../../media/${image}" alt="${escape(game.title)} ภาพที่ ${index + 1}"></a></figure>`).join('')
    : `<p class="no-image">ภาพทั้งหมดอยู่ในโพสต์ต้นฉบับ <a href="${escape(game.source)}">เปิดโพสต์ Facebook</a></p>`;
  return page(`${game.title} | KAI16.ARCHIVE`, `
<div class="back"><a href="../../index.html">กลับไปคลังเกม</a></div>
<div class="detail-head"><p class="platform">${game.platforms.map(escape).join(' / ')}</p><h1>${escape(game.title)}</h1><p class="detail-subtitle">${escape(game.subtitle)}</p></div>
<div class="detail-grid">
<section class="window"><h2>ภาพจากหน้าแจก</h2><div class="gallery">${gallery}</div></section>
<section class="window"><h2>ข้อมูล${escape(game.type)}</h2><div class="detail-copy">
<p>${escape(game.description)}</p><dl><div><dt>รูปแบบ</dt><dd>${escape(game.format)}</dd></div><div><dt>เครดิต</dt><dd>${escape(game.credit)}</dd></div></dl>
<ul>${game.notes.map(note => `<li>${escape(note)}</li>`).join('')}</ul>
<div class="actions">${game.download ? `<a class="button primary" href="${escape(game.download)}">${game.type === 'คู่มือ PDF' ? 'ดาวน์โหลดคู่มือ PDF' : 'ดาวน์โหลดแพตช์'}</a>` : ''}
<a class="button" href="${escape(game.source)}">${game.source.includes('facebook.com') ? 'ดูโพสต์ต้นฉบับ' : 'ดูแหล่งข้อมูลและทางไปหน้าแจก'}</a></div>
</div></section></div>
<section class="window original-post"><h2>ข้อความจากโพสต์ Facebook ต้นฉบับ</h2><div class="post-text">${escape(game.postText || 'ยังไม่มีข้อความต้นฉบับในข้อมูลเกมนี้')}</div></section>`, '../../', '', '../../index.html');
}

const filters = ['ทั้งหมด', ...platforms].map((platform, index) => `<button type="button" data-platform="${index ? escape(platform) : ''}" aria-pressed="${index === 0}">${escape(platform)}</button>`).join('');

writeFileSync('dist/index.html', page('คลังเกมแปลไทย | KAI16.ARCHIVE', `
<section class="console">
<div class="console-label"><span>RETRO GAME ARCHIVE</span><span>ภาษาไทย / TH</span></div>
<div class="screen"><div class="screen-copy"><p class="prompt">KAI16 / GAME LIBRARY</p>
<h1>คลังเกมแปลไทย</h1><p class="tagline">แพตช์และคู่มือเกมภาษาไทย จากเพจแปล mod by kai16</p></div>
<div class="cartridge" aria-hidden="true"><i></i><span>KAI<span>16</span></span><b>THAI MOD</b></div></div>
</section>
<section class="library" aria-labelledby="library-title">
<div class="library-head"><h2 id="library-title">รายการเกม</h2><p id="result-count" aria-live="polite">${games.length} เกม</p></div>
<div class="controls"><div class="filters" aria-label="กรองตามแพลตฟอร์ม">${filters}</div>
<label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="ค้นหาชื่อเกม" aria-label="ค้นหาชื่อเกม"></label></div>
<div id="game-list" class="grid">${games.map(card).join('')}</div>
<p id="empty" class="empty" hidden>ไม่พบเกมที่ตรงกับตัวกรอง</p>
</section>`, '', '<script src="catalog.js" defer></script>'));

for (const game of games) {
  const folder = `dist/games/${game.id}`;
  mkdirSync(folder, { recursive: true });
  writeFileSync(`${folder}/index.html`, detail(game));
}
