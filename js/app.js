/**
 * ==========================================
 * WEDDING INVITATION - COMPLETE JAVASCRIPT
 * Niranjan & Suzata - 26th Falgun, 2082
 * ==========================================
 */

// ========== GLOBAL VARIABLES ==========
let mantraAudio = null;
let guestData = null;
let autoScrollInterval = null;
let isAutoScrolling = false;
let userHasScrolled = false;

// ========== LOAD GUEST DATA FROM URL ==========
async function loadGuestData() {
    try {
        // Get guest ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const guestId = urlParams.get('guest') || 'default';
        
        console.log('Loading guest:', guestId);
        
        // Fetch guests.json
        const response = await fetch('js/guests.json');
        const data = await response.json();
        
        // Get specific guest or default
        guestData = data.guests[guestId] || {
            name: 'Honored Guest',
            title: 'Mr./Mrs.',
            relationship: 'guest',
            relationship_nepali: 'हाम्रो आदरणीय अतिथि',
            message: 'We are delighted to invite you to our wedding celebration. Your presence will make our day even more special.'
        };
        
        console.log('Guest data loaded:', guestData);
        
        // Update DOM with guest data
        updateGuestInfo();
        
    } catch (error) {
        console.error('Error loading guest data:', error);
        // Use default guest
        guestData = {
            name: 'Honored Guest',
            title: 'Mr./Mrs.',
            relationship: 'guest',
            relationship_nepali: 'हाम्रो आदरणीय अतिथि',
            message: 'We are delighted to invite you to our wedding celebration. Your presence will make our day even more special.'
        };
        updateGuestInfo();
    }
}

// ========== UPDATE GUEST INFORMATION ==========
function updateGuestInfo() {
    // Envelope
    const envelopeName = document.getElementById('envelope-name');
    if (envelopeName) {
        envelopeName.textContent = `${guestData.title} ${guestData.name}`;
    }
    
    // Greeting page
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) {
        guestNameEl.textContent = guestData.name;
    }
    
    const guestRelationship = document.getElementById('guest-relationship');
    if (guestRelationship) {
        guestRelationship.textContent = guestData.relationship_nepali;
    }
    
    const guestMessage = document.getElementById('guest-message');
    if (guestMessage) {
        guestMessage.textContent = guestData.message;
    }
}

// ========== OPEN INVITATION ==========
// ========== OPEN INVITATION ==========
function openInvitation() {
    const envelope = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-invitation');
    const loading = document.getElementById('loading');

    // Start audio
    mantraAudio = document.getElementById('ganeshMantra');
    if (mantraAudio) {
        mantraAudio.play().catch(err => console.log('Audio autoplay prevented:', err));
    }

    // Animate envelope out
    envelope.style.transform = 'translateY(-100%)';
    envelope.style.opacity = '0';

    setTimeout(() => {
        envelope.style.display = 'none';
        mainContent.classList.remove('hidden-content');
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            setTimeout(() => { AOS.refresh(); }, 300);
        }
        
        // Initialize Particles
        initParticles();
        
        // ✅ START FIREWORKS (1 second after opening)
        setTimeout(() => {
            triggerFireworks();
        }, 1000);
        
        // ✅ START FLOATING PETALS
        setTimeout(() => {
            createFloatingPetals();
        }, 1500);
        
        // ✅ START SPARKLE CURSOR
        setTimeout(() => {
            createSparkleTrail();
        }, 2000);
        
        // Start auto-scroll after 3 seconds
        setTimeout(() => {
            startSlowAutoScroll();
        }, 3000);
    }, 600);

    // Hide loading
    setTimeout(() => {
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => { loading.style.display = 'none'; }, 500);
        }
    }, 2500);
}

// ========== PARTICLES INITIALIZATION ==========
function initParticles() {
    if (typeof particlesJS !== 'undefined' && !window.particlesInitialized) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 100 },
                color: { value: '#FFD700' },
                shape: { type: 'circle' },
                opacity: { 
                    value: 0.6,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1 }
                },
                size: { 
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1 }
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'top',
                    random: true,
                    out_mode: 'out'
                }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.3 } },
                    push: { particles_nb: 4 }
                }
            }
        });
        window.particlesInitialized = true;
        console.log('✅ Particles initialized');
    }
}

