// Email form submission
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Here you would typically send this to your backend
    // For now, we'll just show a success message
    console.log('Email submitted:', email);
    
    // Show success message
    showMessage('Thank you! We\'ll notify you when we launch.', 'success');
    
    // Clear the form
    emailInput.value = '';
    
    // Optional: Send to a service like Mailchimp, ConvertKit, or your own backend
    // Example with fetch:
    /*
    fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Thank you! We\'ll notify you when we launch.', 'success');
        emailInput.value = '';
    })
    .catch(error => {
        showMessage('Something went wrong. Please try again.', 'error');
    });
    */
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
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Style based on type
    message.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        animation: slideIn 0.3s ease;
        ${type === 'success' 
            ? 'background: #d1fae5; color: #065f46;' 
            : 'background: #fee2e2; color: #991b1b;'}
    `;
    
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
