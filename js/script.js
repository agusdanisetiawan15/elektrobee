// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");

  // Reset animasi untuk setiap link
  const links = navLinks.querySelectorAll("a");
  links.forEach((link, index) => {
    link.style.animation = "";
    // Trigger reflow
    void link.offsetWidth;
    if (isMenuOpen) {
      link.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
    }
  });
}

// Event listener untuk hamburger
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

// Smooth Scroll dan Menu Toggle
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Tutup menu mobile jika terbuka
      if (isMenuOpen) {
        toggleMenu();
      }

      // Smooth scroll ke section
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Event listener untuk klik di luar menu
document.addEventListener("click", (e) => {
  if (
    isMenuOpen &&
    !hamburger.contains(e.target) &&
    !navLinks.contains(e.target)
  ) {
    toggleMenu();
  }
});

// Event listener untuk resize window
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && isMenuOpen) {
    toggleMenu();
  }
});

// Smooth Scroll untuk semua link anchor
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Form Validation dan Submission
const contactForm = document.getElementById("contactForm");
const orderForm = document.getElementById("orderForm");

function validateForm(form) {
  const inputs = form.querySelectorAll("input, textarea, select");
  let isValid = true;

  inputs.forEach((input) => {
    if (input.hasAttribute("required") && !input.value.trim()) {
      isValid = false;
      input.classList.add("error");
    } else {
      input.classList.remove("error");
    }

    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.classList.add("error");
      }
    }

    if (input.type === "tel" && input.value) {
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(input.value)) {
        isValid = false;
        input.classList.add("error");
      }
    }
  });

  return isValid;
}

function handleFormSubmit(e, formType) {
  e.preventDefault();

  if (!validateForm(e.target)) {
    alert("Mohon lengkapi semua field dengan benar");
    return;
  }

  // Simulasi pengiriman form
  const submitBtn = e.target.querySelector(".submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Mengirim...";
  submitBtn.disabled = true;

  // Jika ini adalah form pemesanan, kirim ke Discord webhook
  if (formType === "order") {
    const formData = new FormData(e.target);
    const orderData = {
      nama: formData.get("nama"),
      email: formData.get("email"),
      telepon: formData.get("telepon"),
      layanan: formData.get("layanan"),
      pesan: formData.get("pesan")
    };

    // Kirim ke Discord webhook
    const webhookUrl = "https://canary.discord.com/api/webhooks/1380601444968697865/C1xNIyW6W0ecAsNm5uUNtSLV1ukNfmI8ZX9JmuC3ptd-Cn_9M8iMa3xz3J6OChXNN3SM";
    const discordMessage = {
      username: "Elektrobee Bot",
      avatar_url: "https://i.imgur.com/4M34hi2.png",
      embeds: [{
        title: "🛠️ Pesanan Baru!",
        color: 3447003,
        fields: [
          {
            name: "Nama Perusahaan",
            value: formData.get("nama") || "Tidak diisi",
            inline: true
          },
          {
            name: "Nama Penanggung Jawab",
            value: formData.get("nama_pj") || "Tidak diisi",
            inline: true
          },
          {
            name: "Email",
            value: formData.get("email") || "Tidak diisi",
            inline: true
          },
          {
            name: "Telepon",
            value: formData.get("telepon") || "Tidak diisi",
            inline: true
          },
          {
            name: "Layanan",
            value: formData.get("layanan") || "Tidak diisi",
            inline: true
          },
          {
            name: "Deskripsi Kebutuhan",
            value: formData.get("pesan") || "Tidak ada deskripsi tambahan"
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Elektrobee - Jasa Kelistrikan Profesional"
        }
      }]
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordMessage)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Error mengirim ke Discord:", error);
      // Tetap lanjutkan proses form meskipun gagal mengirim ke Discord
    });
  }

  setTimeout(() => {
    alert(
      formType === "contact"
        ? "Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda."
        : "Terima kasih! Permintaan Anda telah terkirim. Tim kami akan segera menghubungi Anda untuk konfirmasi."
    );

    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => handleFormSubmit(e, "contact"));
}

if (orderForm) {
  orderForm.addEventListener("submit", (e) => handleFormSubmit(e, "order"));
}

// Animasi Scroll
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".service-card, .about-content, .contact-container, .order-form"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Navbar Scroll Effect
let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove("scroll-up");
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains("scroll-down")) {
    // Scroll Down
    header.classList.remove("scroll-up");
    header.classList.add("scroll-down");
  } else if (
    currentScroll < lastScroll &&
    header.classList.contains("scroll-down")
  ) {
    // Scroll Up
    header.classList.remove("scroll-down");
    header.classList.add("scroll-up");
  }
  lastScroll = currentScroll;
});