// ========== SLOW CONTINUOUS AUTO-SCROLL ==========
function startSlowAutoScroll() {
    console.log('🔄 Slow auto-scroll started');
    
    const AUTO_SCROLL_SPEED = 1; // pixels per frame (lower = slower)
    const SCROLL_DELAY = 30; // milliseconds between scrolls (higher = slower)
    
    let lastUserInteraction = Date.now();
    const IDLE_TIME_BEFORE_SCROLL = 3000; // 3 seconds of no user activity
    
    // Detect user scroll/touch
    let scrollTimeout;
    function onUserInteraction() {
        lastUserInteraction = Date.now();
        userHasScrolled = true;
        
        // Stop auto-scroll temporarily
        if (isAutoScrolling) {
            stopAutoScroll();
        }
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Resume auto-scroll after 3 seconds of inactivity
        scrollTimeout = setTimeout(() => {
            if (Date.now() - lastUserInteraction >= IDLE_TIME_BEFORE_SCROLL) {
                startAutoScrolling();
            }
        }, IDLE_TIME_BEFORE_SCROLL);
    }
    
    // Listen for user interactions
    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('wheel', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('touchmove', onUserInteraction, { passive: true });
    window.addEventListener('keydown', (e) => {
        // Detect arrow keys, page up/down, space
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
            onUserInteraction();
        }
    });
    
    // Start auto-scrolling
    function startAutoScrolling() {
        if (isAutoScrolling) return;
        
        isAutoScrolling = true;
        console.log('▶️ Auto-scroll resumed');
        
        autoScrollInterval = setInterval(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
            // Check if reached bottom
            if (currentScroll >= maxScroll - 10) {
                // Smoothly scroll back to top
                console.log('🔄 Reached bottom, scrolling to top');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Pause for a moment at top
                stopAutoScroll();
                setTimeout(() => {
                    startAutoScrolling();
                }, 2000);
                
            } else {
                // Continue scrolling down slowly
                window.scrollBy({
                    top: AUTO_SCROLL_SPEED,
                    behavior: 'auto' // Use 'auto' for smoother continuous scroll
                });
            }
        }, SCROLL_DELAY);
    }
    
    function stopAutoScroll() {
        if (!isAutoScrolling) return;
        
        isAutoScrolling = false;
        clearInterval(autoScrollInterval);
        console.log('⏸️ Auto-scroll paused');
    }
    
    // Start auto-scrolling immediately
    startAutoScrolling();
}

// ========== MANUAL SCROLL INDICATOR ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Wedding Invitation Loaded');
    
    // Load guest data
    loadGuestData();
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const greetingSection = document.getElementById('greeting-section');
            if (greetingSection) {
                greetingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Generate calendar dates
    generateCalendar();
    
    // Generate hanging lanterns
    generateLanterns();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
        console.log('✅ AOS initialized');
    }
});

// ========== GENERATE CALENDAR ==========
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    // Add empty cells for days before 1st (Friday)
    for (let i = 0; i < 5; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-date';
        calendarGrid.appendChild(emptyDiv);
    }
    
    // Generate dates 1-30
    for (let i = 1; i <= 30; i++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.setAttribute('data-aos', 'fade-in');
        dateDiv.setAttribute('data-aos-delay', (50 * i).toString());
        
        if (i === 26) {
            dateDiv.classList.add('highlighted-heart');
            dateDiv.innerHTML = `
                <span class="heart-icon">❤️</span>
                <span class="date-number">${i}</span>
            `;
        } else {
            dateDiv.textContent = i;
        }
        
        calendarGrid.appendChild(dateDiv);
    }
    
    console.log('✅ Calendar generated');
}

// ========== GENERATE LANTERNS ==========
function generateLanterns() {
    const container = document.getElementById('hanging-decorations');
    if (!container) return;
    
    for (let i = 0; i < 5; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.setAttribute('data-aos', 'fade-down');
        lantern.setAttribute('data-aos-delay', (200 * (i + 1)).toString());
        container.appendChild(lantern);
    }
    
    console.log('✅ Lanterns generated');
}

