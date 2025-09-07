"use strict";

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const heroEmail = document.getElementById('heroEmail');
const navbar = document.querySelector('.navbar');

// Mobile Navigation Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for internal navigation links only
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const body = `Name: ${name}
Email: ${email}

${message}`;
        const mailto = `mailto:aleemazhar14@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        showNotification('Opening your email client...', 'success');
        contactForm.reset();
    });
}

if (heroEmail) {
    heroEmail.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'aleemazhar14@gmail.com';
        navigator.clipboard.writeText(email)
            .then(() => showNotification('Email address copied to clipboard!', 'success'))
            .catch(() => {});
        window.location.href = `mailto:${email}`;
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#6366f1';
    }
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Particle background effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
    `;
    
    hero.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particleContainer.appendChild(particle);
    }
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Resume dropdown functionality
function initResumeDropdown() {
    // Navigation resume dropdown
    const navResumeBtn = document.getElementById('navResumeBtn');
    const navResumeOptions = document.getElementById('navResumeOptions');
    
    if (navResumeBtn && navResumeOptions) {
        // Toggle dropdown on button click
        navResumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navResumeOptions.classList.toggle('active');
            navResumeBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!navResumeBtn.contains(e.target) && !navResumeOptions.contains(e.target)) {
                navResumeOptions.classList.remove('active');
                navResumeBtn.classList.remove('active');
            }
        });
        
        // Handle resume option clicks
        const navResumeOptionLinks = navResumeOptions.querySelectorAll('.nav-resume-option');
        navResumeOptionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close dropdown after selection
                navResumeOptions.classList.remove('active');
                navResumeBtn.classList.remove('active');
                
                // Optional: Show a brief notification
                const resumeType = link.querySelector('span').textContent;
                showNotification(`Downloading ${resumeType}...`, 'info');
            });
        });
    }

    // Hero resume dropdown
    const heroResumeBtn = document.getElementById('heroResumeBtn');
    const heroResumeOptions = document.getElementById('heroResumeOptions');
    
    if (heroResumeBtn && heroResumeOptions) {
        // Toggle dropdown on button click
        heroResumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            heroResumeOptions.classList.toggle('active');
            heroResumeBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!heroResumeBtn.contains(e.target) && !heroResumeOptions.contains(e.target)) {
                heroResumeOptions.classList.remove('active');
                heroResumeBtn.classList.remove('active');
            }
        });
        
        // Handle resume option clicks
        const heroResumeOptionLinks = heroResumeOptions.querySelectorAll('.hero-resume-option');
        heroResumeOptionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close dropdown after selection
                heroResumeOptions.classList.remove('active');
                heroResumeBtn.classList.remove('active');
                
                // Optional: Show a brief notification
                const resumeType = link.querySelector('span').textContent;
                showNotification(`Downloading ${resumeType}...`, 'info');
            });
        });
    }
}

