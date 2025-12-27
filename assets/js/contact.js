document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            // Simple mailto trigger for the real user site
            window.location.href = `mailto:pptsbpbangi@gmail.com?subject=Contact from ${name}&body=${message}`;
        });
    }
});