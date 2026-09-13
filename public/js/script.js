const header = document.querySelector("header");

if (header) {
    window.addEventListener("scroll", function() {
        header.classList.toggle("sticky", window.scrollY > 0);
    });
}

let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle("bx-x");
        navbar.classList.toggle("active");   
    };

    window.onscroll = () => {
        menu.classList.remove("bx-x");
        navbar.classList.remove("active");   
    };
}

document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', event => {
        event.stopPropagation();
        const dropdown = toggle.closest('.nav-dropdown');
        const isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
        dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
});

/* ==========================================================================
   Formasyon Interactive Image Carousel & Lightbox Logic
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carousel-track");
    if (!track) return;

    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dotsContainer = document.getElementById("carousel-dots");
    const currentSlideNumEl = document.getElementById("current-slide-num");
    const totalSlideNumEl = document.getElementById("total-slide-num");
    const autoplayToggleBtn = document.getElementById("autoplay-toggle");
    const autoplayIcon = document.getElementById("autoplay-icon");

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isAutoplay = true;
    let autoplayInterval = null;

    if (totalSlideNumEl) {
        totalSlideNumEl.textContent = totalSlides;
    }

    // Generate Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = "";
        slides.forEach((_, idx) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (idx === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, idx) => {
            slide.classList.toggle("active", idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });

        if (currentSlideNumEl) {
            currentSlideNumEl.textContent = currentIndex + 1;
        }
    }

    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

    // Autoplay Timer
    function startAutoplay() {
        if (!autoplayInterval) {
            autoplayInterval = setInterval(nextSlide, 4500);
        }
        isAutoplay = true;
        if (autoplayIcon) autoplayIcon.className = "bx bx-pause";
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        isAutoplay = false;
        if (autoplayIcon) autoplayIcon.className = "bx bx-play";
    }

    function resetAutoplay() {
        if (isAutoplay) {
            stopAutoplay();
            startAutoplay();
        }
    }

    if (autoplayToggleBtn) {
        autoplayToggleBtn.addEventListener("click", () => {
            if (isAutoplay) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
    }

    // Pause on Hover
    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
        carouselContainer.addEventListener("mouseenter", () => {
            if (autoplayInterval) clearInterval(autoplayInterval);
        });
        carouselContainer.addEventListener("mouseleave", () => {
            if (isAutoplay) startAutoplay();
        });
    }

    // Keyboard Navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            nextSlide();
            resetAutoplay();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
            resetAutoplay();
        }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoplay();
        }
    }, { passive: true });

    // Start initial autoplay
    startAutoplay();

    /* ----------------------------------------------------------------------
       Lightbox Fullscreen Image Viewer
       ---------------------------------------------------------------------- */
    const lightboxModal = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");

    slides.forEach((slide) => {
        const img = slide.querySelector("img");
        if (img) {
            slide.addEventListener("click", () => {
                if (lightboxModal && lightboxImg) {
                    lightboxImg.src = img.src;
                    if (lightboxCaption) {
                        lightboxCaption.textContent = img.dataset.caption || img.alt || "Formasyon Detayı";
                    }
                    lightboxModal.classList.add("show");
                    stopAutoplay();
                }
            });
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            if (lightboxModal) lightboxModal.classList.remove("show");
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove("show");
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("show")) {
            lightboxModal.classList.remove("show");
        }
    });

    /* ----------------------------------------------------------------------
       TradingView Interactive Chart & Technical Gauge Dynamic Switcher
       ---------------------------------------------------------------------- */
    let currentSymbol = "BIST:THYAO";
    let currentInterval = "D";

    const symBtns = document.querySelectorAll(".symbol-selector-bar .sym-btn");
    const intervalBtns = document.querySelectorAll(".interval-selector-bar .interval-btn");

    function loadTeknikChart(symbol, interval) {
        const container = document.getElementById("tv-teknik-chart-container");
        if (!container) return;
        container.innerHTML = `<div id="tv_chart_inner" style="height:100%;width:100%;"></div>`;

        if (typeof TradingView !== 'undefined') {
            new TradingView.widget({
                "width": "100%",
                "height": 520,
                "symbol": symbol,
                "interval": interval,
                "timezone": "Europe/Istanbul",
                "theme": "dark",
                "style": "1",
                "locale": "tr",
                "toolbar_bg": "#020312",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tv_chart_inner"
            });
        }
    }

    function loadTeknikGauge(symbol) {
        const container = document.getElementById("tv-gauge-container");
        if (!container) return;
        container.innerHTML = "";

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "interval": "1D",
            "width": "100%",
            "isTransparent": true,
            "height": "450",
            "symbol": symbol,
            "showIntervalTabs": true,
            "displayMode": "single",
            "locale": "tr",
            "colorTheme": "dark"
        });
        container.appendChild(script);
    }

    symBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            symBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentSymbol = btn.dataset.symbol;
            loadTeknikChart(currentSymbol, currentInterval);
            loadTeknikGauge(currentSymbol);
        });
    });

    intervalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            intervalBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentInterval = btn.dataset.interval;
            loadTeknikChart(currentSymbol, currentInterval);
        });
    });

    // Initial TV Load
    setTimeout(() => {
        loadTeknikChart(currentSymbol, currentInterval);
        loadTeknikGauge(currentSymbol);
    }, 400);

    /* ----------------------------------------------------------------------
       Pivot Points Calculator Logic
       ---------------------------------------------------------------------- */
    const inputHigh = document.getElementById("pivot-high");
    const inputLow = document.getElementById("pivot-low");
    const inputClose = document.getElementById("pivot-close");

    const valR3 = document.getElementById("val-r3");
    const valR2 = document.getElementById("val-r2");
    const valR1 = document.getElementById("val-r1");
    const valP = document.getElementById("val-p");
    const valS1 = document.getElementById("val-s1");
    const valS2 = document.getElementById("val-s2");
    const valS3 = document.getElementById("val-s3");

    function calculatePivotPoints() {
        if (!inputHigh || !inputLow || !inputClose) return;

        const H = parseFloat(inputHigh.value) || 0;
        const L = parseFloat(inputLow.value) || 0;
        const C = parseFloat(inputClose.value) || 0;

        if (H > 0 && L > 0 && C > 0) {
            const P = (H + L + C) / 3;
            const R1 = (2 * P) - L;
            const S1 = (2 * P) - H;
            const R2 = P + (H - L);
            const S2 = P - (H - L);
            const R3 = H + 2 * (P - L);
            const S3 = L - 2 * (H - P);

            if (valP) valP.textContent = `${P.toFixed(2)} ₺`;
            if (valR1) valR1.textContent = `${R1.toFixed(2)} ₺`;
            if (valR2) valR2.textContent = `${R2.toFixed(2)} ₺`;
            if (valR3) valR3.textContent = `${R3.toFixed(2)} ₺`;
            if (valS1) valS1.textContent = `${S1.toFixed(2)} ₺`;
            if (valS2) valS2.textContent = `${S2.toFixed(2)} ₺`;
            if (valS3) valS3.textContent = `${S3.toFixed(2)} ₺`;
        }
    }

    if (inputHigh && inputLow && inputClose) {
        [inputHigh, inputLow, inputClose].forEach(input => {
            input.addEventListener("input", calculatePivotPoints);
        });
        calculatePivotPoints();
    }
});

