const glow = document.querySelector(".site-glow");
const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-counter]");
const modeToggle = document.querySelector(".mode-toggle");
const tiltItems = document.querySelectorAll("[data-tilt]");
const animeLines = document.querySelectorAll(".anime-line");

if (glow) {
    window.addEventListener("pointermove", (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
    });
}

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.2,
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const suffix = element.dataset.suffix || "";
    const valueNode = element.querySelector(".metric-value");

    if (!valueNode || Number.isNaN(target)) {
        return;
    }

    const duration = 1200;
    const start = performance.now();

    const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        valueNode.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.4,
    }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (modeToggle) {
    modeToggle.addEventListener("click", () => {
        const isActive = document.body.classList.toggle("anime-mode");
        modeToggle.setAttribute("aria-pressed", String(isActive));
    });
}

tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const rotateY = ((offsetX / rect.width) - 0.5) * 12;
        const rotateX = (0.5 - (offsetY / rect.height)) * 12;

        item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    item.addEventListener("pointerleave", () => {
        item.style.transform = "";
    });
});

if (animeLines.length > 1) {
    let activeIndex = 0;

    setInterval(() => {
        animeLines[activeIndex].classList.remove("is-active");
        activeIndex = (activeIndex + 1) % animeLines.length;
        animeLines[activeIndex].classList.add("is-active");
    }, 2800);
}
