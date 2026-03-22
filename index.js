// Menu button logic added additional for better experience
document
    .querySelector(".hamburger")
    .addEventListener("click", function () {
        document.querySelector(".header-menu").classList.toggle("open");
    });

(function () {
    const images = [
        "./assets/hdpe-img/img-1.jpg",
        "./assets/hdpe-img/img-2.jpg",
        "./assets/hdpe-img/img-3.jpg",
        "./assets/hdpe-img/img-4.jpg",
        "./assets/hdpe-img/img-5.jpg",
        "./assets/hdpe-img/img-3.jpg",
    ];
    const wrapper = document.querySelector(".main-image-wrap");
    const thumbsEl = document.getElementById("thumbs");
    const track = document.createElement("div");
    track.style.cssText = "display:flex;height:100%;will-change:transform;";
    images.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `slide ${i + 1}`;
        img.style.cssText =
            "min-width:100%;height:100%;object-fit:cover;flex-shrink:0;";
        if (i > 0) img.loading = "lazy";
        track.appendChild(img);
    });

    const oldImg = document.getElementById("mainImg");
    oldImg.replaceWith(track);

    let current = 0;
    let targetX = 0;
    let currentX = 0;
    let rafId = null;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function tick() {
        currentX = lerp(currentX, targetX, 0.1);
        track.style.transform = `translateX(${currentX}%)`;
        if (Math.abs(currentX - targetX) > 0.01) {
            rafId = requestAnimationFrame(tick);
        } else {
            currentX = targetX;
            track.style.transform = `translateX(${currentX}%)`;
            rafId = null;
        }
    }

    function goTo(index) {
        current = (index + images.length) % images.length;
        targetX = -current * 100;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
        renderThumbs();
    }

    function renderThumbs() {
        thumbsEl.innerHTML = "";
        images.forEach((src, i) => {
            const div = document.createElement("div");
            div.className = "thumb" + (i === current ? " active" : "");
            div.innerHTML = `<img src="${src}" alt="thumb ${i + 1}" loading="lazy">`;
            div.addEventListener("click", () => goTo(i));
            thumbsEl.appendChild(div);
        });
    }

    document.querySelector(".nav-btn.prev").onclick = () =>
        goTo(current - 1);
    document.querySelector(".nav-btn.next").onclick = () =>
        goTo(current + 1);

    window.changeImg = (dir) => goTo(current + dir);

    let touchStartX = 0,
        touchDeltaX = 0,
        isDragging = false;

    wrapper.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        },
        { passive: true },
    );

    wrapper.addEventListener(
        "touchmove",
        (e) => {
            if (!isDragging) return;
            touchDeltaX = e.touches[0].clientX - touchStartX;
            const drag = (touchDeltaX / wrapper.offsetWidth) * 100;
            track.style.transform = `translateX(${targetX + drag}%)`;
        },
        { passive: true },
    );

    wrapper.addEventListener("touchend", () => {
        isDragging = false;
        const threshold = wrapper.offsetWidth * 0.2;
        if (touchDeltaX < -threshold) goTo(current + 1);
        else if (touchDeltaX > threshold) goTo(current - 1);
        else goTo(current);
        touchDeltaX = 0;
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") goTo(current - 1);
        if (e.key === "ArrowRight") goTo(current + 1);
    });
    renderThumbs();
})();

