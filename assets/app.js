/* 共享渲染器：所有页面内容由 content.js 驱动
   整改（2026-09-29 码仔）：
   P0-3 移动端汉堡菜单（纯 JS + CSS，无依赖）
   P2-2 痛点区图标：content.js 只存语义键，此处渲染统一线性 SVG（stroke 1.5）
   P2-4 回到顶部悬浮按钮；404 品牌兜底页渲染
   P1-5 首页次级 CTA 已改指 cases.html（label 定稿「查看真实案例」）
   集成轮：P0-2 产品实证渲染器 + P0-1 真实案例主打卡渲染器（文案全走 content.js） */
(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || 'home';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* 统一线性图标 sprite（P2-2）：content.js 的 icon 字段只写语义键 */
  const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    <symbol id="i-night" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1-4.9A8.4 8.4 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4z"/></symbol>
    <symbol id="i-megaphone" viewBox="0 0 24 24"><path d="M3 10v4a1 1 0 0 0 1 1h2l4 5h2v-5"/><path d="M12 10H3"/><path d="M16 5a8 8 0 0 1 0 14"/><path d="M13 8.5a4.5 4.5 0 0 1 0 7"/></symbol>
    <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M4 3h16v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol>
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', SPRITE);
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${esc(name)}"></use></svg>`;

  /* 导航 + 页脚 */
  $('nav').innerHTML = `
    <div class="wrap nav">
      <a class="brand" href="index.html">${esc(S.meta.brand)}<span class="brand-slogan"><span> · </span>${esc(S.meta.slogan.split('？')[0].replace('招人难、人力贵', '数字员工'))}</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-label="菜单">
        <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <ul>${S.nav.map((n) => `<li><a href="${n.href}" class="${n.href === page + '.html' || (page === 'home' && n.href === 'index.html') ? 'active' : ''}">${esc(n.label)}</a></li>`).join('')}</ul>
    </div>`;
  $('footer').innerHTML = `
    <div class="wrap">
      <p>${esc(S.meta.icp)}</p>
      <p style="margin-top:8px">${esc(S.footer.note)}</p>
    </div>`;

  /* P0-3 汉堡菜单：纯 JS 切换 class，样式走 style.css 媒体查询 */
  const header = document.querySelector('header.site');
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelector('.nav ul').addEventListener('click', () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  /* P2-4 回到顶部悬浮按钮 */
  const backtop = document.createElement('button');
  backtop.className = 'backtop';
  backtop.setAttribute('aria-label', '回到顶部');
  backtop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backtop);
  backtop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    backtop.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  const btn = (b, cls) => `<a class="btn ${cls}" href="${b.href}">${esc(b.label)}</a>`;
  const card = (c) => `<div class="card">${c.icon ? icon(c.icon) : ''}${c.tag ? `<span class="tag">${esc(c.tag)}</span>` : ''}<h3>${esc(c.title || c.name)}</h3><p>${esc(c.desc || c.role || '')}</p>${c.points ? `<ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${c.result ? `<p style="margin-top:12px;color:var(--accent2)">▸ ${esc(c.result)}</p>` : ''}</div>`;

  /* 截图占位框：TODO 等真实截图（16:9，敏感信息打码）替换 */
  const shotBox = (s, hero) => s.img
    ? `<img class="shot-box${hero ? ' shot-box--hero' : ''}" src="${esc(s.img)}" alt="${esc(s.label)}" loading="lazy">`
    : `<div class="shot-box${hero ? ' shot-box--hero' : ''}"><span>${esc(s.label)}</span><em>${esc(s.hint)}</em></div>`;
  const shotCaption = (c) => `<figcaption><b>${esc(c.b)}</b>${esc(c.text)}</figcaption>`;

  /* P0-2：产品实证模块（文案全在 content.js 的 proof 键） */
  const renderProof = () => {
    const el = $('proof');
    if (!el || !S.proof) return;
    const P = S.proof;
    el.innerHTML = `
      <div class="wrap">
        <header class="ev-head">
          <span class="ev-kicker">${esc(P.kicker)}</span>
          <h2>${esc(P.title)}</h2>
          <p>${esc(P.claim)}</p>
        </header>
        <div class="ev-grid">
          <figure class="ev-shot">
            ${shotBox(P.shot, true)}
            ${shotCaption(P.shot.caption)}
          </figure>
          <ul class="ev-list">
            ${P.points.map((p) => `<li class="ev-item"><span class="ev-check">✓</span><div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div></li>`).join('')}
          </ul>
        </div>
        <p style="text-align:center;margin-top:32px">${btn(P.cta, 'ghost')}</p>
      </div>`;
  };

  /* P0-1：真实案例主打卡（数据条 + 时间线 + 截图位；文案全在 content.js 的 cases[0]） */
  const caseFeature = (c) => `
    <article class="case-feature">
      <div>
        <span class="tag-real">${esc(c.tag.split('·')[0])}</span>
        <h3>${esc(c.title)}</h3>
        <p class="lead">${esc(c.desc)}</p>
        <div class="case-stats">
          ${c.stats.map((s) => `<div><span class="num">${esc(s.num)}<i> ${esc(s.unit)}</i></span><span class="lbl">${esc(s.lbl)}</span></div>`).join('')}
        </div>
        <ol class="case-timeline">
          ${c.timeline.map((t) => `<li><b>${esc(t.t)}</b><span>${esc(t.d)}</span></li>`).join('')}
        </ol>
        <p style="margin-top:24px;color:var(--accent2);font-size:var(--fs-1)">▸ ${esc(c.result)}</p>
      </div>
      <figure class="case-proof">
        ${shotBox(c.shot)}
        ${shotCaption(c.shot.caption)}
      </figure>
    </article>`;
  const isRealCase = (c) => (c.tag || '').indexOf('真实案例') === 0;
  const renderRealCase = (el, withHead) => {
    const real = S.cases.find(isRealCase);
    if (!el || !real) return;
    el.innerHTML = `<div class="wrap">${withHead ? `<header class="case-head"><h2>${esc(real.tag.split('·')[0])}</h2></header>` : ''}${caseFeature(real)}</div>`;
  };

  const R = {
    home() {
      $('hero').innerHTML = `
        <div class="wrap">
          <h1>${esc(S.hero.title)}</h1>
          <p class="sub">${esc(S.hero.subtitle)}</p>
          <ul>${S.hero.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          <div>${btn(S.hero.ctaPrimary, 'primary')}${btn(S.hero.ctaSecondary, 'ghost')}</div>
        </div>`;
      /* P0-2：产品实证模块（#proof 挂载点） */
      renderProof();
      $('pains').innerHTML = `<div class="wrap"><h2 class="title">这些场景，你中了几个？</h2><p class="desc">数字员工先顶上来，人去做更重要的事。</p><div class="grid c4">${S.pains.map(card).join('')}</div></div>`;
      $('services').innerHTML = `<div class="wrap"><h2 class="title">我们提供什么</h2><p class="desc">从搭建到代运营，全生命周期管理。</p><div class="grid c2">${S.services.map(card).join('')}</div><p style="text-align:center;margin-top:24px"><a href="services.html">查看服务详情 →</a></p></div>`;
      /* P0-1：首页「真实案例」主打卡区块（#real-cases 挂载点） */
      renderRealCase($('real-cases'), true);
      $('process').innerHTML = `<div class="wrap"><h2 class="title">五步交付</h2><p class="desc">考核不过，不交付。</p><div class="steps">${S.process.map((p) => `<div class="step"><div class="no">${p.step}</div><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p></div>`).join('')}</div></div>`;
      $('expweek').innerHTML = `<div class="wrap"><div class="banner"><h2>${esc(S.expWeek.title)}</h2><p>${esc(S.expWeek.desc)}</p><div class="grid c3" style="margin-bottom:24px">${S.expWeek.points.map((p) => `<div class="card" style="text-align:center"><p>${esc(p)}</p></div>`).join('')}</div><a class="btn primary" href="${S.expWeek.cta.href}">${esc(S.expWeek.cta.label)}</a></div></div>`;
    },
    services() {
      $('services').innerHTML = `<div class="wrap"><h2 class="title">服务详情</h2><p class="desc">四类服务，可按需组合。</p><div class="grid c2">${S.services.map(card).join('')}</div></div>`;
      $('process').innerHTML = `<div class="wrap"><h2 class="title">交付流程</h2><p class="desc"></p><div class="steps">${S.process.map((p) => `<div class="step"><div class="no">${p.step}</div><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p></div>`).join('')}</div></div>`;
      $('pricing').innerHTML = `<div class="wrap"><h2 class="title">价格</h2><p class="desc">区间示意，正式报价以需求澄清后为准。</p><div class="grid c3">${S.pricing.map((p) => `<div class="card price"><h3>${esc(p.tier)}</h3><div class="amount">${esc(p.price)}</div><div class="period">${esc(p.period)}</div><p>${esc(p.desc)}</p><ul style="text-align:left">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><a class="btn primary" href="contact.html" style="margin-top:16px">${esc(p.cta)}</a></div>`).join('')}</div></div>`;
      $('faq').innerHTML = `<div class="wrap"><h2 class="title">常见问题</h2><p class="desc"></p>${S.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
    },
    team() {
      $('team').innerHTML = `<div class="wrap"><h2 class="title">我们的团队</h2><p class="desc">${esc(S.team.intro)}</p><div class="grid c3">${S.team.members.map((m) => `<div class="card"><h3>${esc(m.name)}</h3><p style="color:var(--accent2)">${esc(m.role)}</p><p style="margin-top:8px">${esc(m.duty)}</p><p style="margin-top:8px">${esc(m.output)}</p></div>`).join('')}</div></div>`;
    },
    cases() {
      const navLabel = (S.nav.find((n) => n.href === 'cases.html') || {}).label || '';
      const samples = S.cases.filter((c) => !isRealCase(c));
      $('cases').innerHTML = `<div class="wrap"><h2 class="title">${esc(navLabel)}</h2><p class="desc">${esc(S.casesPage.desc)}</p><div class="grid c3">${samples.map(card).join('')}</div></div>`;
      /* P0-1：真实案例主打卡（#real-case-list 挂载点） */
      renderRealCase($('real-case-list'), true);
    },
    contact() {
      $('contact').innerHTML = `<div class="wrap"><h2 class="title">${esc(S.contact.title)}</h2><p class="desc">${esc(S.contact.desc)}</p>
        <div class="contact-grid">
          <div class="card">${S.contact.channels.map((c) => `<div class="channel"><b>${esc(c.label)}</b><span>${esc(c.value)}</span></div>`).join('')}
            <p class="note">⚠ ${esc(S.contact.formNote)}</p></div>
          <form class="card demo" onsubmit="event.preventDefault();alert('演示站点：表单不实际提交。正式版将接入留资系统。');">
            <label>您的称呼</label><input placeholder="怎么称呼您">
            <label>公司 / 行业</label><input placeholder="如：某电商 / 教育">
            <label>想解决的岗位</label><input placeholder="如：客服、运营、设计">
            <label>需求描述</label><textarea rows="3" placeholder="简单说说您的场景"></textarea>
            <button class="btn primary" type="submit">提交需求（演示）</button>
          </form>
        </div></div>`;
    },
    /* P2-4：404 品牌兜底页（文案在 content.js notFound） */
    '404'() {
      $('nf').innerHTML = `<div class="wrap" style="text-align:center">
        <p style="font-size:var(--fs-6);font-weight:700;color:var(--accent)">404</p>
        <h1 style="font-size:var(--fs-4);margin:8px 0 16px">${esc(S.notFound.title)}</h1>
        <p style="color:var(--muted);margin-bottom:24px">${esc(S.notFound.desc)}</p>
        <a class="btn primary" href="index.html">${esc(S.notFound.homeLabel)}</a>
      </div>`;
    }
  };
  (R[page] || R.home)();
})();
