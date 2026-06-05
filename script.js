/* ========================================
   AURORA BEATS - JavaScript
   ======================================== */

// ========================================
// SMOOTH SCROLL & NAVBAR
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSchedule();
    initializeScrollAnimations();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }

                // Smooth scroll
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Sticky navbar background (dark theme)
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 10) {
            navbar.style.background = 'rgba(8,8,8,0.96)';
            navbar.style.boxShadow = '0 6px 30px rgba(0,0,0,0.6)';
        } else {
            navbar.style.background = 'rgba(11,11,11,0.85)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.6)';
        }
    });
}

// ========================================
// SCHEDULE FUNCTIONALITY
// ========================================

function initializeSchedule() {
    const scheduleContainer = document.getElementById('scheduleContainer');

    try {
        const script = document.getElementById('scheduleData');
        const scheduleData = script ? JSON.parse(script.textContent || '[]') : [];

        if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
            scheduleContainer.innerHTML = '<p class="empty-schedule">Aktuell sind keine Sendungen geplant.</p>';
            return;
        }

        const displayedSchedule = scheduleData.slice(0, 8);
        scheduleContainer.innerHTML = '';

        displayedSchedule.forEach((item, index) => {
            const card = createScheduleCard(item, index);
            scheduleContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading schedule:', error);
        scheduleContainer.innerHTML = '<p class="empty-schedule">Fehler beim Laden der Sendetermine.</p>';
    }
}

function createScheduleCard(item, index) {
    const card = document.createElement('div');
    card.className = 'schedule-card';
    card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;

    let discordLink = '';
    if (item.discord && item.discord.trim() !== '') {
        discordLink = `<a href="${item.discord}" target="_blank" class="schedule-discord">Discord Server</a>`;
    }

    card.innerHTML = `
        <div class="schedule-header">
            <span class="schedule-date">${item.datum}</span>
            <span class="schedule-time">${item.zeit}</span>
        </div>
        <h3 class="schedule-title">${item.titel}</h3>
        ${discordLink ? `<div class="schedule-footer">${discordLink}</div>` : ''}
    `;

    return card;
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll to top smoothly
document.addEventListener('keydown', (e) => {
    // Scroll to top on Home key
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});