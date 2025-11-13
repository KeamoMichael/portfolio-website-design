// Framer-Style Scroll Animation Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initMarquee();
    initNavbarScroll();
    initSmoothScroll();
    initSectionReveal();
    initNavbarLogoSwitch();
    initApproachReveal();
    initFullScreenMenu();
    initHeroImageCarousel();
    updateTime();
    setInterval(updateTime, 1000);
});

// Enhanced Scroll Animations with Multiple Types
function initScrollAnimations() {
    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title, .about-title');
    sectionTitles.forEach(el => {
        fadeInObserver.observe(el);
    });
    
    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header, .section-label');
    sectionHeaders.forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });
    
    // Fade-in elements
    const fadeElements = document.querySelectorAll(
        '.about-content, .service-item, .journal-card'
    );
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });
    
    // Scale-in elements
    const scaleElements = document.querySelectorAll('.project-card');
    scaleElements.forEach(el => {
        el.classList.add('scale-in');
        fadeInObserver.observe(el);
    });
    
    // Slide-in left elements
    const slideLeftElements = document.querySelectorAll('.approach-number');
    slideLeftElements.forEach(el => {
        el.classList.add('slide-in-left');
        fadeInObserver.observe(el);
    });
    
    // Slide-in right elements
    const slideRightElements = document.querySelectorAll('.approach-content');
    slideRightElements.forEach(el => {
        el.classList.add('slide-in-right');
        fadeInObserver.observe(el);
    });
    
    // Client logos
    const clientLogos = document.querySelectorAll('.client-logo');
    clientLogos.forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });
}

// Section Reveal Animation
function initSectionReveal() {
    const sections = document.querySelectorAll('.projects, .services, .clients, .approach, .journal');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionObserver.observe(section);
    });
}

// Marquee Duplication for Infinite Scroll
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const originalContent = marqueeContent.innerHTML;
        marqueeContent.innerHTML = originalContent + originalContent;
    }
}

// Navbar Scroll Effect - Keep navbar always visible (sticky)
function initNavbarScroll() {
    // Navbar remains sticky and visible at all times
    // No hide/show behavior needed
}

