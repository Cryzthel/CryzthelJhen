// index.js

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Navigation and Scroll Logic
    // ----------------------------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    function setActiveNavItem(targetId) {
        navItems.forEach(navItem => {
            navItem.classList.remove('bg-indigo-600', 'text-white', 'shadow-xl');
            navItem.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
        });
        
        const activeItem = document.querySelector(`[data-target="${targetId}"]`);
        if (activeItem) {
            activeItem.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
            activeItem.classList.add('bg-indigo-600', 'text-white', 'shadow-xl');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = 80; 
                // The correct way to calculate scroll position for a fixed header offset
                const offsetPosition = targetSection.offsetTop - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Check if the element is intersecting AND it's above the 70% mark (rootMargin)
            if (entry.isIntersecting) {
                setActiveNavItem(entry.target.id);
            }
        });
    }, {
        rootMargin: "0px 0px -70% 0px", 
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // ----------------------------------------------------------------------
    // 2. Animated Title (Typewriter Effect) Logic
    // ----------------------------------------------------------------------
    const titleContainer = document.getElementById('animated-title-container');
    const words = ["UI/UX Designer", "Front-end Developer", "Creative Problem Solver"]; 
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        if (!titleContainer) return; 

        const fullWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        const currentWord = fullWord.substring(0, charIndex);
        titleContainer.innerHTML = currentWord;
        
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '|'; 
        titleContainer.appendChild(cursor);

        let typingSpeed = 100; 
        
        if (isDeleting) {
            typingSpeed = 50; 
        }

        if (!isDeleting && currentWord.length === fullWord.length) {
            typingSpeed = 1500; 
            isDeleting = true;
        } else if (isDeleting && currentWord === '') {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; 
            typingSpeed = 500; 
        }
        setTimeout(typeWriter, typingSpeed);
    }

    setTimeout(typeWriter, 500);

    // ----------------------------------------------------------------------
    // 3. Glitter Particle Mouse Trail Logic
    // ----------------------------------------------------------------------
    document.addEventListener('mousemove', (e) => {
        const particle = document.createElement('div');
        particle.className = 'glitter-particle';
        
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        
        const size = Math.random() * 5 + 2; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1500); 
    });

    // ----------------------------------------------------------------------
    // 4. Skill Animation (Intersection Observer) Logic
    // ----------------------------------------------------------------------
    const skillItems = document.querySelectorAll('[data-animate-on-scroll]');
    
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const delay = parseInt(item.getAttribute('data-delay') || '0', 10);
                
                setTimeout(() => {
                    item.classList.add('animate-in'); 
                }, delay);
                skillObserver.unobserve(item); 
            }
        });
    }, {
        rootMargin: "0px 0px -100px 0px", 
        threshold: 0.1
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
    
    // ----------------------------------------------------------------------
    // 5. 3D Tilt Card Mousemove Logic (New Feature)
    // ----------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.js-tilt-card');
    const MAX_TILT = 5; // The maximum angle (in degrees) to tilt the card
    const SCALE_AMOUNT = 1.05; // Amount to scale the card on hover

    tiltCards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            handleMouseMove(card, e);
        });

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            // Start scale and reset transition
            card.style.transform = `scale(${SCALE_AMOUNT})`;
            card.style.transition = 'transform 0.1s ease-out'; 
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            // Smoothly reset the transformation
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out'; 
        });

        function handleMouseMove(cardElement, event) {
            const rect = cardElement.getBoundingClientRect();
            
            // Calculate mouse position relative to the center of the card
            const xCenter = rect.left + rect.width / 2;
            const yCenter = rect.top + rect.height / 2;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Normalize coordinates from -1 to 1 (center is 0,0)
            const xNormalized = (mouseX - xCenter) / (rect.width / 2);
            const yNormalized = (mouseY - yCenter) / (rect.height / 2);

            // Calculate tilt angle: rotationX depends on Y mouse, rotationY depends on X mouse
            const rotationX = yNormalized * -MAX_TILT; // Inverted for 3D perspective
            const rotationY = xNormalized * MAX_TILT;

            // Apply the new transform style. Use 'perspective(1000px)' for the 3D depth.
            cardElement.style.transform = 
                `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${SCALE_AMOUNT})`;
            
            // Remove the transition during live movement for a snappy feel
            cardElement.style.transition = 'none'; 
        }
    });

});


// ----------------------------------------------------------------------
// Three.js Background Animation Logic (Kept outside DOMContentLoaded since it uses window.onload)
// ----------------------------------------------------------------------

window.onload = function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return; 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); 

    const particleCount = 200; 

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ccff, 
        size: 2, 
        blending: THREE.AdditiveBlending, 
        transparent: true,
        sizeAttenuation: true 
    });
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.2
    });

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const particlesData = [];
    const boundingBox = 300; 

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * boundingBox;
        const y = (Math.random() - 0.5) * boundingBox;
        const z = (Math.random() - 0.5) * boundingBox;
        positions.push(x, y, z);
        
        particlesData.push({
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1)
        });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    const linePositions = [];

    camera.position.z = 200;
    const maxDistance = 60; 

    function animate() {
        requestAnimationFrame(animate);

        const positionsArray = geometry.attributes.position.array;
        
        linePositions.length = 0;

        for (let i = 0; i < particleCount; i++) {
            positionsArray[i * 3] += particlesData[i].velocity.x;
            positionsArray[i * 3 + 1] += particlesData[i].velocity.y;
            positionsArray[i * 3 + 2] += particlesData[i].velocity.z;

            if (positionsArray[i * 3] > boundingBox / 2) positionsArray[i * 3] = -boundingBox / 2;
            if (positionsArray[i * 3] < -boundingBox / 2) positionsArray[i * 3] = boundingBox / 2;
            if (positionsArray[i * 3 + 1] > boundingBox / 2) positionsArray[i * 3 + 1] = -boundingBox / 2;
            if (positionsArray[i * 3 + 1] < -boundingBox / 2) positionsArray[i * 3 + 1] = boundingBox / 2;
            if (positionsArray[i * 3 + 2] > boundingBox / 2) positionsArray[i * 3 + 2] = -boundingBox / 2;
            if (positionsArray[i * 3 + 2] < -boundingBox / 2) positionsArray[i * 3 + 2] = boundingBox / 2;

            for (let j = i + 1; j < particleCount; j++) {
                const dx = positionsArray[i * 3] - positionsArray[j * 3];
                const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
                const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
                const distanceSq = dx * dx + dy * dy + dz * dz;

                if (distanceSq < maxDistance * maxDistance) {
                    const opacity = 1 - (distanceSq / (maxDistance * maxDistance)); 
                    lineMaterial.opacity = opacity * 0.3; 
                    
                    linePositions.push(positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2]);
                    linePositions.push(positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]);
                }
            }
        }
        
        geometry.attributes.position.needsUpdate = true; 
        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lines.geometry.attributes.position.needsUpdate = true; 

        scene.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
};