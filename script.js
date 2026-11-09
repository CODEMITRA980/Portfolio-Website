/* ==========================================================================
   DEVELOPER PORTFOLIO - MAIN JAVASCRIPT LOGIC (script.js)
   Portfolio for: Amit Rai - Java Developer & Microservices Specialist
   Features: Canvas Particle Mesh, Dynamic Typing, Scroll Reveal, Form Validation,
             Project Filter & Detailed Case Study Modals, CV Print/Preview, Theme Switcher
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DYNAMIC BACKGROUND CANVAS PARTICLE MESH
  // ------------------------------------------------------------------------
  const initBackgroundCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 65);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with faint lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 - dist / 1300})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  };

  initBackgroundCanvas();

  // ------------------------------------------------------------------------
  // 2. HERO SECTION TYPEWRITER ANIMATION
  // ------------------------------------------------------------------------
  const initTypewriter = () => {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
      'Spring Boot & Microservices Specialist',
      'High-Throughput RESTful API Architect',
      'Event-Driven Systems with Apache Kafka',
      'Distributed Caching with Redis',
      'Spring Security & JWT Authentication',
      'AWS Cloud & CI/CD Pipeline Automation'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const typeSpeed = 70;
    const deleteSpeed = 35;
    const pauseTime = 1900;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let timeoutDelay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIdx === currentPhrase.length) {
        timeoutDelay = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        timeoutDelay = 350;
      }

      setTimeout(typeLoop, timeoutDelay);
    };

    typeLoop();
  };

  initTypewriter();

  // ------------------------------------------------------------------------
  // 3. STICKY NAVBAR & MOBILE MENU DRAWER
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. ACCENT THEME COLOR PICKER
  // ------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-accent-toggle');
  const themes = ['theme-cyan', 'theme-purple', 'theme-emerald'];
  let currentThemeIdx = 0;

  // Restore saved theme preference
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    currentThemeIdx = themes.indexOf(savedTheme) !== -1 ? themes.indexOf(savedTheme) : 0;
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const selectedTheme = themes[currentThemeIdx];

      document.body.className = selectedTheme === 'theme-cyan' ? '' : selectedTheme;
      localStorage.setItem('portfolio_theme', selectedTheme === 'theme-cyan' ? '' : selectedTheme);

      showToast(`Accent Glow Theme Switched!`, 'success');
    });
  }

  // ------------------------------------------------------------------------
  // 5. INTERSECTION OBSERVER FOR ACTIVE NAV LINKS & REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  // Automated Scroll Reveal Animation Observer
  const revealTargets = document.querySelectorAll(
    '.section-header, .about-card, .stat-card, .proficiency-card, .skill-card, .featured-project-card, .project-card, .timeline-item, .info-card, .contact-form-card'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal-scroll');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => revealObserver.observe(el));

  // Skill Bar Progress Animation on Scroll
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.querySelectorAll('.progress-bar-fill').forEach(bar => {
              const targetWidth = bar.getAttribute('data-target');
              bar.style.width = targetWidth;
            });
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    skillsObserver.observe(skillsSection);
  }

  // ------------------------------------------------------------------------
  // 6. SKILL & PROJECT CATEGORY FILTERING LOGIC
  // ------------------------------------------------------------------------
  const setupFiltering = (containerId, cardSelector) => {
    const filterContainer = document.getElementById(containerId);
    if (!filterContainer) return;

    const filterBtns = filterContainer.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll(cardSelector);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || (category && category.includes(filterValue))) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  };

  setupFiltering('skill-filters', '.skill-card');

  // ------------------------------------------------------------------------
  // 7. PROJECT DETAILS MODAL CONTROLLER & COMPREHENSIVE CASE STUDIES
  // ------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');

  const projectData = {
    'luminacare': {
      title: 'LuminaCare — Doctor Appointment Booking Platform',
      image: 'assets/images/project-luminacare.png',
      meta: 'Duration: 3.2 Years | Architecture: Microservices, DDD, Event-Driven | Agile (Scrum)',
      tags: ['Spring Boot', 'Microservices', 'Spring Security & JWT', 'Hibernate / JPA', 'Redis', 'Kafka', 'Stripe SDK', 'Twilio', 'Eureka', 'Zipkin', 'AWS Cloud'],
      description: 'LuminaCare is a comprehensive, production-grade Doctor Appointment Booking ecosystem engineered using Domain-Driven Design (DDD) and Event-Driven Microservices. Built with Spring Boot, the platform streamlines the end-to-end patient consultation journey from doctor discovery and dynamic slot scheduling to secure payment processing and instant multi-channel alert notifications.',
      modules: [
        {
          name: 'Patient Service',
          desc: 'Implemented secure patient authentication, registration, and password reset functionality using Spring Security and JWT token-based authentication. Configured role-based access control (RBAC) for Admin and Patient roles. Managed session persistence and token validation to enhance security. Utilized SLF4J and Logback for structured logging.'
        },
        {
          name: 'Doctor Service',
          desc: 'Developed CRUD operations for doctor profiles, including specialties, experience, clinics, and availability schedules. Integrated Hibernate/JPA for ORM mapping and optimized database queries for peak throughput.'
        },
        {
          name: 'Appointment Service',
          desc: 'Designed real-time appointment booking modules with availability validation and confirmation number generation. Implemented dynamic scheduling, rescheduling, and cancellation functionalities. Used Redis caching for low-latency access to available slots and doctor schedules.'
        },
        {
          name: 'Booking & Notification Service',
          desc: 'Built a high-performance booking engine with real-time appointment confirmation. Integrated Apache Kafka event streaming for asynchronous event delivery. Implemented real-time alerts via Twilio SMS and email APIs for appointment reminders and status updates.'
        },
        {
          name: 'Payment Service',
          desc: 'Integrated Stripe SDK (both sandbox and production environments) for secure consultation fee transactions, payment verification, and webhook handling.'
        },
        {
          name: 'Search & Filter Service',
          desc: 'Implemented doctor search features by name, specialization, location, and clinic. Added filter options for consultation fees, ratings, availability, and online/offline consultation using Spring Data JPA specifications.'
        },
        {
          name: 'Infrastructure & Integration',
          desc: 'Deployed Spring Cloud API Gateway for centralized routing, auth filtering, and rate-limiting. Configured Eureka Server for service discovery and automatic registration. Implemented Zipkin distributed tracing for latency monitoring, Spring Boot Admin for real-time health metrics, and Kafka event streaming for system decoupling.'
        }
      ],
      techStackString: 'Core Java, Java 8/17, Spring Boot, Spring MVC, Spring Security, JWT, Hibernate, JPA, Feign Client, Stripe SDK, API Gateway, Eureka Server, Zipkin, Spring Boot Admin, Redis, MySQL, Kafka, Twilio, Git, GitHub, Maven, SLF4J, Logback, RESTful APIs, Microservices, Spring Data JPA, Agile, Swagger, IntelliJ IDEA.'
    },

    'luminacare-infra': {
      title: 'LuminaCare — Microservices Infrastructure & Integration',
      image: 'assets/images/project-luminacare.png',
      meta: 'Microservices Mesh | Distributed Tracing | Eureka Discovery | Gateway Routing',
      tags: ['Spring Cloud Gateway', 'Eureka Server', 'Zipkin', 'Spring Boot Admin', 'Apache Kafka', 'AWS EC2 / RDS'],
      description: 'The core distributed infrastructure backbone powering LuminaCare. Features centralized API Gateway routing with rate limiting, service discovery via Netflix Eureka, distributed latency tracing with Zipkin, automated health diagnostics via Spring Boot Admin Server, and asynchronous event decoupling via Apache Kafka.',
      modules: [
        {
          name: 'Centralized API Gateway',
          desc: 'Spring Cloud Gateway handles all incoming client requests, manages authentication token validation, CORS configuration, request routing, and rate limiting.'
        },
        {
          name: 'Eureka Service Discovery',
          desc: 'Automated service registration and heartbeats, enabling dynamic load balancing and fault-tolerant inter-service communication via Feign Client.'
        },
        {
          name: 'Distributed Tracing with Zipkin',
          desc: 'End-to-end request tracing across microservice boundaries with trace and span IDs to rapidly pinpoint latency bottlenecks.'
        },
        {
          name: 'Event-Driven Decoupling with Kafka',
          desc: 'Asynchronous event streaming for booking confirmations, SMS triggers, and audit logging, eliminating synchronous blocking between services.'
        }
      ],
      techStackString: 'Spring Cloud Gateway, Eureka Server, OpenFeign, Zipkin, Spring Boot Admin, Docker, AWS EC2, CloudWatch, Kafka.'
    },

    'payment-engine': {
      title: 'Event-Driven Payment & Notification Engine',
      image: 'assets/images/project1.png',
      meta: 'Kafka Event Streaming | Stripe SDK | Twilio Alerts | Idempotent Processing',
      tags: ['Java 17', 'Spring Boot', 'Stripe SDK', 'Apache Kafka', 'Twilio API', 'MySQL'],
      description: 'An enterprise-grade payment and notification microservice designed to process high-volume consultation fee transactions with zero duplicate payments and sub-second notification dispatches.',
      modules: [
        {
          name: 'Stripe Payment Processing',
          desc: 'Complete integration with Stripe Payment Intents and webhook listeners for seamless checkout, automated refunds, and payment receipts.'
        },
        {
          name: 'Kafka Event Producers & Consumers',
          desc: 'Publishes payment confirmation events to Kafka topics consumed by notification and reporting microservices with fault-tolerant retry policies.'
        },
        {
          name: 'Multi-Channel Alert Dispatcher',
          desc: 'Automated Twilio SMS and email dispatch system with templated notifications and delivery confirmation logging.'
        }
      ],
      techStackString: 'Java 17, Spring Boot, Stripe SDK, Apache Kafka, Twilio API, Spring Data JPA, MySQL, Maven.'
    },

    'observability-hub': {
      title: 'Distributed Observability & API Gateway Hub',
      image: 'assets/images/project3.png',
      meta: 'Spring Cloud Gateway | Zipkin Tracing | Spring Boot Admin Metrics',
      tags: ['Spring Cloud Gateway', 'Eureka', 'Zipkin', 'Spring Boot Admin', 'Docker', 'AWS'],
      description: 'A complete telemetry and distributed observability solution built to monitor microservice cluster health, route traffic, log error traces, and visualize service metrics in real time.',
      modules: [
        {
          name: 'Traffic Routing & Rate Limiting',
          desc: 'Global gateway filter checking rate limits per client IP, preventing denial-of-service surges and validating JWT tokens.'
        },
        {
          name: 'Live Health Telemetry',
          desc: 'Spring Boot Admin server displaying CPU usage, JVM heap memory, thread pool saturation, and actuator health metrics.'
        },
        {
          name: 'Distributed Trace Visualization',
          desc: 'Zipkin trace collector aggregating spans across microservices to isolate slow database queries and network hops.'
        }
      ],
      techStackString: 'Spring Boot 3, Spring Cloud Gateway, Eureka Server, Zipkin, Spring Boot Admin, Docker, AWS Cloud.'
    },

    'redis-jpa-service': {
      title: 'High-Performance JPA & Redis Query Service',
      image: 'assets/images/project2.png',
      meta: 'Spring Data JPA | Hibernate | Redis Caching | SQL Query Optimization',
      tags: ['Spring Data JPA', 'Hibernate ORM', 'Redis Cache', 'MySQL', 'Lombok'],
      description: 'A specialized database optimization and caching engine engineered for high-concurrency read queries, multi-criteria doctor filtering, and rapid slot availability lookups.',
      modules: [
        {
          name: 'Dynamic Query Specifications',
          desc: 'Utilized Spring Data JPA CriteriaBuilder & Specifications to build flexible, type-safe multi-filter search queries with index optimization.'
        },
        {
          name: 'Redis Cache Layer',
          desc: 'In-memory caching for doctor profiles and active booking calendars with intelligent write-through cache eviction upon slot reservation.'
        },
        {
          name: 'Stored Procedures & Query Tuning',
          desc: 'Tuned MySQL stored procedures and execution plans to decrease query latency by over 70% under peak load.'
        }
      ],
      techStackString: 'Java 17, Spring Boot, Spring Data JPA, Hibernate, Redis, MySQL, Lombok, Swagger UI.'
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
    if (!data || !projectModal || !modalBody) return;

    let modulesHtml = '';
    if (data.modules && data.modules.length > 0) {
      modulesHtml = `
        <h4 class="modal-sec-heading"><i class="fa-solid fa-cubes"></i> Architecture & Module Breakdown:</h4>
        <div class="modal-modules-list">
          ${data.modules.map(m => `
            <div class="modal-module-card">
              <h5><i class="fa-solid fa-circle-check"></i> ${m.name}</h5>
              <p>${m.desc}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-project-img" />
      <div class="modal-meta-tag">${data.meta || ''}</div>
      <h3 class="modal-project-title">${data.title}</h3>
      <div class="modal-project-tags">
        ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <p class="modal-project-desc">${data.description}</p>
      
      ${modulesHtml}

      <div class="modal-tech-box">
        <strong><i class="fa-solid fa-code"></i> Complete Tech Stack:</strong>
        <p>${data.techStackString || data.tags.join(', ')}</p>
      </div>

      <div class="modal-project-actions">
        <a href="#contact" class="btn btn-primary" onclick="document.getElementById('modal-close').click();">
          <i class="fa-solid fa-paper-plane"></i> Discuss This Project with Amit
        </a>
        <a href="mailto:amitwork9044@gmail.com?subject=Inquiry%20regarding%20${encodeURIComponent(data.title)}" class="btn btn-secondary">
          <i class="fa-solid fa-envelope"></i> Email Inquiries
        </a>
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      if (pId) openProjectModal(pId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

  // ------------------------------------------------------------------------
  // 8. CV / RESUME MODAL & PRINT/DOWNLOAD CONTROLLER
  // ------------------------------------------------------------------------
  const cvModal = document.getElementById('cv-modal');
  const openCvBtn = document.getElementById('open-cv-btn');
  const navResumeBtn = document.getElementById('nav-resume-btn');
  const footerResumeBtn = document.getElementById('footer-resume-btn');
  const closeCvBtn = document.getElementById('cv-modal-close');
  const closeCvTrigger = document.getElementById('close-cv-trigger');
  const cvOverlay = document.getElementById('cv-modal-overlay');
  const downloadCvBtn = document.getElementById('download-cv-trigger');

  const openCvModal = (e) => {
    if (e) e.preventDefault();
    if (!cvModal) return;
    cvModal.classList.add('active');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCvModal = () => {
    if (!cvModal) return;
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openCvBtn) openCvBtn.addEventListener('click', openCvModal);
  if (navResumeBtn) navResumeBtn.addEventListener('click', openCvModal);
  if (footerResumeBtn) footerResumeBtn.addEventListener('click', openCvModal);
  if (closeCvBtn) closeCvBtn.addEventListener('click', closeCvModal);
  if (closeCvTrigger) closeCvTrigger.addEventListener('click', closeCvModal);
  if (cvOverlay) cvOverlay.addEventListener('click', closeCvModal);

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Opening print/save dialog for Amit Rai Resume PDF...', 'success');
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }

  // ------------------------------------------------------------------------
  // 9. BACK TO TOP BUTTON WITH CIRCLE PROGRESS
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring__circle');

  if (progressCircle && backToTopBtn) {
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    const setProgress = (percent) => {
      const offset = circumference - (percent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    };

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(scrollPercent);

      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 10. CONTACT FORM VALIDATION & INTERACTIVE TOAST
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-count');
  const submitBtn = document.getElementById('submit-btn');

  // Character Counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      charCounter.textContent = messageInput.value.length;
    });
  }

  const showError = (inputEl, errorElId, message) => {
    const group = inputEl.closest('.form-group');
    const errorEl = document.getElementById(errorElId);
    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  };

  const clearError = (inputEl, errorElId) => {
    const group = inputEl.closest('.form-group');
    const errorEl = document.getElementById(errorElId);
    if (group) group.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  };

  [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      const errorId = `${inp.id.replace('contact-', '')}-error`;
      clearError(inp, errorId);
    });
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'name-error', 'Please enter your name.');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'name-error', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError(nameInput, 'name-error');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        showError(emailInput, 'email-error', 'Please enter your email address.');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, 'email-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        showError(subjectInput, 'subject-error', 'Please enter a message subject.');
        isValid = false;
      } else {
        clearError(subjectInput, 'subject-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'message-error', 'Please enter your message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'message-error', 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearError(messageInput, 'message-error');
      }

      if (!isValid) {
        showToast('Please correct the highlighted errors before submitting.', 'error');
        return;
      }

      // Simulate sending with loading spinner
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
      submitBtn.disabled = true;

      setTimeout(() => {
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;

        showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent to Amit Rai.`, 'success');
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0';
      }, 1200);
    });
  }

  // ------------------------------------------------------------------------
  // 11. TOAST NOTIFICATION UTILITY
  // ------------------------------------------------------------------------
  window.showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4000);
  };

  // Keyboard shortcut to close modals (ESC)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeCvModal();
    }
  });
});
