// assets/js/home.js
import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    loadAnnouncements(); 
});

/* =========================================
   1. CAROUSEL LOGIC (Unchanged)
   ========================================= */
let currentSlide = 0;
let carouselInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorContainer = document.getElementById('carousel-indicators');
    if (slides.length === 0 || !indicatorContainer) return;

    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetCarouselTimer();
        });
        indicatorContainer.appendChild(indicator);
    });
    startCarouselAutoPlay();
}

function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => nextSlide(), 5000);
}

function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarouselAutoPlay();
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() { currentSlide++; showSlide(currentSlide); }
function goToSlide(n) { currentSlide = n; showSlide(currentSlide); }


/* =========================================
   2. SUPABASE CONTENT LOGIC
   ========================================= */

async function loadAnnouncements() {
    const container = document.getElementById('announcement-container');
    if (!container) return;

    try {
        // Fetch data from 'announcements' table, ordered by creation time
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderCards(container, data);

    } catch (error) {
        console.error("Error loading updates:", error.message);
        container.innerHTML = '<p style="text-align:center; color:red;">Unable to load updates.</p>';
    }
}

function renderCards(container, data) {
    container.innerHTML = ''; 

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #888; padding: 2rem;">
                <p>No announcements at the moment.</p>
            </div>`;
        return;
    }

    data.forEach(item => {
        // Fallback for missing image
        const bgImage = item.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500';

        const cardHTML = `
            <div class="announcement-card ${item.type || 'event'}">
                <div class="announcement-header" style="background-image: linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('${bgImage}')"></div>
                <div class="announcement-body">
                    <span class="announcement-badge">${item.category || 'Update'}</span>
                    <h3>${item.title || 'Untitled'}</h3>
                    <p>${item.description || ''}</p>
                    <div class="announcement-meta">
                        <span>${item.meta || 'Recent'}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}