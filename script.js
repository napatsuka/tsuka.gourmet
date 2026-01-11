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

// Attempt to load shop images from shop page (og:image) using a public scrape endpoint.
// NOTE: This uses an external scraping service and may fail or be rate-limited; it's a best-effort enhancement.
async function fetchOgImage(pageUrl, timeoutMs = 5000) {
    const proxy = 'https://r.jina.ai/http://'; // scrapes and returns HTML as text
    // build a safe proxy target by stripping leading protocol (http:// or https://)
    const target = pageUrl.replace(/^https?:\/\//i, '');
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(proxy + target, { signal: controller.signal });
        clearTimeout(id);
        if (!res.ok) {
            console.warn('og image fetch returned non-ok status', res.status, proxy + target);
            return null;
        }
        const text = await res.text();
        // Look for og:image or twitter:image
        const ogMatch = text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        if (ogMatch && ogMatch[1]) return ogMatch[1];
        const twMatch = text.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
        if (twMatch && twMatch[1]) return twMatch[1];
        return null;
    } catch (err) {
        if (err.name === 'AbortError') console.warn('og image fetch timed out for', pageUrl);
        else console.warn('og image fetch failed for', pageUrl, err);
        return null;
    }
}

// For each .pickup-item link, try to fetch og:image and replace the <img>
document.addEventListener('DOMContentLoaded', () => {
    // Limit concurrency and set per-request timeout to avoid long hangs
    const anchors = Array.from(document.querySelectorAll('.pickup-item a[href]'));
    const concurrency = 3;
    let idx = 0;

    async function worker() {
        while (idx < anchors.length) {
            const i = idx++;
            const anchor = anchors[i];
            const pageUrl = anchor.href;
            const imgEl = anchor.querySelector('img');
            if (!imgEl) continue;
            try {
                const ogImg = await fetchOgImage(pageUrl, 4000); // 4s timeout
                if (ogImg) {
                    const src = ogImg.startsWith('http') ? ogImg : 'https:' + ogImg;
                    imgEl.src = src;
                    imgEl.onerror = () => {
                        console.warn('Failed to load og:image', src);
                    };
                }
            } catch (e) {
                console.warn('worker error', e);
            }
        }
    }

    // start workers
    const workers = [];
    for (let i = 0; i < concurrency; i++) workers.push(worker());
});
