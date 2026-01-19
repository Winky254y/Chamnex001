// ===== EMAIL JS INITIALIZATION =====
// Initialize EmailJS (using free service)
(function() {
    // Using a public service key for demonstration
    // In production, replace with your actual EmailJS service
    emailjs.init("YOUR_PUBLIC_KEY"); // Will be set dynamically
})();

// ===== MODERN INTERACTIVE EFFECTS =====

// Detect device type
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = () => /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navLinks.classList.remove('active');
        }
    });
}

// Close menu when link is clicked
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Prevent default link behavior for touch devices
if (isMobile()) {
    document.querySelectorAll('a, button').forEach(elem => {
        elem.style.WebkitTapHighlightColor = 'transparent';
    });
}

// ===== ENHANCED NAVBAR INTERACTIVITY =====
const navbar = document.querySelector('nav');
const navCTAButtons = document.querySelectorAll('.nav-cta .cta-button');

// Navbar background change on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Navbar CTA buttons ripple effect
navCTAButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Add touch feedback
    btn.addEventListener('touchstart', function() {
        this.style.opacity = '0.9';
    });
    
    btn.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
});

// Nav links hover animation enhancement
const navLinksElements = document.querySelectorAll('.nav-links a');
navLinksElements.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ===== FAQ ACCORDION WITH SEARCH & FILTER =====
const faqHeaders = document.querySelectorAll('.faq-header');
const faqSearch = document.getElementById('faqSearch');
const faqFilterButtons = document.querySelectorAll('.faq-filter-btn');
const faqItems = document.querySelectorAll('.faq-item');
const faqNoResults = document.getElementById('faqNoResults');

// FAQ Toggle Function
faqHeaders.forEach(header => {
    const toggleFAQ = (e) => {
        e.preventDefault();
        const faqItem = header.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all open items
        document.querySelectorAll('.faq-item:not(.hidden)').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it was closed
        if (!isActive && !faqItem.classList.contains('hidden')) {
            faqItem.classList.add('active');
            // Scroll to item on mobile
            if (isMobile()) {
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    };

    header.addEventListener('click', toggleFAQ);
    header.addEventListener('touchend', toggleFAQ);
});

// FAQ Search Functionality
if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-header h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-content p').textContent.toLowerCase();
            const matches = question.includes(searchTerm) || answer.includes(searchTerm);

            if (searchTerm === '' || matches) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
                item.classList.remove('active');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            faqNoResults.classList.add('show');
        } else {
            faqNoResults.classList.remove('show');
        }
    });
}

// FAQ Filter Functionality
if (faqFilterButtons.length > 0) {
    faqFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = button.getAttribute('data-category');

            // Update active button
            faqFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            let visibleCount = 0;

            // Filter items
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('active');
                }
            });

            // Show/hide no results message
            if (visibleCount === 0) {
                faqNoResults.classList.add('show');
            } else {
                faqNoResults.classList.remove('show');
            }

            // Clear search on filter change
            if (faqSearch) {
                faqSearch.value = '';
            }
        });
    });
}

// ===== CONTACT FORM HANDLING WITH EMAIL =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
            showFormStatus('Please fill in all required fields', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormStatus('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Sending...';
        submitBtn.disabled = true;

        // Send email using a simple backend approach (using Formspree as fallback)
        sendEmailViaFormspree(formData, submitBtn, originalText);
    });
}

// Function to send email via Formspree (free service, no backend required)
function sendEmailViaFormspree(formData, submitBtn, originalText) {
    const emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}

