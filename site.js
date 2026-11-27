// Filtored site scripts, shared by every page.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile navigation
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        });
        nav.querySelectorAll('.nav-menu a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Scroll reveals
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el, i) {
            // Stagger siblings that enter together.
            el.style.transitionDelay = (i % 4) * 70 + 'ms';
            io.observe(el);
        });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
    }

    // "Find anything": each query swaps the phone screen; cycles on its own until the visitor picks one.
    var queries = Array.prototype.slice.call(document.querySelectorAll('.query'));
    var screens = document.querySelectorAll('.search-phone [data-screen]');
    var CYCLE_MS = 4500;
    var cycleTimer = null;
    var current = 0;

    function showQuery(index, timed) {
        current = index;
        queries.forEach(function (q, i) {
            var on = i === index;
            q.classList.toggle('is-on', on);
            q.classList.toggle('is-timed', on && timed);
            q.setAttribute('aria-selected', String(on));
        });
        var target = queries[index].dataset.target;
        screens.forEach(function (s) {
            var on = s.dataset.screen === target;
            s.classList.toggle('is-on', on);
            if (s.tagName === 'VIDEO') playScreen(s, on);
        });
    }

    // Screen clips start over each time their query comes up; reduced motion shows the last frame instead.
    function playScreen(video, on) {
        if (!on) { video.pause(); return; }
        if (reduceMotion) {
            video.preload = 'auto';
            var toEnd = function () { video.currentTime = Math.max(0, video.duration - 0.05); };
            if (video.readyState >= 1) toEnd(); else video.addEventListener('loadedmetadata', toEnd, { once: true });
            return;
        }
        video.currentTime = 0;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
    }

    function stopCycle() {
        clearInterval(cycleTimer);
        cycleTimer = null;
        queries.forEach(function (q) { q.classList.remove('is-timed'); });
    }

    function startCycle() {
        if (reduceMotion || cycleTimer || !queries.length) return;
        document.documentElement.style.setProperty('--q-time', CYCLE_MS + 'ms');
        showQuery(current, true);
        cycleTimer = setInterval(function () {
            showQuery((current + 1) % queries.length, true);
        }, CYCLE_MS);
    }

    queries.forEach(function (q, i) {
        q.addEventListener('click', function () {
            stopCycle();
            showQuery(i, false);
        });
        q.addEventListener('keydown', function (e) {
            var next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
            if (!next) return;
            e.preventDefault();
            stopCycle();
            var n = (i + next + queries.length) % queries.length;
            showQuery(n, false);
            queries[n].focus();
        });
    });

    var searchSection = document.getElementById('search');
    if (searchSection && 'IntersectionObserver' in window) {
        var started = false;
        new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !started) {
                started = true;
                screens.forEach(function (s) { if (s.tagName === 'VIDEO') s.preload = 'auto'; });
                startCycle();
            }
        }, { threshold: 0.35 }).observe(searchSection);
    }

    // AI capabilities: one short scene per capability. Scenes autoplay while the demo is on screen;
    // picking a tab jumps to that scene and stops the autoplay. Each scene's CSS animations restart when it comes on.
    var aiDemo = document.querySelector('.ai-demo');
    if (aiDemo) {
        var AI_MS = 6500;
        var aiTabs = Array.prototype.slice.call(aiDemo.querySelectorAll('.ai-tab'));
        var aiScenes = aiDemo.querySelectorAll('.ai-scene');
        var aiCaptions = aiDemo.querySelectorAll('.ai-caption');
        var aiQuery = aiDemo.querySelector('.ai-q');
        var aiText = aiQuery ? aiQuery.textContent : '';
        var aiIndex = 0;
        var aiAuto = !reduceMotion;
        var aiInView = false;
        var aiNext = null;
        var typeWait = null;
        var typeTimer = null;

        aiDemo.style.setProperty('--ai-time', AI_MS + 'ms');

        var typeQuery = function () {
            clearTimeout(typeWait);
            clearInterval(typeTimer);
            if (!aiQuery || reduceMotion) return;
            aiQuery.textContent = '';
            typeWait = setTimeout(function () {
                var n = 0;
                typeTimer = setInterval(function () {
                    aiQuery.textContent = aiText.slice(0, ++n);
                    if (n >= aiText.length) clearInterval(typeTimer);
                }, 45);
            }, 350);
        };

        var countUp = function (scene) {
            scene.querySelectorAll('[data-count]').forEach(function (el) {
                var to = Number(el.dataset.count);
                if (reduceMotion) { el.textContent = to.toLocaleString('en-US'); return; }
                var t0 = null;
                var step = function (t) {
                    if (t0 === null) t0 = t;
                    var k = Math.min(1, Math.max(0, (t - t0 - 450) / 1300));
                    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US');
                    if (k < 1) requestAnimationFrame(step);
                };
                el.textContent = '0';
                requestAnimationFrame(step);
            });
        };

        var schedule = function () {
            clearTimeout(aiNext);
            if (aiAuto && aiInView) aiNext = setTimeout(function () { showScene((aiIndex + 1) % aiScenes.length); }, AI_MS);
        };

        var showScene = function (index) {
            aiIndex = index;
            aiTabs.forEach(function (t, i) {
                t.classList.remove('is-timed');
                t.classList.toggle('is-on', i === index);
                t.setAttribute('aria-pressed', String(i === index));
            });
            aiScenes.forEach(function (sc, i) {
                sc.classList.remove('is-on');
                sc.setAttribute('aria-hidden', String(i !== index));
            });
            void aiDemo.offsetWidth; // let the scene's animations start over
            aiScenes[index].classList.add('is-on');
            if (aiAuto) aiTabs[index].classList.add('is-timed');
            aiCaptions.forEach(function (c, i) { c.classList.toggle('is-on', i === index); });
            if (aiScenes[index].contains(aiQuery)) typeQuery();
            if (aiScenes[index].querySelector('[data-count]')) countUp(aiScenes[index]);
            schedule();
        };

        aiTabs.forEach(function (t, i) {
            t.addEventListener('click', function () {
                aiAuto = false;
                showScene(i);
            });
        });

        if ('IntersectionObserver' in window) {
            // load the sprite sheets shortly before the demo scrolls in
            new IntersectionObserver(function (entries, obs) {
                if (!entries[0].isIntersecting) return;
                aiDemo.classList.add('is-near');
                obs.disconnect();
            }, { rootMargin: '600px 0px' }).observe(aiDemo);

            new IntersectionObserver(function (entries) {
                aiInView = entries[0].isIntersecting;
                if (!aiInView) { clearTimeout(aiNext); return; }
                // (re)play the current scene each time the demo comes back into view
                showScene(aiIndex);
            }, { threshold: 0.45 }).observe(aiDemo.querySelector('.ai-screen'));
        } else {
            aiDemo.classList.add('is-near');
        }
    }

    // Customize: the picked look moves to the front.
    var stage = document.querySelector('.theme-stage');
    var lookButtons = document.querySelectorAll('.look-buttons button');
    var modeSpans = document.querySelectorAll('.mode-switch span');
    var LOOK_INFO = [
        { dark: true, accent: '#22C55E' },
        { dark: false, accent: '#3B82F6' },
        { dark: true, accent: '#EC4899' }
    ];

    function showLook(index) {
        if (!stage) return;
        var phones = stage.querySelectorAll('.theme-phone');
        var left = (index + 2) % 3;
        var right = (index + 1) % 3;
        phones.forEach(function (p) {
            var look = Number(p.dataset.look);
            p.classList.toggle('pos-c', look === index);
            p.classList.toggle('pos-l', look === left);
            p.classList.toggle('pos-r', look === right);
        });
        lookButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.look) === index)); });
        var info = LOOK_INFO[index];
        modeSpans.forEach(function (s) { s.classList.toggle('is-on', (s.dataset.mode === 'dark') === info.dark); });
        document.querySelector('.theme-controls').style.setProperty('--look-accent', info.accent);
    }

    // Looks rotate on their own while in view, until a look is picked by hand.
    var LOOK_MS = 4000;
    var lookIndex = 1;
    var lookAuto = !reduceMotion;
    var lookTimer = null;

    function stopLooks() { clearInterval(lookTimer); lookTimer = null; }
    function startLooks() {
        if (!lookAuto || lookTimer) return;
        lookTimer = setInterval(function () {
            lookIndex = (lookIndex + 1) % 3;
            showLook(lookIndex);
        }, LOOK_MS);
    }
    function pickLook(index) {
        lookAuto = false;
        stopLooks();
        lookIndex = index;
        showLook(index);
    }

    lookButtons.forEach(function (b) {
        b.addEventListener('click', function () { pickLook(Number(b.dataset.look)); });
    });
    if (stage) {
        stage.querySelectorAll('.theme-phone').forEach(function (p) {
            p.addEventListener('click', function () { pickLook(Number(p.dataset.look)); });
        });
        showLook(lookIndex);
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) startLooks(); else stopLooks();
            }, { threshold: 0.4 }).observe(stage);
        }
    }

    // Video guides: the YouTube player loads in a near full-screen overlay only after Play; arrows step through the guides.
    var guideDialog = document.querySelector('.guide-dialog');
    var guideFrame = guideDialog && guideDialog.querySelector('.guide-frame');
    var guideBtns = Array.prototype.slice.call(document.querySelectorAll('.guide-btn'));
    var guideIndex = 0;

    // On phones the guide row is a carousel: one card in the middle, arrows instead of a scrollbar.
    var guideRow = document.querySelector('.guide-row');
    var guideCards = guideRow ? Array.prototype.slice.call(guideRow.children) : [];
    var guidePrev = document.querySelector('.guide-arrow-prev');
    var guideNext = document.querySelector('.guide-arrow-next');
    var carouselQuery = window.matchMedia('(max-width: 560px)');
    var centerIndex = 0;
    function carouselOn() { return carouselQuery.matches; }
    function markCenter() {
        if (!guideRow) return;
        var rowRect = guideRow.getBoundingClientRect();
        var mid = rowRect.left + rowRect.width / 2;
        var best = 0;
        var bestDist = Infinity;
        guideCards.forEach(function (card, i) {
            var r = card.getBoundingClientRect();
            var d = Math.abs(r.left + r.width / 2 - mid);
            if (d < bestDist) { bestDist = d; best = i; }
        });
        centerIndex = best;
        guideCards.forEach(function (card, i) { card.classList.toggle('is-center', i === best); });
        if (guidePrev) guidePrev.disabled = best === 0;
        if (guideNext) guideNext.disabled = best === guideCards.length - 1;
    }
    function centerGuide(i) {
        var card = guideCards[Math.max(0, Math.min(guideCards.length - 1, i))];
        var r = card.getBoundingClientRect();
        var rowRect = guideRow.getBoundingClientRect();
        guideRow.scrollBy({ left: r.left + r.width / 2 - (rowRect.left + rowRect.width / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (guideRow) {
        var markQueued = false;
        guideRow.addEventListener('scroll', function () {
            if (markQueued) return;
            markQueued = true;
            requestAnimationFrame(function () { markQueued = false; markCenter(); });
        }, { passive: true });
        window.addEventListener('resize', markCenter);
        if (guidePrev) guidePrev.addEventListener('click', function () { centerGuide(centerIndex - 1); });
        if (guideNext) guideNext.addEventListener('click', function () { centerGuide(centerIndex + 1); });
        markCenter();
    }
    function closeGuide() { if (guideDialog.open) guideDialog.close(); }
    function openGuide(i) {
        guideIndex = (i + guideBtns.length) % guideBtns.length;
        var btn = guideBtns[guideIndex];
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + btn.dataset.video + '?autoplay=1&playsinline=1&rel=0';
        frame.title = btn.getAttribute('aria-label').replace(/^Play the /, '');
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        guideFrame.replaceChildren(frame);
        guideDialog.setAttribute('aria-label', frame.title + ' (' + (guideIndex + 1) + ' of ' + guideBtns.length + ')');
        if (!guideDialog.open) guideDialog.showModal();
        if (carouselOn()) centerGuide(guideIndex);
    }
    if (guideDialog && guideDialog.showModal) {
        guideBtns.forEach(function (btn, i) {
            btn.addEventListener('click', function () {
                // phone carousel: a faded side card comes to the middle first
                if (carouselOn() && !btn.parentElement.classList.contains('is-center')) { centerGuide(i); return; }
                openGuide(i);
            });
        });
        guideDialog.querySelector('.guide-prev').addEventListener('click', function () { openGuide(guideIndex - 1); });
        guideDialog.querySelector('.guide-next').addEventListener('click', function () { openGuide(guideIndex + 1); });
        guideDialog.querySelector('.guide-close').addEventListener('click', closeGuide);
        guideDialog.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); openGuide(guideIndex - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); openGuide(guideIndex + 1); }
            if (e.key === 'Escape') { e.preventDefault(); closeGuide(); }
        });
        // a click on the dimmed backdrop (the dialog itself, outside the player and buttons) closes it
        guideDialog.addEventListener('click', function (e) { if (e.target === guideDialog) closeGuide(); });
        // removing the player stops the video
        guideDialog.addEventListener('close', function () { guideFrame.replaceChildren(); });
    } else {
        guideBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                window.open('https://www.youtube.com/watch?v=' + btn.dataset.video, '_blank', 'noopener');
            });
        });
    }

    // Footer signup
    var form = document.querySelector('.foot-signup');
    if (form && window.fetch) {
        var status = form.querySelector('.foot-status');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            status.textContent = 'Sending...';
            fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
                .then(function (res) {
                    if (!res.ok) throw new Error('Request failed');
                    form.reset();
                    status.textContent = "Thanks! You're on the list.";
                })
                .catch(function () {
                    status.textContent = 'Something went wrong. Please try again.';
                });
        });
    }

    // Cookie consent: PostHog starts opted out and only captures after Accept.
    var CONSENT_KEY = 'cookie-consent';
    var applyConsent = function (value) {
        if (!window.posthog) return;
        if (value === 'accepted') window.posthog.opt_in_capturing();
        else if (value === 'declined') window.posthog.opt_out_capturing();
    };
    var savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent) {
        applyConsent(savedConsent);
    } else {
        var depth = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean).length;
        var banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML = '<p>We use a privacy-friendly analytics tool to see how people use this site. No data is sold. See our <a href="' + '../'.repeat(depth) + 'privacy/">Privacy Policy</a>.</p>' +
            '<div class="cookie-actions"><button type="button" class="btn btn-ghost btn-sm" data-consent="declined">Decline</button><button type="button" class="btn btn-solid btn-sm" data-consent="accepted">Accept</button></div>';
        banner.querySelectorAll('[data-consent]').forEach(function (b) {
            b.addEventListener('click', function () {
                localStorage.setItem(CONSENT_KEY, b.dataset.consent);
                applyConsent(b.dataset.consent);
                banner.remove();
            });
        });
        document.body.appendChild(banner);
    }
})();