// ── Zoom Preview on Hover ──────────────────────────────────────────
// ── Zoom Preview on Hover ──────────────────────────────────────────
(function () {
    const wrapper = document.querySelector(".main-image-wrap");
    const productContainer = document.getElementById("info-container");
    const lens = document.createElement("div");
    lens.id = "zoom-lens";
    lens.style.cssText = `
    position: absolute;
    width: 300px;
    height: 300px;
    border: 2.5px solid rgba(160, 160, 160, 0.85);
    background-repeat: no-repeat;
    pointer-events: none;
    display: none;
    border-radius:10px;
    z-index: 10;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 6px 24px rgba(0,0,0,0.25);
    top: 50%;
    left: 43%;
    transform: translateY(-50%);
  `;
    productContainer.appendChild(lens);

    const ZOOM = 2.5;
    const LENS_HALF = 100;

    function getActiveImage() {
        const track = wrapper.querySelector("div");
        const imgs = track ? track.querySelectorAll("img") : [];
        const transform = track ? track.style.transform : "";
        const match = transform.match(/translateX\(([-\d.]+)%\)/);
        const offsetPct = match ? parseFloat(match[1]) : 0;
        const index = Math.round(-offsetPct / 100);
        return imgs[index] || imgs[0];
    }

    wrapper.addEventListener("mouseenter", () => {
        lens.style.display = "block";
    });

    wrapper.addEventListener("mouseleave", () => {
        lens.style.display = "none";
    });

    wrapper.addEventListener("mousemove", (e) => {
        const rect = wrapper.getBoundingClientRect();

        // Cursor position drives zoom origin — lens stays fixed
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        const img = getActiveImage();
        if (!img) return;

        const bgW = rect.width * ZOOM;
        const bgH = rect.height * ZOOM;

        const bgX = -(rawX * ZOOM - LENS_HALF);
        const bgY = -(rawY * ZOOM - LENS_HALF);

        lens.style.backgroundImage = `url('${img.src}')`;
        lens.style.backgroundSize = `${bgW}px ${bgH}px`;
        lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    });
})();

const toast = document.getElementById('dlToast');
const toastTitle = document.getElementById('toast-title')
const toastSub = document.getElementById('toast-sub')
let hideTimer = null;

function showToast() {
    toast.classList.remove('toast--hiding');
    toast.classList.add('toast--visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideToast, 2000);
}
function hideToast() {
    toast.classList.add('toast--hiding');
    toast.classList.remove('toast--visible');
    clearTimeout(hideTimer);
}

(function () {
    const btn = document.querySelector('.btn-download');
    const close = document.getElementById('dlToastClose');
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.style.display = 'flex';
    });

    close.addEventListener('click', hideToast);
})();

// frequently asked UI accordian
function toggleFaq(questionEl) {
    const item = questionEl.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

    // Open clicked if it was closed
    if (!isOpen) {
        item.classList.add('open');
    }
}

// versatile section
(function () {
    const track = document.getElementById('versatile-carouselTrack');
    const viewport = document.getElementById('versatile-carouselViewport');
    const prevBtn = document.getElementById('versatile-prevBtn');
    const nextBtn = document.getElementById('versatile-nextBtn');

    let currentIndex = 0;

    function getCardWidth() {
        const card = track.querySelector('.versatile-card');
        if (!card) return 0;
        const style = window.getComputedStyle(card);
        const gap = parseInt(window.getComputedStyle(track).gap || '16', 10);
        return card.getBoundingClientRect().width + gap;
    }

    function getVisibleCount() {
        const vw = viewport.getBoundingClientRect().width;
        const cw = getCardWidth();
        return cw > 0 ? Math.floor(vw / cw) : 1;
    }

    function totalCards() {
        return track.querySelectorAll('.versatile-card').length;
    }

    function maxIndex() {
        return Math.max(0, totalCards() - getVisibleCount());
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex()));
        const offset = currentIndex * getCardWidth();
        track.style.transform = `translateX(-${offset}px)`;
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => goTo(currentIndex), 100);
    });

    // Touch / swipe
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        }
    }, { passive: true });

    // Init
    goTo(0);
})();



