document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollUp();
    setActiveNavLink();
    console.log('Common functionality loaded.');
});

// ===== MOBILE NAVIGATION TOGGLE =====
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// ===== SCROLL UP BUTTON =====
function initScrollUp() {
    const scrollUp = document.getElementById('scroll-up');

    if (scrollUp) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollUp.classList.add('show');
            } else {
                scrollUp.classList.remove('show');
            }
        });

        scrollUp.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== SET ACTIVE NAV LINK =====
function setActiveNavLink() {
    // Get file name (e.g., "services.html" or "index.html")
    const path = window.location.pathname;
    const page = path.split("/").pop(); 

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');

        // Check for exact match or index root match
        if (linkPage === page || (page === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}