// Ivo's Pizza - Premium Restaurant Homepage
document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('header');
    let lastScrollY = 0;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#order') {
                e.preventDefault();
                openModal();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                navLinks?.classList.remove('active');
                menuToggle?.classList.remove('active');
            }
        });
    });

    // ============================================
    // CATEGORY FILTER
    // ============================================
    const categoryBtns = document.querySelectorAll('.category-btn');
    const pizzaCards = document.querySelectorAll('.pizza-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.textContent.toLowerCase();
            
            pizzaCards.forEach(card => {
                const cardCategories = card.dataset.category || '';
                
                if (category === 'alle' || cardCategories.includes(category)) {
                    card.style.display = '';
                    card.style.animation = 'fadeSlideUp 0.5s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // ORDER MODAL
    // ============================================
    const modal = document.getElementById('order-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const orderForm = document.getElementById('order-form');
    
    function openModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Open modal on order button click
    document.querySelectorAll('.btn-order, [href="#order"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const name = formData.get('name');
            const pizza = document.getElementById('pizza-select').selectedOptions[0].text;
            
            // Show success message
            alert(`🍕 Danke ${name}!\n\nDeine ${pizza} wird zubereitet und ist in ca. 30 Minuten bei dir!\n\n(Dies ist eine Demo)`);
            
            closeModal();
            orderForm.reset();
        });
    }

    // ============================================
    // ADD TO CART ANIMATION
    // ============================================
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            
            // Visual feedback
            this.textContent = '✓ Hinzugefügt!';
            this.style.background = '#4A7C2C';
            this.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
                this.style.transform = '';
            }, 1800);
        });
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.pizza-card, .feature-item, .stat, .info-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        fadeInObserver.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // PARALLAX EFFECT FOR ABOUT SECTION
    // ============================================
    const aboutSection = document.querySelector('.about-section');
    
    if (aboutSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const sectionTop = aboutSection.offsetTop;
            const sectionHeight = aboutSection.offsetHeight;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const parallaxValue = (scrolled - sectionTop + window.innerHeight) * 0.1;
                aboutSection.style.backgroundPositionY = `${parallaxValue}px`;
            }
        }, { passive: true });
    }

    // ============================================
    // IMAGE LAZY LOADING ENHANCEMENT
    // ============================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            imageObserver.observe(img);
        });
        
        // Add loaded styles
        const imgStyle = document.createElement('style');
        imgStyle.textContent = `img.loaded { opacity: 1 !important; }`;
        document.head.appendChild(imgStyle);
    }

    // ============================================
    // COUNTER ANIMATION FOR STATS
    // ============================================
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = el.textContent;
        const isPercentage = target.includes('%');
        const hasPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(counter);
            }
            
            let display = Math.floor(current);
            if (display >= 1000) {
                display = Math.floor(display / 1000) + 'K';
            }
            
            el.textContent = display + (hasPlus ? '+' : '') + (isPercentage ? '%' : '');
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    console.log('🍕 Ivo\'s Pizza - Premium Homepage Ready!');
});