// advance hdpe manufacturing section
const steps = [
    {
        label: "Raw Material",
        title: "High-Grade Raw Material Selection",
        desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
        features: ["PE100 grade material", "Optimal molecular weight distribution"],
        bg1: "#9aabb8", bg2: "#6a7a6a", pipe: "#c05a18", pipe2: "#d96820", ball: "#c03010"
    },
    {
        label: "Extrusion",
        title: "Precision Extrusion Process",
        desc: "The extruder melts and homogenizes the HDPE compound, pushing it through a precision die to form the pipe shape with consistent wall thickness.",
        features: ["Temperature-controlled barrel zones", "Consistent melt pressure control"],
        bg1: "#8a9aaa", bg2: "#5a6a5a", pipe: "#4477bb", pipe2: "#5588cc", ball: "#2255aa"
    },
    {
        label: "Cooling",
        title: "Controlled Cooling System",
        desc: "Pipes pass through water-filled cooling tanks that rapidly and uniformly reduce the temperature, locking in the dimensional properties.",
        features: ["Uniform water spray cooling", "Controlled cooling rate"],
        bg1: "#7090a8", bg2: "#506070", pipe: "#2277aa", pipe2: "#3388bb", ball: "#115588"
    },
    {
        label: "Sizing",
        title: "Vacuum Sizing & Calibration",
        desc: "Vacuum sizing tanks ensure precise outer diameter while internal air pressure maintains perfect roundness and uniform wall thickness.",
        features: ["Precision vacuum calibration sleeves", "Diameter tolerance ±0.1mm"],
        bg1: "#88a090", bg2: "#506050", pipe: "#337744", pipe2: "#448855", ball: "#225533"
    },
    {
        label: "Quality Control",
        title: "Rigorous Quality Inspection",
        desc: "Every pipe is subjected to dimensional checks, pressure testing, and visual inspection to ensure it meets international standards.",
        features: ["100% dimensional verification", "Hydrostatic pressure testing"],
        bg1: "#a09080", bg2: "#706050", pipe: "#bb5522", pipe2: "#cc6633", ball: "#993311"
    },
    {
        label: "Marking",
        title: "Permanent Pipe Marking",
        desc: "Pipes are permanently marked with product information including size, pressure rating, material grade, and production batch details.",
        features: ["Inkjet & embossed marking system", "Full production traceability data"],
        bg1: "#908880", bg2: "#605850", pipe: "#996633", pipe2: "#aa7744", ball: "#774422"
    },
    {
        label: "Cutting",
        title: "Precision Pipe Cutting",
        desc: "Automated cutting systems deliver clean, square cuts to exact customer-specified lengths with minimal material waste.",
        features: ["Automated length control system", "Square cut tolerance ±2mm"],
        bg1: "#807878", bg2: "#585050", pipe: "#884444", pipe2: "#995555", ball: "#662222"
    },
    {
        label: "Packaging",
        title: "Safe Packaging & Dispatch",
        desc: "Finished pipes are bundled, strapped, and labeled for safe transportation. Each bundle includes full certification documentation.",
        features: ["Bundle strapping & protective end caps", "Full certification documentation"],
        bg1: "#708870", bg2: "#506050", pipe: "#448844", pipe2: "#559955", ball: "#226622"
    }
];

function buildSVG(s) {
    return `<img src="./assets/hdpe-img/img-1.jpg" alt="sample image" class="pipe-manufacturing-img" />`;
}

function buildFeatures(features) {
    return features.map(f => `
      <li>
        <span class="advnc-hdpe-check-icon">
          <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        ${f}
      </li>`).join('');
}

let current = 0;
const stepBadge = document.getElementById('advnc-hdpe-stepBadge');
const stepTitle = document.getElementById('advnc-hdpe-stepTitle');
const stepDesc = document.getElementById('advnc-hdpe-stepDesc');
const stepFeatures = document.getElementById('advnc-hdpe-stepFeatures');
const stepImageWrap = document.getElementById('advnc-hdpe-stepImageWrap');
const prevBtn = document.getElementById('advnc-hdpe-prevBtn');
const nextBtn = document.getElementById('advnc-hdpe-nextBtn');
const tabBtns = document.querySelectorAll('.advnc-hdpe-tab-btn');