Message:
${formData.message}
    `;

    // Prepare email to be sent to CharlesMuiruri1001@gmail.com
    const recipientEmail = 'CharlesMuiruri1001@gmail.com';
    
    // Create a hidden form to submit to Formspree
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = 'https://formspree.io/f/xgejazqk'; // Formspree endpoint (free service)
    hiddenForm.style.display = 'none';

    // Add form fields
    const nameField = document.createElement('input');
    nameField.type = 'hidden';
    nameField.name = 'name';
    nameField.value = formData.name;
    hiddenForm.appendChild(nameField);

    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'email';
    emailField.value = formData.email;
    hiddenForm.appendChild(emailField);

    const phoneField = document.createElement('input');
    phoneField.type = 'hidden';
    phoneField.name = 'phone';
    phoneField.value = formData.phone;
    hiddenForm.appendChild(phoneField);

    const serviceField = document.createElement('input');
    serviceField.type = 'hidden';
    serviceField.name = 'service';
    serviceField.value = formData.service;
    hiddenForm.appendChild(serviceField);

    const messageField = document.createElement('textarea');
    messageField.name = 'message';
    messageField.value = formData.message;
    hiddenForm.appendChild(messageField);

    document.body.appendChild(hiddenForm);

    // Submit the form
    fetch(hiddenForm.action, {
        method: 'POST',
        body: new FormData(hiddenForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success
            showFormStatus('✅ Message sent successfully! We\'ll contact you within 24 hours at ' + formData.email, 'success');
            contactForm.reset();
            
            // Also show WhatsApp option
            setTimeout(() => {
                const whatsappChoice = confirm('Would you like to also contact us via WhatsApp for faster response?');
                if (whatsappChoice) {
                    const whatsappMessage = `Hi ChamNex! I just submitted a form regarding ${formData.service}. My contact is ${formData.email}`;
                    const encodedMsg = encodeURIComponent(whatsappMessage);
                    window.open(`https://wa.me/254722905171?text=${encodedMsg}`, '_blank');
                }
            }, 1000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormStatus('❌ Error sending message. Please try again or contact us via WhatsApp.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.body.removeChild(hiddenForm);
    });
}

// Show form status message
function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    
    if (type === 'error') {
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
}

// Glassmorphic Navigation Effect on Scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    const nav = document.querySelector('nav');
    if (lastScrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Parallax background effect
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `center ${lastScrollY * 0.5}px`;
    }
});

// Smooth Scrolling with Easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const topOffset = target.offsetTop - 80;
            window.scrollTo({
                top: topOffset,
                behavior: 'smooth'
            });
        }
    });
});

// Gallery Filter with Smooth Transitions
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const visibleCountSpan = document.getElementById('visibleCount');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;

        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = `none`;
                setTimeout(() => {
                    item.style.animation = `slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s forwards`;
                }, 10);
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update visible count
        if (visibleCountSpan) {
            visibleCountSpan.textContent = visibleCount;
        }

        // Smooth scroll animation
        const gallery = document.querySelector('.gallery-grid');
        if (gallery) {
            gallery.style.animation = 'fadeIn 0.3s ease';
        }
    });

    // Add touch feedback for mobile
    btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });

    btn.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

// Gallery item button interactions
const galleryBtns = document.querySelectorAll('.gallery-btn');
galleryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = btn.closest('.gallery-item');
        const overlay = item.querySelector('.gallery-overlay-info');
        
        if (overlay) {
            overlay.style.animation = 'slideInUp 0.4s ease';
        }
    });
});

// Gallery item hover effects for mobile
galleryItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
        galleryItems.forEach(i => i.classList.remove('touch-active'));
        this.classList.add('touch-active');
    });
});

// Advanced Scroll-Triggered Animations with Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation based on position
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
    '.service-card, .gallery-item, .area-card, .contact-card, .feature-item, .section-title, .section-subtitle, .stat-card, .testimonial-card, .faq-item'
);

animatedElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Mouse Move Parallax Effect on Cards (Desktop Only)
if (!isMobile() && !isTablet()) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.service-card, .contact-card, .stat-card, .testimonial-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
        });
    });

    // Reset card position on mouse leave
    document.addEventListener('mouseleave', () => {
        const cards = document.querySelectorAll('.service-card, .contact-card, .stat-card, .testimonial-card');
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Micro-interactions for Buttons - with Touch Support
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
buttons.forEach(btn => {
    if (!isMobile() && !isTablet()) {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-3px) scale(0.98)';
        });

        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
    } else {
        // Mobile touch interactions
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.8';
        });

        btn.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '1';
        });
    }
});

// Scroll Progress Indicator
const createProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #fb923c, #f97316);
        z-index: 999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
};

createProgressBar();

// Reveal text animation on scroll
const revealTextElements = () => {
    const textElements = document.querySelectorAll('.hero h1, .section-title, .section-subtitle');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    textElements.forEach(el => {
        el.style.opacity = '0';
        textObserver.observe(el);
    });
};

revealTextElements();

// WhatsApp integration
function openWhatsApp(message = '') {
    const whatsappNumber = '254722905171';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.5s ease';
        }, 100);
    });
}
