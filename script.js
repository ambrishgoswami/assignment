// Mobile menu
const menu = document.getElementById('menu');
document.getElementById('burger').addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up stats
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const b = e.target, end = +b.dataset.n, t0 = performance.now();
  const tick = t => {
    const p = Math.min((t - t0) / 1500, 1);
    b.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  cio.unobserve(b);
}), { threshold: .6 });
document.querySelectorAll('[data-n]').forEach(el => cio.observe(el));

// Active nav link on scroll
const links = [...menu.querySelectorAll('a:not(.b2b)')];
addEventListener('scroll', () => {
  let cur = links[0];
  links.forEach(l => {
    const s = document.querySelector(l.getAttribute('href'));
    if (s && s.getBoundingClientRect().top < 140) cur = l;
  });
  links.forEach(l => l.classList.toggle('active', l === cur));
});

// Form (front-end validation only)
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, msg = document.getElementById('msg');
  if (!f.name.value.trim() || !/^[0-9+\s-]{8,}$/.test(f.phone.value) || !/\S+@\S+\.\S+/.test(f.email.value)) {
    msg.textContent = 'Please fill name, a valid phone and email.'; msg.style.color = '#fecaca'; return;
  }
  msg.style.color = '#bbf7d0';
  msg.textContent = 'Thank you! We will contact you shortly.';
  f.reset();
});

document.getElementById('yr').textContent = new Date().getFullYear();

// Dropdowns (Destinations mega menu, Services)
const dds = document.querySelectorAll('.dd');
const closeAll = except => dds.forEach(d => { if (d !== except) { d.classList.remove('open'); d.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); } });
dds.forEach(d => {
  const btn = d.querySelector('.dd-btn');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    closeAll(d);
    const open = d.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  d.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { closeAll(); menu.classList.remove('open'); }));
});
document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeAll(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

// Profile evaluation modal
const modal = document.getElementById('evalModal'), eMsg = document.getElementById('evalMsg');
const openEval = e => { e.preventDefault(); closeAll(); menu.classList.remove('open'); modal.hidden = false; document.body.style.overflow = 'hidden'; modal.querySelector('input').focus(); };
const closeEval = () => { modal.hidden = true; document.body.style.overflow = ''; };
document.querySelectorAll('[data-eval]').forEach(a => a.addEventListener('click', openEval));
document.getElementById('evalClose').addEventListener('click', closeEval);
modal.addEventListener('click', e => { if (e.target === modal) closeEval(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeEval(); });
document.getElementById('evalForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f.name.value.trim() || !/^[0-9+\s-]{8,}$/.test(f.phone.value) || !/\S+@\S+\.\S+/.test(f.email.value) || !f.gpa.value.trim()) {
    eMsg.style.color = '#b91c1c'; eMsg.textContent = 'Please fill all fields marked * with valid details.'; return;
  }
  eMsg.style.color = '#047857'; eMsg.textContent = 'Thank you! Our advisor will share your profile evaluation shortly.';
  f.reset(); setTimeout(() => { closeEval(); eMsg.textContent = ''; }, 2000);
});