// Galeri Modal
const galleryItems = document.querySelectorAll(".gallery-item");
const modal = document.createElement("div");
modal.className = "gallery-modal";
modal.innerHTML = `
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img src="" alt="">
        <div class="modal-caption"></div>
    </div>
`;
document.body.appendChild(modal);

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const title = item.querySelector("h4").textContent;
    const description = item.querySelector("p").textContent;

    modal.querySelector("img").src = img.src;
    modal.querySelector("img").alt = img.alt;
    modal.querySelector(".modal-caption").innerHTML = `
            <h4>${title}</h4>
            <p>${description}</p>
        `;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

modal.querySelector(".modal-close").addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Keyboard navigation untuk modal
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "Escape") {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
});

// Gallery Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.gallery-slider');
  
  sliders.forEach(slider => {
    const grid = slider.querySelector('.gallery-grid');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const items = slider.querySelectorAll('.gallery-item');
    
    let currentPosition = 0;
    const itemWidth = items[0].offsetWidth + 20; // Including gap
    let itemsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
    let maxPosition = -(items.length - itemsPerView) * itemWidth;
    let isAnimating = false;
    
    function updateSlider() {
      if (isAnimating) return;
      isAnimating = true;
      
      grid.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      grid.style.transform = `translateX(${currentPosition}px)`;
      
      items.forEach((item, index) => {
        const itemPosition = index * itemWidth + currentPosition;
        const isVisible = itemPosition >= -itemWidth && itemPosition <= window.innerWidth;
        
        if (isVisible) {
          item.classList.add('active');
          item.classList.add('slide-in');
          item.classList.remove('slide-out');
        } else {
          item.classList.remove('active');
          if (itemPosition < -itemWidth) {
            item.classList.add('slide-out');
            item.classList.remove('slide-in');
          }
        }
      });
      
      prevBtn.style.opacity = items.length <= itemsPerView ? '0.5' : '1';
      nextBtn.style.opacity = items.length <= itemsPerView ? '0.5' : '1';
      
      // Reset animating flag after transition
      setTimeout(() => {
        isAnimating = false;
      }, 800);
    }
    
    function slideNext() {
      if (isAnimating) return;
      
      if (currentPosition > maxPosition) {
        currentPosition = Math.max(currentPosition - itemWidth, maxPosition);
      } else {
        // Loop ke awal dengan animasi smooth
        currentPosition = 0;
      }
      updateSlider();
    }
    
    function slidePrev() {
      if (isAnimating) return;
      
      if (currentPosition < 0) {
        currentPosition = Math.min(currentPosition + itemWidth, 0);
      } else {
        // Loop ke akhir dengan animasi smooth
        currentPosition = maxPosition;
      }
      updateSlider();
    }
    
    prevBtn.addEventListener('click', slidePrev);
    nextBtn.addEventListener('click', slideNext);
    
    // Auto slide setiap 3 detik
    let autoSlideInterval = setInterval(slideNext, 3000);
    
    // Hentikan auto slide saat hover
    slider.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    // Lanjutkan auto slide saat mouse keluar
    slider.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(slideNext, 2000);
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      grid.style.transition = 'none';
      grid.style.transform = `translateX(${currentPosition + diff}px)`;
    });
    
    slider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        slideNext();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        slidePrev();
      } else {
        // Kembali ke posisi awal jika swipe tidak cukup
        updateSlider();
      }
    }
    
    window.addEventListener('resize', () => {
      itemsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
      maxPosition = -(items.length - itemsPerView) * itemWidth;
      if (currentPosition < maxPosition) {
        currentPosition = maxPosition;
      }
      updateSlider();
    });
    
    // Initial setup
    updateSlider();
  });
});
