// --- Package Data ---
const packageData = {
    bronze: {
        title: "Bronze Package",
        description: "Our essential maintenance package is perfect for keeping your vehicle in consistently clean condition. It covers all the fundamentals with professional care and high-quality products.",
        features: ["Premium Hand Wash & Dry", "Wheel & Tire Cleaning", "Interior Vacuum", "Wipe Down of Surfaces", "Window Cleaning"]
    },
    silver: {
        title: "Silver Package",
        description: "Our most popular choice, the Silver Package, offers a comprehensive interior and exterior refresh. It includes a protective wax layer that enhances shine and shields your paintwork.",
        features: ["<strong>All Bronze Features +</strong>", "Spray Wax Application", "Tire Dressing", "Deep Interior Wipe Down", "Door Jamb Cleaning"]
    },
    gold: {
        title: "Gold Package",
        description: "The ultimate restorative experience for your vehicle. The Gold Package includes a deep paint cleansing process and a durable sealant, leaving a flawless, protected, and incredibly glossy finish.",
        features: ["<strong>All Silver Features +</strong>", "Deep Surface Cleansing", "High-Quality Paint Sealant (6-Month Durability)", "Leather Cleaning & Conditioning", "Carpet & Upholstery Shampoo"]
    },
    diamond: {
        title: "Diamond Package",
        description: "The pinnacle of automotive perfection. This package is for the owner who wants their vehicle in better-than-new condition, inside and out.",
        features: ["<strong>All Gold Features +</strong>", "Full Interior Deep Clean & Steam", "Engine Bay Detailing", "Glass Sealant Application", "Trim Restoration & Protection"]
    }
};

// --- Modal Logic ---
const modal = document.getElementById('package-modal');
const closeModalBtn = document.getElementById('close-modal');
const detailButtons = document.querySelectorAll('[data-package]');

detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const packageName = button.dataset.package;
        const data = packageData[packageName];

        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-description').textContent = data.description;
        const featuresList = document.getElementById('modal-features');
        featuresList.innerHTML = data.features.map(f => `<li><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>${f}</li>`).join('');
        document.getElementById('modal-book-btn').dataset.package = packageName;

        modal.classList.remove('hidden');
    });
});

const closeModal = () => modal.classList.add('hidden');
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.getElementById('modal-book-btn').addEventListener('click', function() {
    const packageName = this.dataset.package;
    document.getElementById('package-select').value = packageName.charAt(0).toUpperCase() + packageName.slice(1);
    closeModal();
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});

// --- Booking Form Logic ---
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const vehicle = document.getElementById('vehicle').value;
    const date = document.getElementById('date').value;
    const selectedPackage = document.getElementById('package-select').value;

    const subject = `New Booking Request from ${name}`;
    const body = `New detailing request from the website:\n------------------------------------------\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nVehicle: ${vehicle}\nRequested Date: ${date}\nSelected Package: ${selectedPackage}\n------------------------------------------`;
    window.location.href = `mailto:burgosmobilewash@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// --- Mobile Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// --- Smooth Scrolling for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- Three.js Animations ---
let heroScene, heroCamera, heroRenderer, heroRain, heroRainGeo, rainCount = 15000;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initHeroAnimation() {
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    heroCamera.position.z = 1;

    const canvas = document.getElementById('hero-canvas');
    heroRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);

    heroRainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for(let i = 0; i < rainCount * 3; i+=3) {
        positions[i] = Math.random() * 400 - 200;
        positions[i+1] = Math.random() * 500 - 250;
        positions[i+2] = Math.random() * 400 - 200;
    }
    heroRainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    let rainMaterial = new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.1, transparent: true, opacity: 0.7 });
    heroRain = new THREE.Points(heroRainGeo, rainMaterial);
    heroScene.add(heroRain);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function animate() {
    // Hero Animation
    heroCamera.position.x += (mouseX - heroCamera.position.x) * 0.05;
    heroCamera.position.y += (-mouseY - heroCamera.position.y) * 0.05;
    heroCamera.lookAt(heroScene.position);
    heroRain.rotation.y += 0.001;
    heroRenderer.render(heroScene, heroCamera);

    requestAnimationFrame(animate);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(elem => {
    revealObserver.observe(elem);
});


window.onload = () => {
    initHeroAnimation();
    animate();
};

// --- FAQ Accordion ---
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('span');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        } else {
            answer.style.display = 'block';
            icon.style.transform = 'rotate(45deg)';
        }
    });
});

// --- Gallery Modal Logic ---
const galleryModal = document.getElementById('gallery-modal');
const galleryModalImg = document.getElementById('gallery-modal-img');
const closeGalleryModalBtn = document.getElementById('close-gallery-modal');
const prevGalleryBtn = document.getElementById('prev-gallery-img');
const nextGalleryBtn = document.getElementById('next-gallery-img');
const galleryImages = document.querySelectorAll('.gallery-item img');
let currentImageIndex;

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImageIndex = index;
        openGalleryModal(img.src);
    });
});

function openGalleryModal(src) {
    galleryModalImg.src = src;
    galleryModal.classList.remove('hidden');
    galleryModal.classList.add('flex');
}

function closeGalleryModal() {
    galleryModal.classList.add('hidden');
    galleryModal.classList.remove('flex');
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    galleryModalImg.src = galleryImages[currentImageIndex].src;
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    galleryModalImg.src = galleryImages[currentImageIndex].src;
}

closeGalleryModalBtn.addEventListener('click', closeGalleryModal);
nextGalleryBtn.addEventListener('click', showNextImage);
prevGalleryBtn.addEventListener('click', showPrevImage);
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeGalleryModal();
    }
});