// ========== COUNTDOWN TIMER ==========
const weddingDate = new Date('2025-03-10 11:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    } else {
        // Wedding day passed
        const daysEl = document.getElementById('days');
        if (daysEl && daysEl.textContent !== '00') {
            console.log('🎉 Wedding Day!');
        }
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ========== PARALLAX EFFECT ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.mandala-bg, .ganesh-glow');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, { passive: true });


// ========== WOW FEATURES ==========

// 1. LIVE COUNTER - Initialize
function initLiveCounter() {
    let viewCount = parseInt(localStorage.getItem('wedding-views-niranjan-suzata') || '0');
    viewCount++;
    localStorage.setItem('wedding-views-niranjan-suzata', viewCount);
    
    const viewCountEl = document.getElementById('viewCount');
    if (viewCountEl) {
        // Animate counting up
        let current = Math.max(0, viewCount - 10);
        const increment = Math.ceil((viewCount - current) / 20);
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= viewCount) {
                current = viewCount;
                clearInterval(counter);
            }
            viewCountEl.textContent = current;
        }, 50);
    }
    
    console.log('✅ Live counter initialized:', viewCount);
}

// 2. FIREWORKS
function triggerFireworks() {
    if (typeof confetti === 'undefined') {
        console.log('⚠️ Confetti library not loaded');
        return;
    }
    
    console.log('🎆 Fireworks started!');
    
    const duration = 4000; // 4 seconds
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF69B4', '#FFA500'];

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors,
            startVelocity: 45,
            gravity: 1.2
        });
        
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors,
            startVelocity: 45,
            gravity: 1.2
        });

        // Big burst every second
        if (Math.random() < 0.1) {
            confetti({
                particleCount: 50,
                angle: 90,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                startVelocity: 60,
                gravity: 1.5
            });
        }

        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        } else {
            console.log('🎆 Fireworks ended!');
        }
    }());
}

// 3. FLOATING PETALS
function createFloatingPetals() {
    console.log('💐 Floating petals started!');
    
    let petalCount = 0;
    const maxPetals = 30; // Maximum petals on screen at once
    
    const petalInterval = setInterval(() => {
        // Remove old petals if too many
        const existingPetals = document.querySelectorAll('.petal');
        if (existingPetals.length >= maxPetals) {
            existingPetals[0].remove();
        }
        
        // Create new petal
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 4 + 6) + 's'; // 6-10 seconds
        petal.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(petal);
        
        // Remove after animation
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, 12000);
        
        petalCount++;
    }, 800); // New petal every 0.8 seconds
    
    // Stop creating petals after 2 minutes (but existing ones continue)
    setTimeout(() => {
        clearInterval(petalInterval);
        console.log('💐 Petal creation stopped (existing petals continue)');
    }, 120000);
}

// 4. SPARKLE CURSOR TRAIL
function createSparkleTrail() {
    console.log('✨ Sparkle cursor trail started!');
    
    let lastSparkleTime = 0;
    const sparkleThrottle = 100; // Minimum time between sparkles (ms)
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        
        // Throttle sparkle creation
        if (now - lastSparkleTime < sparkleThrottle) {
            return;
        }
        
        lastSparkleTime = now;
        
        // Create sparkle with 40% probability
        if (Math.random() > 0.6) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = e.pageX + 'px';
            sparkle.style.top = e.pageY + 'px';
            
            // Random slight offset for variety
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            
            document.body.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1000);
        }
    }, { passive: true });
    
    // Also add sparkles on touch for mobile
    document.addEventListener('touchmove', (e) => {
        const now = Date.now();
        
        if (now - lastSparkleTime < sparkleThrottle) {
            return;
        }
        
        lastSparkleTime = now;
        
        if (Math.random() > 0.6) {
            const touch = e.touches[0];
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = touch.pageX + 'px';
            sparkle.style.top = touch.pageY + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1000);
        }
    }, { passive: true });
}


// ========== CONSOLE ART ==========
console.log(`
%c
╔══════════════════════════════════════════════╗
║                                              ║
║      💐 NIRANJAN & SUZATA WEDDING 💐        ║
║                                              ║
║         26th Falgun, 2082                    ║
║         Tikapur, Kailali                     ║
║                                              ║
║         #NiranjanWedsSuzata                  ║
║                                              ║
╚══════════════════════════════════════════════╝
`, 'color: #FFD700; font-size: 12px; font-weight: bold;');

console.log('%c🎉 Thank you for visiting our wedding invitation!', 'color: #8B0000; font-size: 16px; font-weight: bold;');