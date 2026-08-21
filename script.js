// Reveal-on-scroll for sections
(function () {
    const targets = document.querySelectorAll('.private-inner, .strip, .cta, .hero-copy, .hero-shot');
    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
})();

// Staggered slide-up for feature cards
(function () {
    const grid = document.querySelector('.cards');
    if (!grid) return;
    const cards = grid.querySelectorAll('.card');
    cards.forEach(function (el) { el.classList.add('reveal'); });

    function showAll() {
        cards.forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('in');
                // drop reveal classes once done so hover transitions stay snappy
                setTimeout(function () { el.classList.remove('reveal', 'in'); }, 900);
            }, i * 220);
        });
    }

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    const io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            showAll();
            io.disconnect();
        }
    }, { threshold: 0.2 });

    io.observe(grid);
})();

// Fade-up for zigzag panels as they scroll into view
(function () {
    const rows = document.querySelectorAll('.zig-row');
    if (!rows.length) return;

    if (!('IntersectionObserver' in window)) {
        rows.forEach(function (el) { el.classList.add('zig-visible'); });
        return;
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('zig-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    rows.forEach(function (el) { io.observe(el); });
})();

// Hero banner slideshow with dots
(function () {
    const track = document.querySelector('.cta-slides');
    const dotsWrap = document.getElementById('ctaDots');
    if (!track || !dotsWrap) return;

    const slides = Array.prototype.slice.call(track.querySelectorAll('.cta-slide'));
    const count = slides.length;
    if (count < 2) return;

    // clone of the first photo, so the last one keeps sliding forward into it
    const clone = slides[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.alt = '';
    track.appendChild(clone);

    const total = count + 1;
    const step = 100 / total;
    let index = 0;
    let timer;

    track.style.width = (total * 100) + '%';
    slides.concat(clone).forEach(function (s) { s.style.width = step + '%'; });

    const dots = slides.map(function (_, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'cta-dot';
        dot.setAttribute('aria-label', 'Show photo ' + (i + 1));
        dot.addEventListener('click', function () { go(i); restart(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function move(i, animate) {
        track.style.transition = animate ? '' : 'none';
        track.style.transform = 'translateX(-' + (i * step) + '%)';
        if (!animate) void track.offsetWidth;
    }

    function go(i) {
        index = i;
        move(index, true);
        const active = index % count;
        dots.forEach(function (d, n) { d.setAttribute('aria-current', String(n === active)); });
    }

    track.addEventListener('transitionend', function () {
        if (index === count) {
            index = 0;
            move(0, false);
            track.style.transition = '';
        }
    });

    function restart() {
        clearInterval(timer);
        timer = setInterval(function () { go(index + 1); }, 7000);
    }

    go(0);
    restart();
})();


