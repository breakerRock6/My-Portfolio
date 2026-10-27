// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const topBtn = document.getElementById('top');
  const links = [...menu.querySelectorAll('a')];

  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Mobile menu ---
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // --- Scroll effects: nav border and back-to-top button ---
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    topBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Active navigation highlighting ---
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && spy.observe(s));

  // --- Scroll reveal ---
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  // --- Contact form validation ---
  const form = document.getElementById('form');
  const status = document.getElementById('status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Enter a subject.',
    message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
  };
  const check = field => {
    const result = rules[field.name](field.value);
    const ok = result === true;
    field.classList.toggle('invalid', !ok);
    field.setAttribute('aria-invalid', !ok);
    document.getElementById('e-' + field.name).textContent = ok ? '' : result;
    return ok;
  };
  Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', e => check(e.target)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(n => check(form.elements[n])).every(Boolean);
    if (!valid) { status.textContent = ''; return; }
    // No backend: open the visitor's email app with the message filled in.
    // For real delivery, replace this with a fetch() to Formspree or Netlify Forms.
    const f = form.elements;
    const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`;
    window.location.href = `mailto:balajipazhanivel6@gmail.com?subject=${encodeURIComponent(f.subject.value)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app. Send the email to complete your message.';
    form.reset();
  });
});
