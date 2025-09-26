// Volholla Interactive Experience
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '1';
            });
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Viking Horn Sound Effect (Web Audio API)
    function createHornSound() {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create horn sound using oscillators
        const duration = 1.5; // seconds
        const now = audioContext.currentTime;
        
        // Main horn tone
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        // Deep Viking horn frequency
        oscillator1.frequency.setValueAtTime(150, now);
        oscillator1.frequency.exponentialRampToValueAtTime(120, now + duration);
        
        oscillator1.type = 'sawtooth';
        
        // Volume envelope
        gainNode1.gain.setValueAtTime(0, now);
        gainNode1.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gainNode1.gain.exponentialRampToValueAtTime(0.1, now + duration * 0.7);
        gainNode1.gain.linearRampToValueAtTime(0, now + duration);
        
        // Harmonic for richness
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.setValueAtTime(300, now);
        oscillator2.frequency.exponentialRampToValueAtTime(240, now + duration);
        oscillator2.type = 'triangle';
        
        gainNode2.gain.setValueAtTime(0, now);
        gainNode2.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gainNode2.gain.exponentialRampToValueAtTime(0.05, now + duration * 0.7);
        gainNode2.gain.linearRampToValueAtTime(0, now + duration);
        
        // Start the oscillators
        oscillator1.start(now);
        oscillator1.stop(now + duration);
        
        oscillator2.start(now);
        oscillator2.stop(now + duration);
    }

    // Horn sound function with fallback
    window.playHornSound = function() {
        try {
            createHornSound();
            
            // Add visual feedback
            const button = event.target;
            const original = button.innerHTML;
            button.innerHTML = '🎺 SKOL! 🎺';
            button.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                button.innerHTML = original;
                button.style.transform = '';
            }, 1500);
            
        } catch (error) {
            console.log('Audio context not available, using visual feedback only');
            
            // Visual-only feedback if audio fails
            const button = event.target;
            const original = button.innerHTML;
            button.innerHTML = '⚡ LEGEND AWAITS ⚡';
            button.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                button.innerHTML = original;
                button.style.transform = '';
            }, 1500);
        }
    };

    // Scroll-triggered animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.accommodation-card, .feature, .quote-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .accommodation-card,
        .feature,
        .quote-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .accommodation-card.animate-in,
        .feature.animate-in,
        .quote-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .accommodation-card:nth-child(2n) {
            transition-delay: 0.1s;
        }
        
        .accommodation-card:nth-child(3n) {
            transition-delay: 0.2s;
        }
        
        .quote-card:nth-child(2n) {
            transition-delay: 0.1s;
        }
        
        .quote-card:nth-child(3n) {
            transition-delay: 0.2s;
        }
        
        .quote-card:nth-child(4n) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);

    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Run once on load
    handleScrollAnimations();

    // Add parallax effect to hero section
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    window.addEventListener('scroll', handleParallax);

    // Dynamic navbar background on scroll
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            navbar.style.backgroundColor = 'rgba(44, 44, 44, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.backgroundColor = 'rgba(44, 44, 44, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // Add click handlers for all CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default if it's not the main hero button
            if (!this.getAttribute('onclick')) {
                e.preventDefault();
                
                // Add booking animation
                const original = this.innerHTML;
                this.innerHTML = '🔥 SAGA BEGINS! 🔥';
                this.style.transform = 'scale(1.05)';
                
                // Scroll to booking section
                const bookingSection = document.querySelector('#booking');
                if (bookingSection) {
                    setTimeout(() => {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                }
                
                setTimeout(() => {
                    this.innerHTML = original;
                    this.style.transform = '';
                }, 2000);
            }
        });
    });

    // Add hover sound effects for accommodation cards
    const accommodationCards = document.querySelectorAll('.accommodation-card');
    accommodationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle scale effect
            this.style.transition = 'all 0.3s ease';
            
            // Add glow effect
            this.style.boxShadow = '0 15px 30px rgba(255, 130, 0, 0.3), 0 0 20px rgba(199, 166, 75, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // Easter egg: Konami code for special Viking mode
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            activateVikingMode();
        }
    });

    function activateVikingMode() {
        // Add special Viking effects
        const body = document.body;
        body.style.filter = 'sepia(20%) saturate(150%) hue-rotate(10deg)';
        
        // Show special message
        const vikingMessage = document.createElement('div');
        vikingMessage.innerHTML = '⚔️ ODIN HAS BLESSED YOUR VISIT! ⚔️';
        vikingMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FF8200, #C7A64B);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            font-family: Cinzel, serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: vikingPulse 2s ease-in-out;
        `;
        
        // Add animation keyframes
        const vikingStyle = document.createElement('style');
        vikingStyle.textContent = `
            @keyframes vikingPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(vikingStyle);
        
        body.appendChild(vikingMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            vikingMessage.remove();
            body.style.filter = '';
        }, 3000);
        
        // Reset konami code
        konamiCode = [];
    }

    // Add typing effect for hero tagline
    function typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect with delay
    setTimeout(() => {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) {
            const originalText = heroTagline.textContent;
            typeWriter(heroTagline, originalText, 80);
        }
    }, 1000);

    console.log('🔥 Volholla Interactive Experience Loaded! 🔥');
    console.log('⚔️ Try the Konami code for a special surprise! ⚔️');
});