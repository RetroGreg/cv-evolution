'use strict';

// Configuration
const CONFIG = {
    THEME_KEY: 'cv-theme',
    TYPEWRITER_SPEED: 100,
    TYPEWRITER_DELETE_SPEED: 50,
    TYPEWRITER_PAUSE: 2000,
    SCROLL_THRESHOLD: 0.1,
    DEBOUNCE_DELAY: 150,
    NAVBAR_OFFSET: 80
};

const TYPEWRITER_TEXTS = [
    'Développeur Web Full Stack',
    'Passionné par les nouvelles technologies',
    'Prêt pour de nouveaux défis',
    'Créatif et orienté solutions',
    'En quête permanente d\'apprentissage'
];

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const smoothScrollTo = (target, offset = CONFIG.NAVBAR_OFFSET) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || getSystemTheme();
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.watchSystemTheme();
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem(CONFIG.THEME_KEY);
        } catch (e) {
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem(CONFIG.THEME_KEY, theme);
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.storeTheme(theme);
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
            
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }
    }
    
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            };
            
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
            }
        }
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }
    
    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && this.navbar && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Scroll events (throttled)
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
            this.setActiveLink();
        }, 100));
        
        // Resize events (debounced)
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        }, CONFIG.DEBOUNCE_DELAY));
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (!this.navMenu || !this.hamburger) return;
        
        this.navMenu.classList.add('active');
        this.hamburger.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        
        document.body.style.overflow = 'hidden';
        
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    closeMenu() {
        if (!this.navMenu || !this.hamburger) return;
        
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
        
        document.body.style.overflow = '';
    }
    
    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                smoothScrollTo(target);
                this.closeMenu();
                
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        }
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        const scrollY = window.pageYOffset;
        
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let activeSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= CONFIG.NAVBAR_OFFSET && rect.bottom >= CONFIG.NAVBAR_OFFSET) {
                activeSection = section.id;
            }
        });
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, texts = TYPEWRITER_TEXTS) {
        this.element = element;
        this.texts = texts;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isRunning = false;
        this.timeoutId = null;
    }
    
    start() {
        if (this.isRunning || !this.element) return;
        this.isRunning = true;
        this.type();
    }
    
    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
    
    type() {
        if (!this.isRunning || !this.element) return;
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.timeoutId = setTimeout(() => this.type(), 500);
            } else {
                this.timeoutId = setTimeout(() => this.type(), CONFIG.TYPEWRITER_DELETE_SPEED);
            }
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                this.timeoutId = setTimeout(() => this.type(), CONFIG.TYPEWRITER_PAUSE);
            } else {
                this.timeoutId = setTimeout(() => this.type(), CONFIG.TYPEWRITER_SPEED);
            }
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
            this.observeElements();
        }
    }
    
    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
    }
    
    observeElements() {
        const elements = document.querySelectorAll(`
            .section-header,
            .about-text,
            .about-stats,
            .tech-section,
            .project-card,
            .timeline-item,
            .education-card,
            .extra-card,
            .contact-content
        `);
        
        elements.forEach((el, index) => {
            el.style.setProperty('--animation-delay', `${index * 0.1}s`);
            if (this.observer) {
                this.observer.observe(el);
            }
        });
    }
    
    animateElement(element) {
        const animations = ['fade-in-up', 'fade-in-left', 'fade-in-right'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        element.classList.add('visible', randomAnimation);
        
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }
}

// Main Application
class ModernCV {
    constructor() {
        this.components = {};
        this.isReady = false;
        this.init();
    }
    
    async init() {
        try {
            await this.initializeComponents();
            this.bindGlobalEvents();
            this.isReady = true;
            
            window.dispatchEvent(new CustomEvent('cvready'));
            
        } catch (error) {
            console.error('Error initializing CV:', error);
        }
    }
    
    async initializeComponents() {
        // Theme Manager
        this.components.theme = new ThemeManager();
        
        // Navigation Manager
        this.components.navigation = new NavigationManager();
        
        // Typewriter Effect
        const typewriterElement = document.getElementById('typewriter');
        if (typewriterElement) {
            this.components.typewriter = new TypewriterEffect(typewriterElement);
            
            // Start typewriter when visible
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && this.components.typewriter) {
                            this.components.typewriter.start();
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(typewriterElement);
            } else {
                // Fallback for older browsers
                this.components.typewriter.start();
            }
        }
        
        // Scroll Animations
        this.components.scrollAnimations = new ScrollAnimations();
    }
    
    bindGlobalEvents() {
        // Back to top functionality
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                smoothScrollTo('#top', 0);
            });
        }
        
        // External links
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            
            if (!link.querySelector('.sr-only')) {
                const indicator = document.createElement('span');
                indicator.className = 'sr-only';
                indicator.textContent = ' (ouvre dans un nouvel onglet)';
                link.appendChild(indicator);
            }
        });
        
        // Global error handler
        window.addEventListener('error', (e) => {
            // Silent error handling for production
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            e.preventDefault();
        });
    }
    
    // Public API
    toggleTheme() {
        if (this.components.theme) {
            this.components.theme.toggle();
        }
    }
    
    scrollToSection(sectionId) {
        smoothScrollTo(`#${sectionId}`);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modernCV = new ModernCV();
    });
} else {
    window.modernCV = new ModernCV();
}