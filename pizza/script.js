document.addEventListener('DOMContentLoaded', () => {
    // Scrollytelling Configuration
    const layers = [
        { id: 'bg-ingredients', doodles: ['doodle-tomato', 'doodle-mushroom', 'doodle-pepper'], count: 25 },
        { id: 'bg-oven', doodles: ['doodle-flame', 'doodle-pizza-whole'], count: 30 },
        { id: 'bg-enjoy', doodles: ['doodle-pizza-slice', 'doodle-box', 'doodle-drink'], count: 25 }
    ];

    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    // Initialize Doodles for each layer
    layers.forEach(layer => {
        const container = document.getElementById(layer.id);
        if(!container) return;

        for (let i = 0; i < layer.count; i++) {
            createDoodle(container, layer.doodles);
        }
    });

    function createDoodle(container, doodleIds) {
        const svgNS = "http://www.w3.org/2000/svg";
        const use = document.createElementNS(svgNS, "use");
        const svg = document.createElementNS(svgNS, "svg");
        
        // Random usage
        const randomId = doodleIds[Math.floor(Math.random() * doodleIds.length)];
        use.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${randomId}`);
        
        // Random Color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        svg.classList.add('doodle', randomColor);

        svg.appendChild(use);

        // Random Position & Size
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 50 + 30; // 30px to 80px
        const rotation = Math.random() * 360;
        const duration = Math.random() * 10 + 5; // 5s to 15s delay

        svg.style.left = `${x}vw`;
        svg.style.top = `${y}vh`;
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.transform = `rotate(${rotation}deg)`;
        svg.style.animationDuration = `${duration}s`;
        
        // Add Wiggle randomly
        if(Math.random() > 0.5) {
             svg.style.animation = `float ${duration}s ease-in-out infinite alternate, wiggle ${duration/2}s ease-in-out infinite`;
        }

        container.appendChild(svg);
    }

    // Scroll Logic for Opacity Transitions
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / scrollHeight;

        const bgIngredients = document.getElementById('bg-ingredients');
        const bgOven = document.getElementById('bg-oven');
        const bgEnjoy = document.getElementById('bg-enjoy');

        // Logic: 
        // 0% - 33%: Ingredients fades out
        // 15% - 66%: Oven fades in then out
        // 50% - 100%: Enjoy fades in

        // Ingredients: Visible at start, fades out by 40%
        if (bgIngredients) {
            let opacity = 1 - (scrollPercent * 3); 
            bgIngredients.style.opacity = Math.max(0, opacity);
        }

        // Oven: Peaks around 50%
        if (bgOven) {
            let opacity = 0;
            if (scrollPercent < 0.2) {
                 opacity = 0;
            } else if (scrollPercent < 0.5) {
                opacity = (scrollPercent - 0.2) * 3.33; // Fade in
            } else {
                opacity = 1 - ((scrollPercent - 0.5) * 3); // Fade out
            }
            bgOven.style.opacity = Math.max(0, Math.min(1, opacity));
        }

        // Enjoy: Starts appearing at 60%
        if (bgEnjoy) {
            let opacity = (scrollPercent - 0.6) * 2.5;
            bgEnjoy.style.opacity = Math.max(0, Math.min(1, opacity));
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Order Button Interaction - Modal
    const orderBtns = document.querySelectorAll('.btn-order');
    const modal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-modal');
    const orderForm = document.getElementById('order-form');

    if(modal) {
        orderBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
            });
        });

        closeModal.addEventListener('click', () => {
             modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.classList.remove('show');
            }
        });

        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const name = formData.get('name');
            alert(`Danke ${name}! Deine Pizza wird zubereitet. (Dies ist eine Demo)`);
            modal.classList.remove('show');
            orderForm.reset();
        });
    }
});
