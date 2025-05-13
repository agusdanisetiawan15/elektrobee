// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Reset animasi untuk setiap link
    const links = navLinks.querySelectorAll('a');
    links.forEach((link, index) => {
        link.style.animation = '';
        // Trigger reflow
        void link.offsetWidth;
        if (isMenuOpen) {
            link.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        }
    });
}

// Event listener untuk hamburger
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Smooth Scroll dan Menu Toggle
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Tutup menu mobile jika terbuka
            if (isMenuOpen) {
                toggleMenu();
            }
            
            // Smooth scroll ke section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Event listener untuk klik di luar menu
document.addEventListener('click', (e) => {
    if (isMenuOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu();
    }
});

// Event listener untuk resize window
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMenu();
    }
});

// Smooth Scroll untuk semua link anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Tutup menu mobile jika terbuka
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Form Validation dan Submission
const contactForm = document.getElementById('contactForm');
const orderForm = document.getElementById('orderForm');

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }

        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });

    return isValid;
}

function handleFormSubmit(e, formType) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        alert('Mohon lengkapi semua field dengan benar');
        return;
    }

    // Simulasi pengiriman form
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert(formType === 'contact' ? 
            'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.' :
            'Terima kasih! Permintaan Anda telah terkirim. Tim kami akan segera menghubungi Anda untuk konfirmasi.');
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
}

if (orderForm) {
    orderForm.addEventListener('submit', (e) => handleFormSubmit(e, 'order'));
}

// Animasi Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .about-content, .contact-container, .order-form').forEach(el => {
    observer.observe(el);
});

// Navbar Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Galeri Modal
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.createElement('div');
modal.className = 'gallery-modal';
modal.innerHTML = `
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img src="" alt="">
        <div class="modal-caption"></div>
    </div>
`;
document.body.appendChild(modal);

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        const description = item.querySelector('p').textContent;
        
        modal.querySelector('img').src = img.src;
        modal.querySelector('img').alt = img.alt;
        modal.querySelector('.modal-caption').innerHTML = `
            <h4>${title}</h4>
            <p>${description}</p>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Keyboard navigation untuk modal
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}); 