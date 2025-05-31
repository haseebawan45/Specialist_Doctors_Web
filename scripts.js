document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                }
            }
        });
    });
    
    // Testimonial slider
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (dots.length > 0 && testimonials.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Remove active class from all dots and hide all testimonials
                dots.forEach(d => d.classList.remove('active'));
                testimonials.forEach(t => t.style.display = 'none');
                
                // Add active class to current dot and show corresponding testimonial
                dot.classList.add('active');
                testimonials[index].style.display = 'block';
            });
        });
        
        // Show first testimonial by default
        dots[0].classList.add('active');
        testimonials[0].style.display = 'block';
        testimonials.forEach((t, i) => {
            if (i !== 0) t.style.display = 'none';
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
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('show');
            }
        });
    }
    
    if (animateElements.length > 0) {
        window.addEventListener('scroll', checkScroll);
        // Check on load as well
        checkScroll();
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
            
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            let isValid = true;
            
            if (!name.trim()) {
                isValid = false;
                showError('name', 'Name is required');
            } else {
                hideError('name');
            }
            
            if (!email.trim()) {
                isValid = false;
                showError('email', 'Email is required');
            } else if (!isValidEmail(email)) {
                isValid = false;
                showError('email', 'Please enter a valid email');
            } else {
                hideError('email');
            }
            
            if (!message.trim()) {
                isValid = false;
                showError('message', 'Message is required');
            } else {
                hideError('message');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate API call with timeout
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Your message has been sent successfully!';
                    contactForm.appendChild(successMessage);
                    
                    // Remove success message after 3 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Helper functions
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = input.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            error.style.color = 'var(--error)';
            error.style.fontSize = '0.8rem';
            error.style.marginTop = '5px';
            
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        
        input.style.borderColor = 'var(--error)';
    }
    
    function hideError(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = input.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.style.display = 'none';
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats.length > 0) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    
                    if (!target.classList.contains('counted')) {
                        let count = 0;
                        const interval = setInterval(() => {
                            count += Math.ceil(countTo / 50);
                            target.textContent = count;
                            
                            if (count >= countTo) {
                                target.textContent = countTo;
                                clearInterval(interval);
                            }
                        }, 40);
                        
                        target.classList.add('counted');
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, options);
        
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }
}); 