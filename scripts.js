document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            hamburger.innerHTML = navLinks.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    if (testimonialCards.length > 0 && dots.length > 0) {
        // Set initial active state
        dots[0].classList.add('active');
        
        // Set up dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        function updateSlider() {
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Show current slide (for mobile view)
            testimonialCards.forEach((card, index) => {
                card.style.display = index === currentSlide ? 'block' : 'none';
            });
        }
        
        // Auto-advance slides every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            updateSlider();
        }, 5000);
        
        // Initialize display for mobile
        if (window.innerWidth < 768) {
            updateSlider();
        }
        
        // Update on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                updateSlider();
            } else {
                testimonialCards.forEach(card => {
                    card.style.display = 'block';
                });
            }
        });
    }
    
    // FAQ accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                
                // Toggle current accordion
                header.classList.toggle('active');
                if (header.classList.contains('active')) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    }
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScroll = () => {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    if (animateElements.length > 0) {
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Initial check
    }
    
    // Gallery modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.gallery-modal img');
    const closeModal = document.querySelector('.close-modal');
    
    if (galleryItems.length > 0 && modal && modalImage && closeModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                modalImage.src = imgSrc;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Form submission with validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;
            
            if (!name.value.trim()) {
                highlightError(name);
                isValid = false;
            } else {
                removeError(name);
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                highlightError(email);
                isValid = false;
            } else {
                removeError(email);
            }
            
            if (!message.value.trim()) {
                highlightError(message);
                isValid = false;
            } else {
                removeError(message);
            }
            
            if (isValid) {
                // Here you would typically send the form data to your server
                // For now, we'll just show a success message
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Message Sent!</h3>
                        <p>Thank you for contacting us. We'll get back to you shortly.</p>
                    </div>
                `;
            }
        });
    }
    
    // Helper functions
    function highlightError(input) {
        input.style.borderColor = 'var(--error)';
        input.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
        
        // Add error message if it doesn't exist
        const parent = input.parentElement;
        if (!parent.querySelector('.error-message')) {
            const errorMsg = document.createElement('small');
            errorMsg.className = 'error-message';
            errorMsg.style.color = 'var(--error)';
            errorMsg.style.display = 'block';
            errorMsg.style.marginTop = '5px';
            errorMsg.textContent = `Please enter a valid ${input.placeholder.toLowerCase()}`;
            parent.appendChild(errorMsg);
        }
    }
    
    function removeError(input) {
        input.style.borderColor = 'var(--divider)';
        input.style.backgroundColor = 'var(--background)';
        
        // Remove error message if it exists
        const parent = input.parentElement;
        const errorMsg = parent.querySelector('.error-message');
        if (errorMsg) {
            parent.removeChild(errorMsg);
        }
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const counter = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    stat.textContent = target.toLocaleString() + (stat.textContent.includes('%') ? '%' : '+');
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + (stat.textContent.includes('%') ? '%' : '+');
                }
            }, 16);
        });
    };
    
    // Intersection Observer for stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Add CSS class for animation
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
}); 