/* ═══════════════════════════════════════════════
   SKYDEV — main.js
   Módulos: Nav · Counter · Swiper · AOS · Form
═══════════════════════════════════════════════ */

// ── 1. AOS (Animate On Scroll) ───────────────────
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
})

// ── 2. Nav: scroll class + burger + smooth close ─
const nav     = document.getElementById('nav')
const burger  = document.querySelector('.nav__burger')
const mobileMenu = document.getElementById('mobile-menu')
const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta')

// Scroll → añade clase .scrolled
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20)
}, { passive: true })

// Burger toggle
burger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open')
  burger.classList.toggle('is-open', isOpen)
  burger.setAttribute('aria-expanded', String(isOpen))
  mobileMenu.setAttribute('aria-hidden', String(!isOpen))
})

// Cerrar menu al click en link
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open')
    burger.classList.remove('is-open')
    burger.setAttribute('aria-expanded', 'false')
    mobileMenu.setAttribute('aria-hidden', 'true')
  })
})

// ── 3. Contador animado en Hero ──────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10)
  const duration = 1800
  const start = performance.now()

  function step(now) {
    const elapsed  = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Easing ease-out-cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(step)
    else el.textContent = target
  }
  requestAnimationFrame(step)
}

// Lanzar cuando el hero entra en viewport
const counters = document.querySelectorAll('.counter')
if (counters.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  counters.forEach(c => observer.observe(c))
}

// ── 4. Swiper (Testimonios) ──────────────────────
new Swiper('.testimonials__swiper', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  speed: 600,
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 1,
  spaceBetween: 24,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  a11y: {
    prevSlideMessage: 'Testimonio anterior',
    nextSlideMessage: 'Testimonio siguiente',
  },
})

// ── 5. Form — validación + submit ────────────────
const form        = document.getElementById('contact-form')
const formSuccess = document.getElementById('form-success')

function validateField(input) {
  const errorEl = input.parentElement.querySelector('.form-error')
  let message = ''

  if (input.required && !input.value.trim()) {
    message = 'Este campo es obligatorio.'
  } else if (input.type === 'email' && input.value.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(input.value.trim())) {
      message = 'Ingresá un email válido.'
    }
  }

  if (errorEl) errorEl.textContent = message
  input.classList.toggle('error', Boolean(message))
  return !message
}

// Validar al salir del campo (blur)
form?.querySelectorAll('[required]').forEach(input => {
  input.addEventListener('blur', () => validateField(input))
  input.addEventListener('input',  () => {
    if (input.classList.contains('error')) validateField(input)
  })
})

// Submit
form?.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Validar todos los campos requeridos
  const requiredFields = form.querySelectorAll('[required]')
  let allValid = true
  requiredFields.forEach(input => {
    if (!validateField(input)) allValid = false
  })
  if (!allValid) return

  // Simular envío (reemplazá con fetch a tu backend / Formspree / EmailJS)
  const submitBtn = form.querySelector('[type="submit"]')
  const btnText   = submitBtn.querySelector('.btn-text')
  submitBtn.disabled = true
  btnText.textContent = 'Enviando...'

  await new Promise(resolve => setTimeout(resolve, 1200)) // Simula latencia

  // Mostrar éxito
  form.reset()
  submitBtn.disabled = false
  btnText.textContent = 'Enviar mensaje'
  formSuccess.hidden = false
  formSuccess.focus()

  // Ocultar mensaje luego de 6 seg
  setTimeout(() => { formSuccess.hidden = true }, 6000)

  /* ── Para conectar con Formspree, reemplazá el bloque de arriba por:
  try {
    const res = await fetch('https://formspree.io/f/TU_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
    if (res.ok) {
      form.reset()
      formSuccess.hidden = false
      setTimeout(() => { formSuccess.hidden = true }, 6000)
    } else {
      alert('Error al enviar. Intentá de nuevo.')
    }
  } catch {
    alert('Error de red. Intentá de nuevo.')
  } finally {
    submitBtn.disabled = false
    btnText.textContent = 'Enviar mensaje'
  }
  ── */
})

// ── 6. Active nav link on scroll ─────────────────
const sections = document.querySelectorAll('section[id], header[id]')
const navLinks  = document.querySelectorAll('.nav__link')

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id')
      navLinks.forEach(link => {
        const href = link.getAttribute('href')
        link.classList.toggle('active', href === `#${id}`)
      })
    }
  })
}, { rootMargin: '-40% 0px -55% 0px' })

sections.forEach(s => sectionObserver.observe(s))
