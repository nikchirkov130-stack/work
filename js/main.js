document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const burger = document.querySelector('[data-burger]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isExpanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('is-active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // ANIMATED COUNTERS (fixed)
    // ==========================================
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-count');
        const duration = 1500;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const counters = document.querySelectorAll('[data-count]');
    const heroSection = document.querySelector('.hero');
    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(animateCounter);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (heroSection && counters.length) {
        counterObserver.observe(heroSection);
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const animateElements = document.querySelectorAll('[data-animate]');

    if (animateElements.length) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => animationObserver.observe(el));
    }

    const staggerElements = document.querySelectorAll('[data-animate-stagger]');

    if (staggerElements.length) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        staggerElements.forEach(el => staggerObserver.observe(el));
    }

    // ==========================================
    // MODALS
    // ==========================================
    const modals = document.querySelectorAll('.modal');
    const openModalBtns = document.querySelectorAll('[data-modal]');
    const closeModalBtns = document.querySelectorAll('[data-close-modal]');
    const productNameEl = document.getElementById('selected-product-name');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(`modal-${modalId}`);

            if (btn.hasAttribute('data-product') && productNameEl) {
                productNameEl.textContent = btn.getAttribute('data-product');
            }

            if (modal) {
                modal.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        modals.forEach(modal => modal.classList.remove('is-active'));
        document.body.style.overflow = '';
    };

    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal__overlay')) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ==========================================
    // ORDER FORM
    // ==========================================
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const data = Object.fromEntries(formData);

            console.log('Order data:', data);

            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения.');
                closeModal();
                orderForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 800);
        });
    }

    // ==========================================
    // PHONE INPUT MASK
    // ==========================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (!value.startsWith('7')) {
                value = '7' + value;
            }
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }
            e.target.value = formatted;
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length <= 3) {
                e.target.value = '';
            }
        });
    });

    // ==========================================
    // REVIEWS SLIDER
    // ==========================================
    const sliderTrack = document.querySelector('.reviews__track');
    const sliderPrevBtn = document.querySelector('[data-slider-prev]');
    const sliderNextBtn = document.querySelector('[data-slider-next]');

    if (sliderTrack && sliderPrevBtn && sliderNextBtn) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.review-card');
        const getSlidesPerView = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        let slidesPerView = getSlidesPerView();
        const totalSlides = slides.length;
        const maxIndex = totalSlides - slidesPerView;

        function updateSlider() {
            const offset = -currentIndex * (100 / slidesPerView);
            sliderTrack.style.transform = `translateX(${offset}%)`;
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateSlider();
        }

        sliderPrevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        sliderNextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                }
            }
            if (touchEndX > touchStartX + 50) {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            }
        }

        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView();
            currentIndex = 0;
            updateSlider();
        });
    }

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('is-active');

            faqItems.forEach(faqItem => {
                const faqAnswer = faqItem.querySelector('.faq__answer');
                faqAnswer.style.maxHeight = null;
                faqItem.classList.remove('is-active');
                const btn = faqItem.querySelector('.faq__question');
                btn.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('is-active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // CART SYSTEM
    // ==========================================
    const cartCountEl = document.querySelector('[data-cart-count]');
    if (cartCountEl) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountEl.textContent = cartCount;
    }

    window.getCart = function() {
        try { return JSON.parse(localStorage.getItem('cart_items')) || []; }
        catch { return []; }
    };

    window.saveCart = function(items) {
        localStorage.setItem('cart_items', JSON.stringify(items));
        const total = items.reduce((s, i) => s + i.quantity, 0);
        localStorage.setItem('cartCount', total);
        const el = document.querySelector('[data-cart-count]');
        if (el) el.textContent = total;
    };

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-to-cart]');
        if (!btn) return;

        e.preventDefault();

        const id = parseInt(btn.dataset.id);
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const image = btn.dataset.image;

        const cart = getCart();
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart(cart);

        if (cartCountEl) {
            cartCountEl.style.transform = 'scale(1.3)';
            setTimeout(() => { cartCountEl.style.transform = 'scale(1)'; }, 200);
        }
    });

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('[data-header]');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.querySelector('[data-back-to-top]');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // HERO PARALLAX
    // ==========================================
    const parallaxLayer = document.querySelector('.hero__parallax-layer');

    if (parallaxLayer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (scrollY < window.innerHeight) {
                const translateY = scrollY * 0.15;
                parallaxLayer.style.transform = `translateY(${translateY}px)`;
            }
        }, { passive: true });
    }

});
