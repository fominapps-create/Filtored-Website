// Black November promo. Runs in <head> so promo styles apply before first paint.
// Active from Nov 1 until Dec 1, 2026 (visitor's local time); after that the site
// falls back to regular pricing automatically and the banner never renders.
// Opt-in per page: data-banner shows the top banner, data-popup shows the offer
// popup once per browser session (keep it off legal/contact pages).
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
    var wantsPopup = Boolean(script && script.hasAttribute('data-popup'));
    var scriptUrl = script ? script.src : window.location.href;

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

    var popupText = {
        en: { tag: 'Black November Special', deal: '40% OFF', plan: 'Premium yearly', text: 'Your gallery deserves an upgrade. Get Premium for 40% less and enjoy unlimited cleanup tools, unlimited unique profiles and the complete Filtored experience.', cta: 'Get the deal on Google Play', plans: 'See plans', close: 'Close' },
        ru: { tag: 'Спецпредложение Чёрного ноября', deal: 'Скидка 40%', plan: 'на годовой Premium', text: 'Ваша галерея заслуживает большего. Получите Premium на 40% дешевле и пользуйтесь безлимитными инструментами очистки, неограниченным числом уникальных профилей и всеми возможностями Filtored.', cta: 'Получить скидку в Google Play', plans: 'Смотреть тарифы', close: 'Закрыть' },
        he: { tag: 'מבצע מיוחד לנובמבר השחור', deal: '40% הנחה', plan: 'על Premium שנתי', text: 'הגלריה שלכם ראויה לשדרוג. קבלו Premium ב-40% פחות ותיהנו מכלי ניקוי ללא הגבלה, פרופילים ייחודיים ללא הגבלה וחוויית Filtored המלאה.', cta: 'למימוש ההנחה ב-Google Play', plans: 'לצפייה בתוכניות', close: 'סגירה' }
    };
    var POPUP_SEEN_KEY = 'filtored-promo-popup-seen';

    function popupAlreadySeen() {
        try { return sessionStorage.getItem(POPUP_SEEN_KEY) === '1'; } catch (error) { return false; }
    }

    function showPopup() {
        if (popupAlreadySeen()) return;
        try { sessionStorage.setItem(POPUP_SEEN_KEY, '1'); } catch (error) { /* storage blocked: show anyway */ }

        var t = popupText[root.lang] || popupText.en;
        var pricingHref = new URL('pricing/?period=yearly', scriptUrl).href;
        var previousFocus = document.activeElement;
        var popup = document.createElement('div');
        popup.className = 'promo-popup';
        popup.innerHTML =
            '<div class="promo-popup-card" role="dialog" aria-modal="true" aria-labelledby="promoPopupTitle" aria-describedby="promoPopupText">' +
                '<button class="promo-popup-close" type="button" aria-label="' + t.close + '"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
                '<p class="promo-popup-kicker">' + t.tag + '</p>' +
                '<h2 class="promo-popup-title" id="promoPopupTitle">' +
                    '<span class="promo-popup-deal promo-sparkles"><span class="promo-gold-text">' + t.deal + '</span></span>' +
                    '<span class="promo-popup-plan">' + t.plan + '</span>' +
                '</h2>' +
                '<p class="promo-popup-text" id="promoPopupText">' + t.text + '</p>' +
                '<a class="promo-popup-cta" href="https://play.google.com/store/apps/details?id=com.filtored.gallery" target="_blank" rel="noopener noreferrer">' + t.cta + '</a>' +
                '<a class="promo-popup-plans" href="' + pricingHref + '">' + t.plans + '</a>' +
            '</div>';
        document.body.appendChild(popup);
        root.classList.add('promo-popup-open');

        var focusable = popup.querySelectorAll('button, a[href]');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        function close() {
            document.removeEventListener('keydown', onKeydown);
            root.classList.remove('promo-popup-open');
            popup.classList.add('is-closing');
            setTimeout(function () { popup.remove(); }, 200);
            if (previousFocus && previousFocus.focus) previousFocus.focus();
        }

        function onKeydown(event) {
            if (event.key === 'Escape') {
                close();
            } else if (event.key === 'Tab') {
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        popup.addEventListener('click', function (event) {
            if (event.target === popup || event.target.closest('.promo-popup-close, .promo-popup-cta')) close();
        });
        document.addEventListener('keydown', onKeydown);
        popup.querySelector('.promo-popup-cta').focus({ preventScroll: true });
    }

    document.addEventListener('DOMContentLoaded', function () {
        startCountdowns();
        if (wantsBanner) setUpBanner();
        if (wantsPopup && !popupAlreadySeen()) setTimeout(showPopup, 1200);
    });
})();
