// Black November promo. Runs in <head> so promo styles apply before first paint.
// Active from Nov 1 until Dec 1, 2026 (visitor's local time); after that the site
// falls back to regular pricing automatically and the banner never renders.
(function () {
    var start = new Date(2026, 10, 1);
    var end = new Date(2026, 11, 1);
    var now = new Date();
    var active = now >= start && now < end;
    var root = document.documentElement;

    window.filtoredPromo = { active: active, yearlyDiscount: 0.4, endsAt: end };
    if (!active) return;

    root.classList.add('promo-active');
    var script = document.currentScript;
    var wantsBanner = Boolean(script && script.hasAttribute('data-banner'));
    if (wantsBanner) root.classList.add('has-promo-banner');

    var unitLabels = {
        en: ['d', 'h', 'm', 's'],
        ru: ['д', 'ч', 'м', 'с'],
        he: [' ימ׳', ' שע׳', ' דק׳', ' שנ׳']
    };

    function startCountdowns() {
        var countdowns = document.querySelectorAll('[data-promo-countdown]');
        if (!countdowns.length) return;
        var timer;
        function tick() {
            var remaining = end - new Date();
            if (remaining <= 0) {
                clearInterval(timer);
                window.location.reload();
                return;
            }
            var total = Math.floor(remaining / 1000);
            var values = [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60];
            var labels = unitLabels[root.lang] || unitLabels.en;
            var html = values.map(function (value, index) {
                if (index === 0 && value === 0) return '';
                var text = index === 0 ? String(value) : String(value).padStart(2, '0');
                return '<span class="cd-part"><b>' + text + '</b>' + labels[index] + '</span>';
            }).join('');
            countdowns.forEach(function (element) {
                if (element.innerHTML !== html) element.innerHTML = html;
            });
        }
        tick();
        timer = setInterval(tick, 1000);
    }

    // The banner scrolls away while the fixed navbar slides up to take its place.
    function setUpBanner() {
        var banner = document.querySelector('.promo-banner');
        if (!banner) {
            root.classList.remove('has-promo-banner');
            return;
        }
        var height = 0;
        function measure() {
            height = banner.offsetHeight;
            root.style.setProperty('--promo-h', height + 'px');
            update();
        }
        function update() {
            root.style.setProperty('--promo-offset', Math.max(0, height - window.scrollY) + 'px');
        }
        measure();
        window.addEventListener('scroll', update, { passive: true });
        if (window.ResizeObserver) new ResizeObserver(measure).observe(banner);
        else window.addEventListener('resize', measure);
    }

    document.addEventListener('DOMContentLoaded', function () {
        startCountdowns();
        if (wantsBanner) setUpBanner();
    });
})();