function initModernFeatures() {
    // Theme removed

    // Navigation progress bar + scroll indicator (throttled with rAF)
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    const scrollTop = window.pageYOffset;
                    const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.width = scrollPercent + '%';
                }
                const scrollIndicator = document.querySelector('.modern-scroll');
                if (scrollIndicator) {
                    const pct = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
                    scrollIndicator.style.opacity = pct > 10 ? '0' : '1';
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const grid = document.querySelector('.projects-grid');
            if (grid) grid.style.minHeight = grid.offsetHeight + 'px';

            projectCards.forEach(card => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                if (match) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    requestAnimationFrame(() => {
                        card.style.animation = 'fadeInUp 0.35s ease forwards';
                        card.style.opacity = '1';
                    });
                } else {
                    card.style.animation = '';
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.display = 'none'; }, 150);
                }
            });

            setTimeout(() => { if (grid) grid.style.minHeight = ''; }, 300);
        });
    });

    // Animated counters
    function animateSingleCounter(counter) {
        if (!counter || counter.getAttribute('data-animated') === 'true') return;
        const target = parseInt(counter.getAttribute('data-count'));
        if (isNaN(target)) return;
        const duration = 1200;
        const increment = Math.max(1, Math.ceil(target / (duration / 16)));
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.textContent = Math.floor(current) + suffix;
        }, 16);
        counter.setAttribute('data-animated', 'true');
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(animateSingleCounter);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation
                if (entry.target.classList.contains('hero-stats')) animateCounters();
                if (entry.target.classList.contains('stat-number') && entry.target.getAttribute('data-count')) {
                    animateSingleCounter(entry.target);
                }
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skill-progress')) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = width + '%';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.stat-number[data-count], .skill-progress, .hero-stats, .stat-item').forEach(el => {
        observer.observe(el);
    });

    // Fallback: trigger counters shortly after load in case observer doesn't fire at top
    setTimeout(() => {
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) animateCounters();
        document.querySelectorAll('.stat-item').forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }, 600);

    // Note: scroll indicator handled in onScroll()

    // Modern button hover effects
    document.querySelectorAll('.modern-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced project card interactions
    document.querySelectorAll('.modern-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero background
    // Lightweight parallax using rAF-throttled scroll
    let parallaxTick = false;
    function parallaxOnScroll() {
        if (!parallaxTick) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroParticles = document.querySelector('.hero-particles');
                const heroGradient = document.querySelector('.hero-gradient');
                if (heroParticles) heroParticles.style.transform = `translateY(${scrolled * 0.3}px)`;
                if (heroGradient) heroGradient.style.transform = `translateY(${scrolled * 0.15}px)`;
                parallaxTick = false;
            });
            parallaxTick = true;
        }
    }
    window.addEventListener('scroll', parallaxOnScroll, { passive: true });

    // Typing animation for hero text
    function initTypingAnimation() {
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            typingText.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        typingText.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    initTypingAnimation();
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    animateSkillBars();
    initParallax();
    createParticles();
    initResumeDropdown();
    initModernFeatures();
    initMobileMenu();
    initMobileOptimizations();

    // Theme removed

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-title .name');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add scroll-triggered animations for stats
    const stats = document.querySelectorAll('.stat-number');
    // Remove old number animation in favor of consistent counter
    if (stats.length) {
        stats.forEach(stat => {
            if (stat.getAttribute('data-count')) return; // counters handled elsewhere
            // fallback: keep original text
        });
    }
});

// Number animation function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        element.textContent = current + (element.textContent.includes('+') ? '+' : '') + 
                             (element.textContent.includes('%') ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
}

// Initialize reveal animation
document.addEventListener('DOMContentLoaded', revealOnScroll);

// Add loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && hamburger && navMenu) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;
            
            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            const targetSection = sections[targetIndex];
            const offsetTop = targetSection.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Enhanced mobile touch interactions
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchEndX = 0;
let isScrolling = false;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
    touchStartX = e.changedTouches[0].screenX;
    isScrolling = false;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isScrolling) {
        const touchY = e.changedTouches[0].screenY;
        const touchX = e.changedTouches[0].screenX;
        const diffY = Math.abs(touchY - touchStartY);
        const diffX = Math.abs(touchX - touchStartX);
        
        // Determine if this is a vertical or horizontal scroll
        if (diffY > diffX) {
            isScrolling = true;
        }
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    touchEndX = e.changedTouches[0].screenX;
    
    if (isScrolling) {
        handleSwipe();
    }
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;
    
    // Only handle vertical swipes
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > swipeThreshold) {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;
            
            if (diffY > 0) { // Swipe up
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else { // Swipe down
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            const targetSection = sections[targetIndex];
            const offsetTop = targetSection.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Mobile menu improvements
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Prevent body scroll when menu is open
        hamburger.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}

// Mobile performance optimizations
function initMobileOptimizations() {
    // Reduce animations on mobile for better performance
    if (window.innerWidth <= 768) {
        // Disable some heavy animations on mobile
        const style = document.createElement('style');
        style.textContent = `
            .floating-icon {
                animation: none !important;
            }
            .hero-particles {
                animation: none !important;
            }
            .glitch-text {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize scroll performance
    let ticking = false;
    function updateScrollPosition() {
        // Add any scroll-based optimizations here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true });
}