function goToStep(index) {
    current = index;
    const s = steps[index];
    stepBadge.textContent = `Step ${index + 1}/8: ${s.label}`;
    stepTitle.textContent = s.title;
    stepDesc.textContent = s.desc;
    stepFeatures.innerHTML = buildFeatures(s.features);
    stepImageWrap.innerHTML = buildSVG(s);
    tabBtns.forEach(btn => btn.classList.toggle('active', +btn.dataset.index === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === steps.length - 1;
}

tabBtns.forEach(btn => btn.addEventListener('click', () => goToStep(+btn.dataset.index)));
prevBtn.addEventListener('click', () => { if (current > 0) goToStep(current - 1); });
nextBtn.addEventListener('click', () => { if (current < steps.length - 1) goToStep(current + 1); });

// Init
goToStep(0);



//   brochure download
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const downloadBtn = document.getElementById('downloadBtn');
const emailError = document.getElementById('emailError');
const emailErrTxt = document.getElementById('emailErrorText');
const phoneError = document.getElementById('phoneError');
const phoneErrTxt = document.getElementById('phoneErrorText');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');

// ── Validators ──
function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
}

// Phone: optional, but if entered must be valid
// Accepts formats: +91-XXXXXXXXXX, +91XXXXXXXXXX, 10-digit local
function isValidPhone(val) {
    if (!val.trim()) return true; // optional
    return /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(val.trim())
        || /^\+\d{1,3}-\d{10}$/.test(val.trim())
        || /^\d{10}$/.test(val.trim());
}

// ── Show / hide errors ──
function setEmailError(msg) {
    if (msg) {
        emailErrTxt.textContent = msg;
        emailError.classList.add('visible');
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
    } else {
        emailError.classList.remove('visible');
        emailInput.classList.remove('error');
    }
}

function setPhoneError(msg) {
    if (msg) {
        phoneErrTxt.textContent = msg;
        phoneError.classList.add('visible');
        phoneInput.classList.add('error');
        phoneInput.classList.remove('success');
    } else {
        phoneError.classList.remove('visible');
        phoneInput.classList.remove('error');
    }
}

// ── Check readiness ──
function evaluate() {
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();

    const emailOk = emailVal && isValidEmail(emailVal);
    const phoneOk = isValidPhone(phoneVal);

    if (emailOk) emailInput.classList.add('success');
    if (phoneOk && phoneVal) phoneInput.classList.add('success');

    const ready = emailOk && phoneOk;
    downloadBtn = !ready;
    downloadBtn.classList.toggle('enabled', ready);
}

// ── Email events ──
emailInput.addEventListener('input', () => {
    const v = emailInput.value.trim();
    emailInput.classList.remove('success');
    if (!v) {
        setEmailError('');
    } else if (!isValidEmail(v)) {
        setEmailError('Please enter a valid email address (e.g. name@domain.com)');
    } else {
        setEmailError('');
    }
    evaluate();
});

emailInput.addEventListener('blur', () => {
    const v = emailInput.value.trim();
    if (!v) {
        setEmailError('Email address is required');
    } else if (!isValidEmail(v)) {
        setEmailError('Please enter a valid email address (e.g. name@domain.com)');
    }
    evaluate();
});

// ── Phone events ──
phoneInput.addEventListener('input', () => {
    const v = phoneInput.value.trim();
    phoneInput.classList.remove('success');
    if (!v) {
        setPhoneError('');
    } else if (!isValidPhone(v)) {
        setPhoneError('Enter a valid phone number (e.g. +91-9876543210 or 10 digits)');
    } else {
        setPhoneError('');
    }
    evaluate();
});

phoneInput.addEventListener('blur', () => {
    const v = phoneInput.value.trim();
    if (v && !isValidPhone(v)) {
        setPhoneError('Enter a valid phone number (e.g. +91-9876543210 or 10 digits)');
    }
    evaluate();
});

// ── Download button ──
downloadBtn.addEventListener('click', () => {
    if (!isValidEmail(emailInput.value.trim())) return
    if (phoneInput.value && !isValidPhone(phoneInput.value.trim())) return
    emailInput.value = "";
    phoneInput.value = "";
    overlay.style.display = 'none';
    toastTitle.innerHTML = "Download Successfully completed";
    toastSub.innerHTML = "Check your downloads folder.";
    showToast();
});

// ── Close ──
closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
});




