// DESTACK SOLUTIONS - Main JavaScript

// Load header and footer components
async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Get current page name
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    try {
        // Load header
        if (headerPlaceholder) {
            const headerResponse = await fetch('components/header.html');
            const headerHtml = await headerResponse.text();
            headerPlaceholder.innerHTML = headerHtml;
            
            // Set active nav link based on current page
            const navLinks = headerPlaceholder.querySelectorAll('.nav-link[data-page]');
            navLinks.forEach(link => {
                if (link.dataset.page === currentPage) {
                    link.classList.add('active');
                }
            });
        }
        
        // Load footer
        if (footerPlaceholder) {
            const footerResponse = await fetch('components/footer.html');
            const footerHtml = await footerResponse.text();
            footerPlaceholder.innerHTML = footerHtml;
        }
        
        // Initialize other functions after components are loaded
        initAfterComponents();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function initAfterComponents() {
    initMobileMenu();
    initHeaderScroll();
    initPageTransitions();
}

document.addEventListener('DOMContentLoaded', function () {
    // Add page transition class
    document.body.classList.add('page-transition');

    // Load components first, then initialize everything else
    loadComponents();
    
    initScrollReveal();
    initStatsCounter();
    initSmoothScroll();
    initContactForm();
});

// Page Transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        // Only apply to internal links
        if (link.hostname === window.location.hostname || link.hostname === '') {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    e.preventDefault();
                    document.body.classList.remove('page-transition');
                    document.body.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    const reveal = () => {
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    reveal();
    window.addEventListener('scroll', reveal);
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const num = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const timer = setInterval(() => {
                    current += num / 50;
                    if (current >= num) { current = num; clearInterval(timer); }
                    entry.target.textContent = Math.floor(current) + suffix;
                }, 40);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
            btn.textContent = 'Send Message';
            btn.disabled = false;
        }, 1500);
    });
}

// Add reveal class to elements
document.querySelectorAll('.service-card, .feature-item, .testimonial-card, .value-card, .stat-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
});
