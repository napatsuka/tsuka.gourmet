// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all news items and pickup items
document.querySelectorAll('.news-item, .pickup-item, .animation-item').forEach(el => {
    observer.observe(el);
});

// Active nav link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav a[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});

// Add some interactive feedback and make .news-item clickable
document.querySelectorAll('.news-item').forEach(item => {
    const link = item.querySelector('h3 a');
    if (link) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            if (e.target.closest('a')) return; // let real links behave normally
            window.open(link.href, '_blank', 'noopener,noreferrer');
        });
    }
});

document.querySelectorAll('.pickup-item').forEach(item => {
    item.addEventListener('click', function() {
        console.log('Pickup item clicked');
    });
});

// Make .news-content clickable: click the content area to open the h3 > a link in a new tab
document.querySelectorAll('.news-content').forEach(div => {
    const link = div.querySelector('h3 a');
    if (!link) return;
    div.style.cursor = 'pointer';
    div.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // let real links behave normally
        window.open(link.href, '_blank', 'noopener,noreferrer');
    });
});
