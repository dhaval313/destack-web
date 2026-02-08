document.addEventListener('DOMContentLoaded', () => {
    console.log("VILIOS Landing Page Loaded");

    const heroSection = document.querySelector('.hero-section');
    const textInfo = document.querySelector('.element-text');

    // --- Parallax Effect ---
    if (heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 30;
            const y = (e.clientY - window.innerHeight / 2) / 30;
            if (textInfo) {
                textInfo.style.transform = `translateY(-50%) scaleY(1.4) translate(${x * 0.5}px, ${y * 0.5}px)`;
            }
        });
    }

    // --- iOS Morphing Cursor Logic ---
    const cursor = document.querySelector('.cursor-blur-spot');
    // Added .nav-links a, .navbar a to the selector list
    const buttons = document.querySelectorAll('.btn, .link-arrow, button, a.btn, .nav-links a, .navbar a');

    if (cursor) {
        // State
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let current = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            width: 20,
            height: 20,
            radius: 50
        };
        let target = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            width: 20,
            height: 20,
            radius: 50
        };

        let isLocked = false; // Are we snapped to a button?
        let activeBtn = null; // The button we are locked to

        // Params
        const MOVE_LERP = 0.12; // Position smoothness
        const SIZE_LERP = 0.12; // Resizing smoothness
        const MAGNETIC_PULL = 0.4; // How far the button/cursor moves with mouse

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Ensure cursor is visible on interaction
            cursor.classList.remove('cursor-hidden');

            // If not locked, target is mouse position
            if (!isLocked) {
                target.x = mouse.x;
                target.y = mouse.y;
            }

            // Update color based on position
            updateCursorColor();
        });

        // --- Sticky Header Scroll Logic ---
        const navbar = document.querySelector('.navbar');
        const navbarBg = document.querySelector('.navbar-bg');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                if (navbar) navbar.classList.add('scrolled');
                if (navbarBg) navbarBg.classList.add('scrolled');
            } else {
                if (navbar) navbar.classList.remove('scrolled');
                if (navbarBg) navbarBg.classList.remove('scrolled');
            }
            // Update color based on position even if mouse is stationary
            updateCursorColor();
        });


        function updateCursorColor() {
            // Get element under cursor
            const el = document.elementFromPoint(mouse.x, mouse.y);
            if (!el) return;

            // Check if cursor is over About or Contact sections (White Backgrounds)
            // .closest() handles if we are hovering a child element inside the section
            const isWhiteSection = el.closest('.about-section') || el.closest('.contact-section') || el.closest('.navbar') || el.closest('.navbar-bg');

            if (isWhiteSection) {
                // Force Blue Cursor on White Sections
                cursor.classList.remove('cursor-on-blue');
                // Dynamic Z-Index: 
                // If on navbar, we want Z=25000 (Above HeaderBG(20000), Below HeaderText(30000))
                // If on hero/white, we want Z=5000 (Above Body, Below HeroText(10001))
                if (el.closest('.navbar') || el.closest('.navbar-bg')) {
                    cursor.style.zIndex = '25000';
                } else {
                    cursor.style.zIndex = '5000';
                }
                return;
            } else {
                // Not on white section (e.g. blue background)
                cursor.style.zIndex = '5000'; // Reset default
            }

            // --- HERO SECTION / DEFAULT LOGIC ---
            // Diagonal threshold line calculation
            // Top (y=0): threshold at 40% of width
            // Bottom (y=height): threshold at 50% of width
            // Linear interpolation between them
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Mouse Y is viewport relative
            const yRatio = mouse.y / screenHeight;

            // Calculate threshold x position for current y
            const thresholdX = screenWidth * (0.4 + (0.1 * yRatio));

            // Check if cursor is to the right of the diagonal line
            if (mouse.x > thresholdX) {
                cursor.classList.add('cursor-on-blue');
            } else {
                cursor.classList.remove('cursor-on-blue');
            }
        }

        // Animation Loop
        const animate = () => {
            // Disable on Mobile
            if (window.innerWidth <= 768) {
                requestAnimationFrame(animate);
                return;
            }

            // Calculate Targets if Locked
            if (isLocked && activeBtn) {
                const rect = activeBtn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Magnetic Pull: Allow cursor to drift slightly from center towards mouse
                const distx = mouse.x - centerX;
                const disty = mouse.y - centerY;

                // Target Position = Button Center + Offset
                target.x = centerX + (distx * MAGNETIC_PULL);
                target.y = centerY + (disty * MAGNETIC_PULL);

                // Also move the button content (Text/Icon) for that 3D feel
                activeBtn.style.transform = `translate(${distx * 0.2}px, ${disty * 0.2}px)`;
            }

            // Lerp Values
            current.x += (target.x - current.x) * MOVE_LERP;
            current.y += (target.y - current.y) * MOVE_LERP;
            current.width += (target.width - current.width) * SIZE_LERP;
            current.height += (target.height - current.height) * SIZE_LERP;

            // Only Lerp radius if needed, or keeping it strictly CSS might be smoother?
            // Let's Lerp it for perfect transitions from circle to pill
            // (Simulated lerp for radius as it's often a string '50%', '50px')
            // For simplicity, we'll swap classes for radius, but here we can support pixel radii

            // Apply Styles to Cursor
            cursor.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%)`;
            cursor.style.width = `${current.width}px`;
            cursor.style.height = `${current.height}px`;

            requestAnimationFrame(animate);
        };
        animate();

        // Interaction Events
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 768) return; // Disable on Mobile

                isLocked = true;
                activeBtn = btn;
                cursor.classList.add('cursor-locked');

                const rect = btn.getBoundingClientRect();
                const style = window.getComputedStyle(btn);

                // Set Targets to Button Size
                target.width = rect.width;
                target.height = rect.height;
                cursor.style.borderRadius = style.borderRadius; // Match button radius
            });

            btn.addEventListener('mouseleave', () => {
                isLocked = false;
                activeBtn = null;
                cursor.classList.remove('cursor-locked');

                // Reset Targets to Default Dot
                target.width = 20;
                target.height = 20;
                cursor.style.borderRadius = '50%';

                // Reset Button Content
                btn.style.transform = 'translate(0,0)';
            });
        });

        // --- Form Inputs Cursor Handling ---
        // 1. TEXT INPUTS: Morph cursor to vertical bar
        const textInputs = document.querySelectorAll('input, textarea');
        textInputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                cursor.classList.remove('cursor-hidden'); // Ensure visible
                cursor.classList.add('cursor-text');
            });
            input.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-text');
            });
        });

        // 2. CLICKABLES (Dropdowns, etc): Hide custom cursor or Lock?
        // Let's keep dropdowns interactive with the default bubble or locked state
        // For now, removing the "hidden" logic for dropdowns so the bubble persists
        // UNLESS we want to show hand cursor. 
        // User asked for "vertical rectangle cursor for the select text cursor" on inputs.
        // We implemented that above.

        // --- CUSTOM DROPDOWN LOGIC ---
        const customSelect = document.querySelector('.custom-select');
        const customSelectTrigger = document.querySelector('.custom-select-trigger');
        const customOptions = document.querySelectorAll('.custom-option');
        const hiddenSelect = document.getElementById('service');
        const customTriggerText = customSelectTrigger.querySelector('span');

        // Toggle Open
        customSelectTrigger.addEventListener('click', (e) => {
            customSelect.classList.toggle('open');
            customSelectTrigger.classList.toggle('active');
            e.stopPropagation(); // Prevent closing immediately by document listener
        });

        // Option Selection
        customOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update UI
                customTriggerText.textContent = option.textContent;
                customSelect.classList.remove('open');
                customSelectTrigger.classList.remove('active');
                customSelectTrigger.style.color = 'var(--color-black)'; // Set text color to black (active)

                // Update Hidden Select
                hiddenSelect.value = option.getAttribute('data-value');

                // Visual feedback on selected class
                customOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
                customSelectTrigger.classList.remove('active');
            }
        });

        // --- Text Detection (Optional: can keep simple dot or morph to bar) ---
        // Keeping it simple for now to focus on the Button Morph perfection
        // Or if user wants text morph, we can add it back similarly.
        // Let's add back simple text morph
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, span, a:not(.btn)');
        textElements.forEach(el => {
            if (el.closest('.element-text') || el.closest('.btn') || el.closest('button')) return;

            el.addEventListener('mouseenter', () => {
                if (!isLocked) {
                    cursor.classList.add('text-hover');
                    const style = window.getComputedStyle(el);
                    target.height = parseFloat(style.fontSize);
                    target.width = 4; // Slim bar
                    cursor.style.borderRadius = '4px';
                }
            });

            el.addEventListener('mouseleave', () => {
                if (!isLocked) {
                    cursor.classList.remove('text-hover');
                    target.width = 20;
                    target.height = 20;
                    cursor.style.borderRadius = '50%';
                }
            });
        });

        // --- Contact Form Handling (EmailJS) ---
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (event) {
                event.preventDefault();

                // Show loading state (optional, e.g., change button text)
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;

                // Send Email
                // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
                emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
                    .then(function () {
                        alert('Message Sent Successfully! We will get back to you soon.');
                        contactForm.reset();
                        btn.textContent = originalText;
                        btn.disabled = false;

                        // Reset custom select if needed
                        const customTriggerText = document.querySelector('.custom-select-trigger span');
                        if (customTriggerText) customTriggerText.textContent = 'Select a Service';

                    }, function (error) {
                        alert('Failed to send message. Please try again later or email us directly.');
                        console.error('EmailJS Error:', error);
                        btn.textContent = originalText;
                        btn.disabled = false;
                    });
            });
        }
    }
});
