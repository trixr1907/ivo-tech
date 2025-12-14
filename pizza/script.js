

document.addEventListener('DOMContentLoaded', () => {
    console.log("Ristorante Luna Rossa - Menu Book v2.5 SOTA Initialized");

    // --- DOM Elements ---
    const book = document.getElementById('book');
    const bookActionBtn = document.getElementById('book-action-btn');
    const papers = document.querySelectorAll('.paper-sheet');
    
    // --- State ---
    let isOpen = false;
    let currentLocation = 1;
    const numOfPapers = papers.length;
    const maxLocation = numOfPapers + 1;

    // --- Initialization ---
    // Set initial Z-indexes for Right Stack (Top to Bottom)
    papers.forEach((paper, index) => {
        paper.style.zIndex = numOfPapers - index;
    });

    // --- Book Open/Close Logic ---
    function setBookState(open) {
        isOpen = open;
        if (isOpen) {
            book.classList.add('state-open');
            if(bookActionBtn) bookActionBtn.innerHTML = "Karte schließen ↩";
        } else {
            book.classList.remove('state-open');
            if(bookActionBtn) bookActionBtn.innerHTML = "Karte öffnen ✨";
            
            // Auto-Reset pages when closing book? 
            // setTimeout(resetPages, 500); // Optional: Close all pages
        }
    }

    if (bookActionBtn) {
        bookActionBtn.addEventListener('click', () => setBookState(!isOpen));
    }
    
    // Click on Cover also opens it
    const cover = document.querySelector('.hardcover-front');
    if(cover) {
        cover.addEventListener('click', () => {
            if(!isOpen) setBookState(true);
        });
    }

    // --- Page Flipping Logic ---
    function goNextPage() {
        if (currentLocation < maxLocation) {
            const currentPaper = papers[currentLocation - 1]; // Array is 0-indexed
            
            // 1. Add flip class
            currentPaper.classList.add('flipped');
            
            // 2. Update Z-Index for Left Stack Stacking (Reverse logic)
            // Left stack needs to stack up. 
            // Page 1 is bottom, Page 2 is on top.
            currentPaper.style.zIndex = currentLocation; 

            currentLocation++;
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            const prevPaper = papers[currentLocation - 2];
            
            // 1. Remove flip class
            prevPaper.classList.remove('flipped');
            
            // 2. Reset Z-Index for Right Stack Stacking
            // Right stack: Page 1 is Top (limit), Page 2 is below.
            const originalIndex = currentLocation - 2;
            prevPaper.style.zIndex = numOfPapers - originalIndex;

            currentLocation--;
        }
    }

    // --- Wire up Corner Clicks ---
    // Front Side Corners -> Next Page
    document.querySelectorAll('.page.front-side .corner-hitbox').forEach(hitbox => {
        hitbox.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger other clicks
            goNextPage();
        });
    });

    // Back Side Corners -> Prev Page
    document.querySelectorAll('.page.back-side .corner-hitbox').forEach(hitbox => {
        hitbox.addEventListener('click', (e) => {
            e.stopPropagation();
            goPrevPage();
        });
    });


    // --- Cinematic Parallax for Hero ---
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Stop calculating if scrolled past hero (performance)
        if (scrolled < 1000) {
            // Text moves slower (0.4x speed)
            if(heroContent) heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            // Image moves slightly faster than text but slower than scroll (0.2x)
            if(heroImage) heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });

    // --- Vanilla Tilt Integration (Optional polish) ---
    // Only tilt when closed to avoid layout jumping when open
    if(book) {
        book.addEventListener('mousemove', (e) => {
            if(isOpen) return; // Disable tilt when open
            
            const rect = book.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            // Apply slight tilt
            book.style.transform = `rotateX(${10 + rotateX}deg) rotateY(${rotateY}deg) rotateZ(-5deg)`;
        });

        book.addEventListener('mouseleave', () => {
            if(isOpen) return;
            // Reset to default closed state
            book.style.transform = `rotateX(10deg) rotateY(0deg) rotateZ(-5deg)`;
        });
    }

});
