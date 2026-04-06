document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    syncNavHeight();
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    window.addEventListener('resize', syncNavHeight);

    const scrollElements = document.querySelectorAll('.scroll-animate');
    if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        scrollElements.forEach((element, index) => {
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    }

    const heroTextElements = document.querySelectorAll('.hero h1, .hero p, .hero span, .hero a');
    heroTextElements.forEach((element) => {
        element.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 0.7)';
    });

    initHeroVideoFallback();
    initGalleryCarousels();
});

function syncNavHeight() {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        return;
    }

    document.documentElement.style.setProperty('--nav-height', `${navbar.offsetHeight}px`);
}

function initHeroVideoFallback() {
    const video = document.getElementById('hero-video');
    const fallbackCarousel = document.getElementById('fallback-carousel');
    const carouselImagesContainer = fallbackCarousel?.querySelector('.carousel-images');

    if (!video || !fallbackCarousel || !carouselImagesContainer) {
        return;
    }

    video.play().catch((error) => {
        console.log('Video autoplay was blocked.', error);
    });

    video.addEventListener('error', () => {
        console.log('Video failed to load. Switching to the fallback carousel.');

        const videoContainer = document.getElementById('video-background-container');
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }

        fallbackCarousel.style.display = 'block';
        initFallbackCarousel(carouselImagesContainer);
    });
}

function initFallbackCarousel(container) {
    const imageFiles = [
        'images/factory-photos/factory-01.jpg',
        'images/factory-photos/factory-02.jpg',
        'images/factory-photos/factory-03.jpg',
        'images/factory-photos/factory-04.jpg',
        'images/factory-photos/factory-05.jpg',
        'images/factory-photos/factory-06.jpg',
        'images/factory-photos/factory-07.jpg',
        'images/factory-photos/factory-08.jpg',
        'images/factory-photos/factory-10.jpg',
        'images/factory-photos/factory-11.jpg',
        'images/factory-photos/factory-12.jpg',
        'images/exhibition-photos/exhibition-02-courtyard-light.jpg',
        'images/exhibition-photos/exhibition-03-pillar-light.jpg',
        'images/exhibition-photos/exhibition-04-lawn-light.jpg',
        'images/exhibition-photos/exhibition-05-lawn-light.jpg',
        'images/exhibition-photos/exhibition-06-lawn-light.jpg',
        'images/exhibition-photos/exhibition-07-lawn-light.jpg',
        'images/exhibition-photos/exhibition-08-lamp-head.jpg'
    ];

    container.innerHTML = '';

    imageFiles.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Fallback background image ${index + 1}`;
        if (index === 0) {
            img.classList.add('active');
        }
        container.appendChild(img);
    });

    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) {
        return;
    }

    let currentIndex = 0;
    window.setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 5000);
}

function initGalleryCarousels() {
    const carouselImageMap = {
        factory: {
            folder: 'images/factory-photos',
            images: [
                { fileName: 'factory-01.jpg', alt: 'Factory production line' },
                { fileName: 'factory-02.jpg', alt: 'Quality control process' },
                { fileName: 'factory-03.jpg', alt: 'Assembly area' },
                { fileName: 'factory-04.jpg', alt: 'Packaging department' },
                { fileName: 'factory-05.jpg', alt: 'Production equipment' },
                { fileName: 'factory-06.jpg', alt: 'Quality testing' },
                { fileName: 'factory-07.jpg', alt: 'Worker assembly' },
                { fileName: 'factory-08.jpg', alt: 'Final inspection' },
                { fileName: 'factory-10.jpg', alt: 'Warehouse storage' },
                { fileName: 'factory-11.jpg', alt: 'Team meeting' },
                { fileName: 'factory-12.jpg', alt: 'Factory overview' }
            ]
        },
        exhibition: {
            folder: 'images/exhibition-photos',
            images: [
                { fileName: 'exhibition-02-courtyard-light.jpg', alt: 'Garden lighting exhibition' },
                { fileName: 'exhibition-03-pillar-light.jpg', alt: 'Pillar lights exhibition' },
                { fileName: 'exhibition-04-lawn-light.jpg', alt: 'Lawn lighting exhibition' },
                { fileName: 'exhibition-05-lawn-light.jpg', alt: 'Outdoor lighting showcase' },
                { fileName: 'exhibition-06-lawn-light.jpg', alt: 'Solar lighting display' },
                { fileName: 'exhibition-07-lawn-light.jpg', alt: 'Professional exhibition booth' },
                { fileName: 'exhibition-08-lamp-head.jpg', alt: 'Light fixture exhibition' }
            ]
        }
    };

    const carousels = Array.from(document.querySelectorAll('.factory-carousel'));

    carousels.forEach((carousel) => {
        const sourceKey = carousel.dataset.carouselSource;
        const sourceConfig = carouselImageMap[sourceKey];
        const imageContainer = carousel.querySelector('.gallery-images');
        const dotsContainer = carousel.querySelector('.factory-carousel-dots');
        const prevButton = carousel.querySelector('[data-carousel-action="prev"]');
        const nextButton = carousel.querySelector('[data-carousel-action="next"]');

        if (!sourceConfig || !imageContainer || !dotsContainer || !prevButton || !nextButton) {
            return;
        }

        imageContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        const slides = sourceConfig.images.map((imageConfig) => {
            const slide = document.createElement('img');
            slide.src = `${sourceConfig.folder}/${encodeURIComponent(imageConfig.fileName)}`;
            slide.alt = imageConfig.alt;
            slide.loading = 'lazy';
            imageContainer.appendChild(slide);
            return slide;
        });

        if (slides.length === 0) {
            return;
        }

        carousel.classList.add('is-enhanced');

        let currentIndex = 0;
        let autoplayId = null;

        const dots = slides.map((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'factory-carousel-dot';
            dot.setAttribute('aria-label', `Show slide ${index + 1}`);
            dot.addEventListener('click', () => {
                showSlide(index);
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
            return dot;
        });

        function showSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        function startAutoplay() {
            autoplayId = window.setInterval(() => {
                showSlide(currentIndex + 1);
            }, 4000);
        }

        function stopAutoplay() {
            if (autoplayId !== null) {
                window.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        prevButton.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            restartAutoplay();
        });

        nextButton.addEventListener('click', () => {
            showSlide(currentIndex + 1);
            restartAutoplay();
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', () => {
            if (autoplayId === null) {
                startAutoplay();
            }
        });

        showSlide(0);
        startAutoplay();
    });
}
