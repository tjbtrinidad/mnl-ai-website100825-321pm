/**
 * MNL-AI Premium Website JavaScript - Complete Version
 * Built by Tristan Trinidad
 */

// ==========================================================================
// Counter Animation (Your existing code + improvements)
// ==========================================================================

const updatedCounterTargets = {
  clients: 20,
  years: 2,
  satisfaction: 100
};

function setupCounterAnimations() {
  const trustNumbers = document.querySelectorAll('.trust-number, .stat-number');
  
  if (trustNumbers.length === 0) return;

  let hasAnimated = false;

  function animateCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    trustNumbers.forEach(function(number) {
      const finalText = number.textContent.trim();
      
      let numValue;
      if (finalText.includes('20') || finalText.includes('Happy') || finalText.includes('Client')) {
        numValue = updatedCounterTargets.clients;
      } else if (finalText.includes('2') || finalText.includes('Years') || finalText.includes('Experience')) {
        numValue = updatedCounterTargets.years;
      } else if (finalText.includes('100') || finalText.includes('Satisfaction')) {
        numValue = updatedCounterTargets.satisfaction;
      } else {
        numValue = parseInt(finalText.replace(/[^\d]/g, ''));
      }
      
      if (isNaN(numValue)) return;
      
      const isPercentage = finalText.includes('%');
      const isPlus = finalText.includes('+');
      const isCurrency = finalText.includes('₱');
      const isK = finalText.toLowerCase().includes('k');
      
      let current = 0;
      const duration = 2000;
      const startTime = Date.now();

      function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = numValue * easeOutQuart;
        
        let displayValue = Math.floor(current);
        let displayText = displayValue.toString();
        
        if (isCurrency && isK) {
          displayText = '₱' + displayValue + 'k';
        } else if (isCurrency) {
          displayText = '₱' + displayValue;
        } else if (isPercentage) {
          displayText = displayValue + '%';
        } else if (isPlus) {
          displayText = displayValue + '+';
        } else if (isK) {
          displayText = displayValue + 'k';
        }
        
        number.textContent = displayText;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (numValue === updatedCounterTargets.clients) {
            number.textContent = '20+';
          } else if (numValue === updatedCounterTargets.years) {
            number.textContent = '2+';
          } else if (numValue === updatedCounterTargets.satisfaction) {
            number.textContent = '100%';
          } else {
            number.textContent = finalText;
          }
        }
      }

      updateCounter();
    });
  }

  const firstTrustElement = document.querySelector('.trust-indicators, .about-stats');
  
  if (firstTrustElement && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setTimeout(animateCounters, 500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(firstTrustElement);
  } else {
    setTimeout(animateCounters, 1000);
  }
}

// ==========================================================================
// Mobile Navigation
// ==========================================================================

function setupMobileNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!mobileToggle || !navMenu) return;

  // Toggle mobile menu
  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking nav links
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ==========================================================================
// Theme Toggle
// ==========================================================================

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  if (!themeToggle) return;

  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update icon based on current theme
  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add switching animation
    themeToggle.classList.add('switching');
    
    setTimeout(function() {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      themeToggle.classList.remove('switching');
    }, 150);
  });
}

// ==========================================================================
// Scroll Animations (Reveal on Scroll)
// ==========================================================================

function setupScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if (revealElements.length === 0) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    revealElements.forEach(function(el) {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}

// ==========================================================================
// Floating CTA Button
// ==========================================================================

function setupFloatingCTA() {
  const floatingCTA = document.getElementById('floating-cta');
  
  if (!floatingCTA) return;

  let scrollTimeout;

  function handleScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Show after scrolling 50% of viewport height
    if (scrollY > viewportHeight * 0.5) {
      floatingCTA.classList.add('visible');
    } else {
      floatingCTA.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 10);
  });
}

// ==========================================================================
// Navbar Scroll Effect
// ==========================================================================

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  
  if (!navbar) return;

  let scrollTimeout;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleNavbarScroll, 10);
  });
}

// ==========================================================================
// Contact Form Handler
// ==========================================================================

function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOk = document.getElementById('modal-ok');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Disable submit button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
    }
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success modal
        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        
        // Reset form
        contactForm.reset();
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send My Request</span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4.167 10h11.666m0 0L12.5 6.667M15.833 10L12.5 13.333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
    }
  });

  // Modal close handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalOk) {
    modalOk.addEventListener('click', closeModal);
  }
  
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// ==========================================================================
// Portfolio Filter (if needed)
// ==========================================================================

function setupPortfolioFilter() {
  const filterChips = document.querySelectorAll('.pf-chip');
  const portfolioCards = document.querySelectorAll('.pf-card');
  
  if (filterChips.length === 0) return;

  filterChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active chip
      filterChips.forEach(function(c) {
        c.classList.remove('is-active');
      });
      this.classList.add('is-active');
      
      // Filter cards
      portfolioCards.forEach(function(card) {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// Loading Screen
// ==========================================================================

function setupLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  if (!loadingScreen) return;

  // Hide loading screen after page loads
  window.addEventListener('load', function() {
    setTimeout(function() {
      loadingScreen.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 500);
  });
}

// ==========================================================================
// Smooth Scrolling for Anchor Links
// ==========================================================================

function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================================================
// Initialize Everything
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 MNL-AI Website initialized');
  
  // Initialize all features
  setupLoadingScreen();
  setupMobileNavigation();
  setupThemeToggle();
  setupScrollAnimations();
  setupFloatingCTA();
  setupNavbarScroll();
  setupContactForm();
  setupPortfolioFilter();
  setupSmoothScrolling();
  setupCounterAnimations();
  
  // Remove loading class from body
  document.body.classList.remove('loading');
});

// ==========================================================================
// Error Handling
// ==========================================================================

window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
});

// Handle uncaught promise rejections
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
});