// // request a quote
// // ── Elements ──
const nameInput = document.getElementById('quote-nameInput');
const companyInput = document.getElementById('quote-companyInput');
const userEmailInput = document.getElementById('quote-emailInput');
const userPhoneInput = document.getElementById('quote-phoneInput');
const phoneRow = document.getElementById('quote-phoneRow');
const submitBtn = document.getElementById('quote-submitBtn');
const clsBtn = document.getElementById('quote-closeBtn');
const qouteOverlay = document.getElementById('quote-overlay');
const countrySelect = document.getElementById('quote-countrySelect');
const countryDropdown = document.getElementById('quote-countryDropdown');
const selectedCode = document.getElementById('quote-selectedCode');

// ── Country dropdown ──
countrySelect.addEventListener('click', (e) => {
    e.stopPropagation();
    countryDropdown.classList.toggle('quote-open');
});

// Open Popup 
const ctaButton = document.getElementById("cta-btn");
const reqCusQuoteButton = document.getElementById("contact-us-cta-form-card-btn");
reqCusQuoteButton.addEventListener("click", () => {
    qouteOverlay.style.display = 'flex'
})
ctaButton.addEventListener("click", () => {
    qouteOverlay.style.display = 'flex'
})

countrySelect.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') countryDropdown.classList.toggle('quote-open');
});

countryDropdown.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', (e) => {
        e.stopPropagation();
        countryDropdown.querySelectorAll('li').forEach(x => x.classList.remove('quote-selected'));
        li.classList.add('quote-selected');
        selectedCode.textContent = li.dataset.code;
        countryDropdown.classList.remove('quote-open');
        validatePhone();
        evaluate();
    });
});

document.addEventListener('click', () => countryDropdown.classList.remove('quote-open'));

