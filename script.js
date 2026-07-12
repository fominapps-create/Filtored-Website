// Reveal-on-scroll for sections
(function () {
    const targets = document.querySelectorAll('.feature, .private-inner, .strip, .cta, .hero-copy, .hero-shot');
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

// Email form submission (Formspree)
document.getElementById('emailForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    const submitButton = this.querySelector('button[type="submit"]');

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    fetch('https://formspree.io/f/mgowevrg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, _subject: 'Notify when launch' })
    })
        .then(function (response) {
            if (response.ok) {
                showMessage("You're on the list. We'll be in touch at launch.", 'success');
                emailInput.value = '';
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(function () {
            showMessage('Something went wrong. Please try again.', 'error');
        })
        .finally(function () {
            submitButton.disabled = false;
            submitButton.textContent = 'Notify me';
        });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.className = 'message ' + type;
    message.textContent = text;

    const ok = type === 'success';
    message.style.cssText =
        'margin-top:1rem;padding:0.9rem 1.2rem;border-radius:12px;text-align:center;font-size:0.95rem;' +
        'background:' + (ok ? '#e7f6ec' : '#fdeaea') + ';' +
        'color:' + (ok ? '#1e6b3a' : '#a13030') + ';';

    const form = document.getElementById('emailForm');
    form.parentNode.insertBefore(message, form.nextSibling);

    setTimeout(function () {
        message.style.transition = 'opacity 0.3s ease';
        message.style.opacity = '0';
        setTimeout(function () { message.remove(); }, 300);
    }, 5000);
}
