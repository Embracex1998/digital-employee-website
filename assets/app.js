/* 共享渲染器：所有页面内容由 content.js 驱动 */
(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || 'home';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* 导航 + 页脚 */
  $('nav').innerHTML = `
    <div class="wrap nav">
      <a class="brand" href="index.html">${esc(S.meta.brand)}<span> · </span>${esc(S.meta.slogan.split('？')[0].replace('招人难、人力贵', '数字员工'))}</a>
      <ul>${S.nav.map((n) => `<li><a href="${n.href}" class="${n.href === page + '.html' || (page === 'home' && n.href === 'index.html') ? 'active' : ''}">${esc(n.label)}</a></li>`).join('')}</ul>
    </div>`;
  $('footer').innerHTML = `
    <div class="wrap">
      <p>${esc(S.meta.icp)}</p>
      <p style="margin-top:6px">${esc(S.footer.note)}</p>
    </div>`;

  const btn = (b, cls) => `<a class="btn ${cls}" href="${b.href}">${esc(b.label)}</a>`;
  const card = (c) => `<div class="card">${c.icon ? `<div class="icon">${c.icon}</div>` : ''}${c.tag ? `<span class="tag">${esc(c.tag)}</span>` : ''}<h3>${esc(c.title || c.name)}</h3><p>${esc(c.desc || c.role || '')}</p>${c.points ? `<ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${c.result ? `<p style="margin-top:10px;color:var(--accent2)">▸ ${esc(c.result)}</p>` : ''}</div>`;

  const R = {
    home() {
      $('hero').innerHTML = `
        <div class="wrap">
          <h1>${esc(S.hero.title)}</h1>
          <p class="sub">${esc(S.hero.subtitle)}</p>
          <ul>${S.hero.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          <div>${btn(S.hero.ctaPrimary, 'primary')}${btn(S.hero.ctaSecondary, 'ghost')}</div>
        </div>`;
      $('pains').innerHTML = `<div class="wrap"><h2 class="title">这些场景，你中了几个？</h2><p class="desc">数字员工先顶上来，人去做更重要的事。</p><div class="grid c4">${S.pains.map(card).join('')}</div></div>`;
      $('services').innerHTML = `<div class="wrap"><h2 class="title">我们提供什么</h2><p class="desc">从搭建到代运营，全生命周期管理。</p><div class="grid c2">${S.services.map(card).join('')}</div><p style="text-align:center;margin-top:24px"><a href="services.html">查看服务详情 →</a></p></div>`;
      $('process').innerHTML = `<div class="wrap"><h2 class="title">五步交付</h2><p class="desc">考核不过，不交付。</p><div class="steps">${S.process.map((p) => `<div class="step"><div class="no">${p.step}</div><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p></div>`).join('')}</div></div>`;
      $('expweek').innerHTML = `<div class="wrap"><div class="banner"><h2>${esc(S.expWeek.title)}</h2><p>${esc(S.expWeek.desc)}</p><div class="grid c3" style="margin-bottom:20px">${S.expWeek.points.map((p) => `<div class="card" style="text-align:center"><p>${esc(p)}</p></div>`).join('')}</div><a class="btn primary" href="${S.expWeek.cta.href}">${esc(S.expWeek.cta.label)}</a></div></div>`;
    },
    services() {
      $('services').innerHTML = `<div class="wrap"><h2 class="title">服务详情</h2><p class="desc">四类服务，可按需组合。</p><div class="grid c2">${S.services.map(card).join('')}</div></div>`;
      $('process').innerHTML = `<div class="wrap"><h2 class="title">交付流程</h2><p class="desc"></p><div class="steps">${S.process.map((p) => `<div class="step"><div class="no">${p.step}</div><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p></div>`).join('')}</div></div>`;
      $('pricing').innerHTML = `<div class="wrap"><h2 class="title">价格</h2><p class="desc">区间示意，正式报价以需求澄清后为准。</p><div class="grid c3">${S.pricing.map((p) => `<div class="card price"><h3>${esc(p.tier)}</h3><div class="amount">${esc(p.price)}</div><div class="period">${esc(p.period)}</div><p>${esc(p.desc)}</p><ul style="text-align:left">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><a class="btn primary" href="contact.html" style="margin-top:14px">${esc(p.cta)}</a></div>`).join('')}</div></div>`;
      $('faq').innerHTML = `<div class="wrap"><h2 class="title">常见问题</h2><p class="desc"></p>${S.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
    },
    team() {
      $('team').innerHTML = `<div class="wrap"><h2 class="title">我们的团队</h2><p class="desc">${esc(S.team.intro)}</p><div class="grid c3">${S.team.members.map((m) => `<div class="card" style="text-align:center"><h3>${esc(m.name)}</h3><p style="color:var(--accent2)">${esc(m.dept)} · ${esc(m.role)}</p></div>`).join('')}</div></div>`;
    },
    cases() {
      $('cases').innerHTML = `<div class="wrap"><h2 class="title">客户案例</h2><p class="desc">以下为示例案例，用于展示交付形态；正式合作前可提供可核实的真实案例。</p><div class="grid c3">${S.cases.map(card).join('')}</div></div>`;
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
    }
  };
  (R[page] || R.home)();
})();
