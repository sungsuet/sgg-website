// Seongsu Engineering homepage — small progressive enhancements.
// The page works without this file; it adds the mobile menu, current-section
// highlighting in the nav, and the contact-form handler.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.menu-toggle');
  const nav = header.querySelector('.site-nav');
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];

  // — mobile menu —
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? '메뉴 닫기' : '메뉴 열기';
  };
  toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // — current section in the nav —
  const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
  const sections = [...document.querySelectorAll('main > .page')];
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    const current = sections.find((s) => visible.has(s));
    navLinks.forEach((a) => a.removeAttribute('aria-current'));
    const link = current && byId.get(current.id);
    if (link) link.setAttribute('aria-current', 'true');
  }, { rootMargin: '-80px 0px -55% 0px' });
  sections.forEach((s) => observer.observe(s));

  // — contact form —
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');

  // "제안서 보내기" jumps to the form with the partnership topic preselected.
  document.querySelectorAll('[data-inquiry]').forEach((link) => {
    link.addEventListener('click', () => {
      const radio = form.querySelector(`input[name="topic"][value="${link.dataset.inquiry}"]`);
      if (radio) radio.checked = true;
    });
  });

  // Without a backend the form opens the visitor's mail app, addressed to
  // data-mailto and pre-filled with the inquiry. Set data-endpoint to a URL
  // that accepts a JSON POST (a form service or your own API) to send it
  // directly from the page instead.
  const composeMail = (to) => {
    const data = new FormData(form);
    const topic = form.querySelector('input[name="topic"]:checked')?.parentElement.textContent.trim() || '기타';
    const subject = `[홈페이지 문의] ${topic} — ${data.get('company') || data.get('name')}`;
    const body = [
      `회사명: ${data.get('company')}`,
      `담당자명: ${data.get('name')}`,
      `이메일: ${data.get('email')}`,
      `연락처: ${data.get('tel')}`,
      `문의 분야: ${topic}`,
      '',
      data.get('message'),
    ].join('\n');
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = `메일 앱에서 내용을 확인한 뒤 보내 주세요. 메일 앱이 열리지 않으면 다음 주소로 직접 보내 주세요: ${to}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstInvalid = form.querySelector(':invalid');
    if (firstInvalid) {
      status.textContent = '필수 항목(담당자명, 이메일, 문의 내용)을 확인해 주세요.';
      firstInvalid.focus();
      return;
    }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      composeMail(form.dataset.mailto);
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = '보내는 중…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      status.textContent = '문의가 접수되었습니다. 담당 엔지니어가 회신드리겠습니다.';
    } catch {
      status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      button.disabled = false;
    }
  });
})();