// Navbar Logo Switch Based on Section
function initNavbarLogoSwitch() {
    const navbar = document.querySelector('.navbar');
    const logoDark = document.getElementById('logo-dark');
    const logoLight = document.getElementById('logo-light');
    const aboutSection = document.querySelector('.about');
    const heroSection = document.querySelector('.hero');
    
    if (!navbar || !logoDark || !logoLight || !aboutSection) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // About section is in view - switch to light logo
                logoDark.style.display = 'none';
                logoLight.style.display = 'block';
                navbar.classList.add('light-section');
            } else {
                // About section is not in view - handled by scroll event
                // This observer just handles logo switching
            }
        });
    }, observerOptions);
    
    // Observe the about section
    sectionObserver.observe(aboutSection);
    
    // Also check on scroll for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const aboutRect = aboutSection.getBoundingClientRect();
                const heroRect = heroSection.getBoundingClientRect();
                
                // Only modify navbar-page on home page (not work page)
                const isHomePage = !navbar.hasAttribute('data-navbar-page-permanent');
                
                // Check if About section is in view (when its top reaches 150px from viewport top)
                // This ensures navbar changes as we enter the About section
                if (aboutRect.top <= 150) {
                    // About section is in view - switch to light logo and add navbar-page style
                    logoDark.style.display = 'none';
                    logoLight.style.display = 'block';
                    navbar.classList.add('light-section');
                    // Add navbar-page style for home page only
                    if (isHomePage) {
                        navbar.classList.add('navbar-page');
                    }
                } else {
                    // Still in hero section - switch to dark logo and remove navbar-page style
                    logoDark.style.display = 'block';
                    logoLight.style.display = 'none';
                    navbar.classList.remove('light-section');
                    // Remove navbar-page style when back in hero (home page only)
                    if (isHomePage) {
                        navbar.classList.remove('navbar-page');
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Approach Section Scroll Reveal Animation
function initApproachReveal() {
    const approachSection = document.querySelector('.approach');
    const approachItems = document.querySelectorAll('.approach-item');
    
    if (!approachSection || approachItems.length === 0) return;
    
    let ticking = false;
    
    function updateApproachReveal() {
        const sectionRect = approachSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const viewportHeight = window.innerHeight;
        const sectionHeight = sectionRect.height;
        
        // Calculate scroll progress based on section position
        // Start revealing when section top reaches 100% of viewport (as soon as it enters)
        // Complete revealing when section bottom reaches 50% of viewport (well before next section)
        // Same timing applies when scrolling back up
        const revealStart = viewportHeight * 1.0;
        const revealEnd = viewportHeight * 0.5;
        
        // Calculate overall scroll progress (0 to 1)
        // This calculation works bidirectionally - naturally reverses when scrolling up
        let scrollProgress = 0;
        
        if (sectionTop <= revealStart && sectionBottom >= revealEnd) {
            // Section is in reveal zone - calculate progress
            // Works for both scrolling down (sectionTop decreases) and scrolling up (sectionTop increases)
            const totalRevealRange = revealStart - revealEnd + sectionHeight;
            const currentPosition = revealStart - sectionTop;
            scrollProgress = currentPosition / totalRevealRange;
        } else if (sectionBottom <= revealEnd) {
            // Section bottom has passed reveal end point - all items fully revealed
            // This happens when scrolling down past the section
            scrollProgress = 1;
        } else if (sectionTop > revealStart) {
            // Section hasn't entered reveal zone yet - all items light grey
            // This happens when scrolling up before the section enters viewport
            scrollProgress = 0;
        } else if (sectionTop < 0 && sectionBottom > revealEnd) {
            // Section top is above viewport but bottom is still in reveal zone
            // When scrolling up, items should start fading back
            // Calculate fade-back progress based on how far above viewport the section is
            const fadeBackStart = 0; // When section top is at top of viewport
            const fadeBackEnd = -sectionHeight; // When entire section is above viewport
            const fadeBackPosition = Math.abs(sectionTop);
            const fadeBackRange = Math.abs(fadeBackEnd - fadeBackStart);
            // Fade back from 1 (fully revealed) to 0 (light grey)
            scrollProgress = Math.max(0, 1 - (fadeBackPosition / fadeBackRange));
        }
        
        // Clamp between 0 and 1
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // Reveal each item progressively
        approachItems.forEach((item, index) => {
            // Each item occupies 1/4 of the scroll progress
            const itemStart = index / approachItems.length;
            const itemEnd = (index + 1) / approachItems.length;
            
            // Calculate individual item progress
            let itemProgress = 0;
            if (scrollProgress >= itemEnd) {
                itemProgress = 1; // Fully revealed
            } else if (scrollProgress > itemStart) {
                // Interpolate progress for this item
                itemProgress = (scrollProgress - itemStart) / (itemEnd - itemStart);
            }
            
            // Apply color transitions
            const titleOpacity = 0.2 + (itemProgress * 0.8); // 0.2 to 1.0
            const descOpacity = 0.3 + (itemProgress * 0.7); // 0.3 to 1.0
            
            const title = item.querySelector('.approach-title');
            const description = item.querySelector('.approach-description');
            
            if (title) {
                title.style.color = `rgba(0, 0, 0, ${titleOpacity})`;
            }
            
            if (description) {
                description.style.color = `rgba(0, 0, 0, ${descOpacity})`;
            }
            
            // Update revealed class
            if (itemProgress >= 0.99) {
                item.classList.add('revealed');
            } else {
                item.classList.remove('revealed');
            }
        });
        
        ticking = false;
    }
    
    // Use throttled scroll listener with requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateApproachReveal();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    updateApproachReveal();
    
    // Also update on resize
    window.addEventListener('resize', () => {
        updateApproachReveal();
    }, { passive: true });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update Time in Footer
function updateTime() {
    const timeElement = document.querySelector('.footer-time');
    if (timeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Enhanced Parallax Effect for Hero Section
let ticking = false;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    lastScrollY = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
});

// Easing function for smooth, gradual scaling (ease-out cubic)
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Easing function for smooth, gradual scaling (ease-in-out cubic)
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateParallax(scrollY) {
    const heroImage = document.querySelector('.hero-image');
    const heroImageImg = document.querySelector('.hero-bg-image.active');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroOverlay = document.querySelector('.hero-overlay');
    
    // Calculate scroll progress (0 to 1) based on viewport height
    const rawProgress = Math.min(scrollY / window.innerHeight, 1);
    
    // Apply easing for smoother, more gradual scaling
    const scrollProgress = easeOutCubic(rawProgress);
    
    if (heroImage && heroImageImg) {
        // Parallax movement and scale up effect
        if (scrollY < window.innerHeight) {
            // Move down with parallax (reduced for smoother effect)
            const translateY = scrollY * 0.3;
            
            // Scale up: increases from 1.0 to 1.15 (15% larger) with eased progression
            const imageScale = 1 + (scrollProgress * 0.15); // Scales from 1 to 1.15
            
            // Apply both translate and scale using transform3d for hardware acceleration
            heroImageImg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${imageScale})`;
        } else {
            // Reset when scrolled past hero section
            heroImageImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
        
        // Apply parallax to all images (not just active) for smooth transitions
        const allHeroImages = document.querySelectorAll('.hero-bg-image');
        allHeroImages.forEach(img => {
            if (scrollY < window.innerHeight) {
                const translateY = scrollY * 0.3;
                const imageScale = 1 + (scrollProgress * 0.15);
                img.style.transform = `translate3d(0, ${translateY}px, 0) scale(${imageScale})`;
            } else {
                img.style.transform = 'translate3d(0, 0, 0) scale(1)';
            }
        });
        
        if (heroContent && heroTitle) {
            // Move up: negative translateY increases as you scroll down
            const moveUp = scrollProgress * -100; // Moves up to -100px at bottom of hero
            
            // Scale up: slightly increases from 1 to 1.1
            const scale = 1 + (scrollProgress * 0.1); // Scales from 1 to 1.1
            
            // Apply transform using transform3d for hardware acceleration
            heroTitle.style.transform = `translate3d(0, ${moveUp}px, 0) scale(${scale})`;
        }
        
        // Update hero overlay gradient from black to white based on scroll
        if (heroOverlay) {
            if (scrollY < window.innerHeight) {
                // Interpolate between black and white based on scroll progress
                const blackOpacity = 0.7 * (1 - scrollProgress); // Decreases from 0.7 to 0
                const whiteOpacity = 0.9 * scrollProgress; // Increases from 0 to 0.9
                
                heroOverlay.style.background = `linear-gradient(to top, rgba(255, 255, 255, ${whiteOpacity}), rgba(0, 0, 0, ${blackOpacity}), transparent)`;
            } else {
                // Reset to black when scrolled past hero section
                heroOverlay.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)';
            }
        }
    } else if (heroOverlay) {
        // Reset overlay when scrolled past hero
        heroOverlay.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)';
    }
    
    // Update scroll progress
    updateScrollProgress();
}

// Scroll Progress Indicator
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    }
}

// Project cards - no tilt effect, just image zoom

// Enhanced Magnetic Effect for Buttons (Framer Style)
document.querySelectorAll('.menu-toggle, .text-link, .section-link').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height);
        
        if (distance < maxDistance) {
            const strength = (1 - distance / maxDistance) * 0.3;
            button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            button.style.transition = 'transform 0.1s ease-out';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
        button.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
});

// Smooth Page Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Cursor Effect (Optional - Premium Touch)
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.classList.add('cursor-follower');
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor follow
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor,
    .cursor-follower {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    }
    
    .custom-cursor {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        margin-left: -4px;
        margin-top: -4px;
    }
    
    .cursor-follower {
        width: 40px;
        height: 40px;
        border: 1px solid white;
        border-radius: 50%;
        margin-left: -20px;
        margin-top: -20px;
    }
    
    @media (max-width: 968px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

// Hover effects for interactive elements
document.querySelectorAll('a, button, .project-card, .journal-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursorFollower.style.transform += ' scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace('scale(1.5)', 'scale(1)');
        cursorFollower.style.transform = cursorFollower.style.transform.replace('scale(1.5)', 'scale(1)');
    });
});

// Full Screen Menu Toggle
function initFullScreenMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (!menuToggle || !menuOverlay || !menuClose) return;
    
    // Check if mobile (menu takes full screen)
    const isMobile = () => window.innerWidth <= 968;
    
    // Open menu
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        menuOverlay.classList.add('active');
        // Only prevent scrolling on mobile
        if (isMobile()) {
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close menu
    menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    });
    
    // Close menu when clicking outside (on overlay background) - only on mobile
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay && isMobile()) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Hero Image Carousel
function initHeroImageCarousel() {
    const heroImages = document.querySelectorAll('.hero-bg-image');
    const heroProjectItems = document.querySelectorAll('.hero-project-item');
    if (heroImages.length === 0) return;
    
    let currentIndex = 0;
    
    function switchImage() {
        // Remove active class from current image and project info
        heroImages[currentIndex].classList.remove('active');
        if (heroProjectItems[currentIndex]) {
            heroProjectItems[currentIndex].classList.remove('active');
        }
        
        // Move to next image
        currentIndex = (currentIndex + 1) % heroImages.length;
        
        // Add active class to next image and project info
        heroImages[currentIndex].classList.add('active');
        if (heroProjectItems[currentIndex]) {
            heroProjectItems[currentIndex].classList.add('active');
        }
    }
    
    // Start the carousel - switch every 3 seconds
    setInterval(switchImage, 3000);
}

// Back to Top functionality
document.querySelector('.back-to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Studio Basee - Website Loaded Successfully ✨');

