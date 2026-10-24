/**
 * ==========================================================================
 * MUHAMMAD IMRAN RASHEED - PORTFOLIO INTERACTION ENGINE
 * Premium Gold & Obsidian Interactive Experience
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbar();
  initScrollSpy();
  initEmailCopy();
  initStatCounters();
  initSkillsFilter();
  initContactForm();
  initCardTilt();
  initBackToTop();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. GOLDEN DUST & CONSTELLATION CANVAS
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.opacity = Math.random() * 0.6 + 0.2;
      // Gold hue variations: 42 to 48 (Golden Yellow)
      this.hue = Math.floor(Math.random() * 8) + 42;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // React subtly to mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 1.2;
          const directionY = (dy / distance) * force * 1.2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let particles = [];
  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let alpha = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  createParticles();
  animate();

  // Pause when tab is not visible to conserve battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* --------------------------------------------------------------------------
   2. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile drawer toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. SCROLLSPY (ACTIVE NAV HIGHLIGHT)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. COPY EMAIL TO CLIPBOARD & TOAST
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const emailButtons = document.querySelectorAll('[data-copy-email]');
  const myEmail = 'imranrasheedt@gmail.com';

  emailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(myEmail).then(() => {
        showToast('Email address copied to clipboard: ' + myEmail);
        
        // Visual indicator on clicked element
        const originalText = btn.innerHTML;
        const copyBadge = btn.querySelector('.copy-badge');
        if (copyBadge) {
          const oldBadge = copyBadge.innerText;
          copyBadge.innerText = 'COPIED!';
          setTimeout(() => {
            copyBadge.innerText = oldBadge;
          }, 2200);
        } else {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2200);
        }
      }).catch(err => {
        console.error('Copy failed', err);
        showToast('Could not copy automatically. Email: ' + myEmail);
      });
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-gold-check">✧</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3800);
}

/* --------------------------------------------------------------------------
   5. ANIMATED STATS COUNTER
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.innerText = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

/* --------------------------------------------------------------------------
   6. SKILLS CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM SUBMISSION & CLIENT-SIDE VALIDATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const statusMsg = document.getElementById('formStatusMsg');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const service = form.elements['service'].value;
    const message = form.elements['message'].value.trim();

    if (!name || !email || !message) {
      displayFormStatus('Please complete all required fields.', 'error');
      return;
    }

    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      displayFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending with high-end feedback
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4AF37"></path>
      </svg>
      Processing...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      displayFormStatus(`Thank you, ${name}! Your inquiry has been received. I will respond to ${email} promptly.`, 'success');
      showToast('Message sent! Muhammad Imran Rasheed will get back to you shortly.');

      // Also create a prefilled mailto link option
      const mailtoSubject = encodeURIComponent(`Inquiry from Portfolio: ${service}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:imranrasheedt@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Reset form
      form.reset();

      // Offer direct mailto backup
      setTimeout(() => {
        const mailPrompt = document.createElement('div');
        mailPrompt.style.marginTop = '12px';
        mailPrompt.style.fontSize = '0.85rem';
        mailPrompt.style.color = '#8F8FA3';
        mailPrompt.innerHTML = `Prefer your email client? <a href="${mailtoLink}" style="color: var(--gold-light); text-decoration: underline;">Click here to open in mail app</a>.`;
        statusMsg.appendChild(mailPrompt);
      }, 500);

    }, 1200);
  });

  function displayFormStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.innerHTML = text;
    statusMsg.style.display = 'block';
  }
}

/* --------------------------------------------------------------------------
   8. CARD 3D TILT EFFECT
   -------------------------------------------------------------------------- */
function initCardTilt() {
  // Only apply tilt on non-touch devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.service-card, .project-card, .portrait-frame');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. BACK TO TOP SMOOTH SCROLL
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   10. GALLERY LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const caption = item.getAttribute('data-caption') || '';
      modalImg.src = fullSrc;
      modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
    }, 200);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Inline animation keyframe helper
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(dynamicStyle);