// ── Validators ──
function isValidName(v) {
    return v.trim().length >= 2 && /^[a-zA-Z\s'.,-]{2,}$/.test(v.trim());
}

function isValidCompany(v) {
    return v.trim().length >= 2;
}

function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function isValidPhone(v) {
    const digits = v.trim().replace(/[\s\-().]/g, '');
    return /^\d{7,15}$/.test(digits);
}

// ── Error helpers ──
function setErr(input, errEl, errTxtEl, msg, isPhoneRow) {
    const el = isPhoneRow ? phoneRow : input;
    if (msg) {
        errTxtEl.textContent = msg;
        errEl.classList.add('quote-show');
        el.classList.add('quote-error');
        el.classList.remove('quote-success');
    } else {
        errEl.classList.remove('quote-show');
        el.classList.remove('quote-error');
    }
}

function setSuccess(input, isPhoneRow) {
    const el = isPhoneRow ? phoneRow : input;
    el.classList.add('quote-success');
    el.classList.remove('quote-error');
}

// ── Per-field validate ──
function validateName(blur) {
    const v = nameInput.value;
    if (!v.trim()) {
        if (blur) setErr(nameInput, document.getElementById('quote-nameErr'), document.getElementById('quote-nameErrTxt'), 'Full name is required');
        else setErr(nameInput, document.getElementById('quote-nameErr'), document.getElementById('quote-nameErrTxt'), '');
        return false;
    }
    if (!isValidName(v)) {
        setErr(nameInput, document.getElementById('quote-nameErr'), document.getElementById('quote-nameErrTxt'), 'Enter a valid full name (letters only, min 2 chars)');
        return false;
    }
    setErr(nameInput, document.getElementById('quote-nameErr'), document.getElementById('quote-nameErrTxt'), '');
    setSuccess(nameInput);
    return true;
}

function validateCompany(blur) {
    const v = companyInput.value;
    if (!v.trim()) {
        if (blur) setErr(companyInput, document.getElementById('quote-companyErr'), document.getElementById('quote-companyErrTxt'), 'Company name is required');
        else setErr(companyInput, document.getElementById('quote-companyErr'), document.getElementById('quote-companyErrTxt'), '');
        return false;
    }
    if (!isValidCompany(v)) {
        setErr(companyInput, document.getElementById('quote-companyErr'), document.getElementById('quote-companyErrTxt'), 'Company name must be at least 2 characters');
        return false;
    }
    setErr(companyInput, document.getElementById('quote-companyErr'), document.getElementById('quote-companyErrTxt'), '');
    setSuccess(companyInput);
    return true;
}

function validateEmail(blur) {
    const v = userEmailInput.value;
    if (!v.trim()) {
        if (blur) setErr(userEmailInput, document.getElementById('quote-emailErr'), document.getElementById('quote-emailErrTxt'), 'Email address is required');
        else setErr(userEmailInput, document.getElementById('quote-emailErr'), document.getElementById('quote-emailErrTxt'), '');
        return false;
    }
    if (!isValidEmail(v)) {
        setErr(userEmailInput, document.getElementById('quote-emailErr'), document.getElementById('quote-emailErrTxt'), 'Enter a valid email (e.g. name@domain.com)');
        return false;
    }
    setErr(userEmailInput, document.getElementById('quote-emailErr'), document.getElementById('quote-emailErrTxt'), '');
    setSuccess(userEmailInput);
    return true;
}

function validatePhone(blur) {
    const v = userPhoneInput.value;
    if (!v.trim()) {
        if (blur) setErr(userPhoneInput, document.getElementById('quote-phoneErr'), document.getElementById('quote-phoneErrTxt'), 'Phone number is required', true);
        else setErr(userPhoneInput, document.getElementById('quote-phoneErr'), document.getElementById('quote-phoneErrTxt'), '', true);
        return false;
    }
    if (!isValidPhone(v)) {
        setErr(userPhoneInput, document.getElementById('quote-phoneErr'), document.getElementById('quote-phoneErrTxt'), 'Enter a valid phone number (7–15 digits)', true);
        return false;
    }
    setErr(userPhoneInput, document.getElementById('quote-phoneErr'), document.getElementById('quote-phoneErrTxt'), '', true);
    setSuccess(userPhoneInput, true);
    return true;
}

// ── Master evaluate ──
function evaluate() {
    const ok = validateName(false) && validateCompany(false) && validateEmail(false) && validatePhone(false);
    submitBtn.disabled = !ok;
    submitBtn.classList.toggle('quote-enabled', ok);
}

// ── Event listeners ──
nameInput.addEventListener('input', () => { validateName(false); evaluate(); });
nameInput.addEventListener('blur', () => { validateName(true); evaluate(); });

companyInput.addEventListener('input', () => { validateCompany(false); evaluate(); });
companyInput.addEventListener('blur', () => { validateCompany(true); evaluate(); });

userEmailInput.addEventListener('input', () => { validateEmail(false); evaluate(); });
userEmailInput.addEventListener('blur', () => { validateEmail(true); evaluate(); });

userPhoneInput.addEventListener('input', () => { validatePhone(false); evaluate(); });
userPhoneInput.addEventListener('blur', () => { validatePhone(true); evaluate(); });

// ── Submit ──
submitBtn.addEventListener('click', () => {
    if (!submitBtn.disabled) {
        nameInput.value = "";
        companyInput.value = "";
        userEmailInput.value = "";
        userPhoneInput.value = "";
        toastTitle.innerHTML = "Request sent successfully complete";
        toastSub.innerHTML = "Your call back request has been submitted successfully.";
        showToast();
        qouteOverlay.style.display = 'none'
    }
});

// ── Close ──
clsBtn.addEventListener('click', () => qouteOverlay.style.display = 'none');
qouteOverlay.addEventListener('click', (e) => { if (e.target === qouteOverlay) qouteOverlay.style.display = 'none'; });

