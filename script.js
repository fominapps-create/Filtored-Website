// Email form submission
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    const submitButton = this.querySelector('button[type="submit"]');

    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Send to Formspree
    fetch('https://formspree.io/f/mgowevrg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (response.ok) {
            showMessage('Thank you! We\'ll notify you when we launch.', 'success');
            emailInput.value = '';
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Something went wrong. Please try again.', 'error');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Notify Me';
    });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(text, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const message = document.createElement('div');
    message.className = message ;
    message.textContent = text;

    // Style based on type
    message.style.cssText = 
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        animation: slideIn 0.3s ease;
        
    ;

    // Insert after form
    const form = document.getElementById('emailForm');
    form.parentNode.insertBefore(message, form.nextSibling);

    // Remove after 5 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Add smooth scrolling for any future links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
