document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({ autoRaf: true });

    const awardListContainer = document.querySelector('.awards-list');
    const awardPreview = document.querySelector('.award-preview');
    const awardsList = document.querySelector('.awards-list');

    const POSITION = {
        BOTTOM: 0,
        MIDDLE: -80,
        TOP: -160,
    };

    let lastMousePosition = { x: 0, y: 0 };
    let activeAward = null;
    let ticking = false;
    let mouseTimeout = null;

    // Sample awards data (replace with your actual data)
    const awards = [
        { name: "name", type: "Gold", project: "projet", label: "paris" },
        { name: "name", type: "Silver", project: "projet", label: "Innovation" },
        { name: "name", type: "Sartre", project: "projet", label: "Innovation" },
        { name: "name", type: "Street", project: "projet", label: "Innovation" },
    
        
    ];

    awards.forEach((award) => {
        const awardElement = document.createElement("div");
        awardElement.className = "award";
        awardElement.innerHTML = `
            <div class="award-wrapper">
                <div class="award-name">
                    <h1>${award.name}</h1>
                    <h1>${award.type}</h1>
                </div>
                <div class="award-project">
                    <h1>${award.project}</h1>
                    <h1>${award.label}</h1>
                </div>
                <div class="award-name">
                    <h1>${award.name}</h1>
                    <h1>${award.type}</h1>
                </div>
            </div>`;
        awardListContainer.appendChild(awardElement);
    });

    const animatePreview = () => {
        const awardListRect = awardsList.getBoundingClientRect();
        if (
            lastMousePosition.x < awardListRect.left ||
            lastMousePosition.x > awardListRect.right ||
            lastMousePosition.y < awardListRect.top ||
            lastMousePosition.y > awardListRect.bottom
        ) {
            gsap.to(awardPreview, { opacity: 0, duration: 0.4 });
        } else {
            gsap.to(awardPreview, { opacity: 1, duration: 0.4 });
        }
    };

    const updateAwards = () => {
        animatePreview();

        if (activeAward) {
            const rect = activeAward.getBoundingClientRect();
            const isStillOver =
                lastMousePosition.x >= rect.left &&
                lastMousePosition.x <= rect.right &&
                lastMousePosition.y >= rect.top &&
                lastMousePosition.y <= rect.bottom;

            if (!isStillOver) {
                const wrapper = activeAward.querySelector(".award-wrapper");
                const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2;
                gsap.to(wrapper, {
                    y: leavingFromTop ? POSITION.TOP : POSITION.BOTTOM,
                    duration: 0.4,
                    ease: "power2.out",
                });
                activeAward = null;
            }
        }

        document.querySelectorAll('.award').forEach((award) => {
            if (award === activeAward) return;
            const rect = award.getBoundingClientRect();
            const isMouseOver =
                lastMousePosition.x >= rect.left &&
                lastMousePosition.x <= rect.right &&
                lastMousePosition.y >= rect.top &&
                lastMousePosition.y <= rect.bottom;

            if (isMouseOver) {
                const wrapper = award.querySelector('.award-wrapper');
                gsap.to(wrapper, {
                    y: POSITION.MIDDLE,
                    duration: 0.4,
                    ease: "power2.out",
                });
                activeAward = award;
            }
        });

        ticking = false;
    };

    document.addEventListener('mousemove', (e) => {
        lastMousePosition.x = e.clientX;
        lastMousePosition.y = e.clientY;

        if (mouseTimeout) clearTimeout(mouseTimeout);

        const awardsListRect = awardsList.getBoundingClientRect();
        const isInsideAwardsList =
            lastMousePosition.x >= awardsListRect.left &&
            lastMousePosition.x <= awardsListRect.right &&
            lastMousePosition.y >= awardsListRect.top &&
            lastMousePosition.y <= awardsListRect.bottom;

        if (isInsideAwardsList) {
            mouseTimeout = setTimeout(() => {
                const images = awardPreview.querySelectorAll('img');
                if (images.length > 1) {
                    const lastImage = images[images.length - 1];
                    images.forEach((img) => {
                        if (img !== lastImage) {
                            gsap.to(img, {
                                scale: 0,
                                duration: 0.4,
                                ease: "power2.out",
                                onComplete: () => img.remove(),
                            });
                        }
                    });
                }
            }, 2000);
        }

        animatePreview();
    });

    document.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateAwards);
            ticking = true;
        }
    }, { passive: true });

    document.querySelectorAll('.award').forEach((award, index) => {
        const wrapper = award.querySelector(".award-wrapper");
        let currentPosition = POSITION.TOP;

        award.addEventListener("mouseenter", (e) => {
            activeAward = award;
            const rect = award.getBoundingClientRect();
            const enterFromTop = e.clientY < rect.top + rect.height / 2;

            currentPosition = POSITION.MIDDLE;
            gsap.to(wrapper, {
                y: POSITION.MIDDLE,
                duration: 0.4,
                ease: "power2.out",
            });
              // Tableau des extensions de vos images
        const imageExtensions = ['.jpg', '.webp', '.webp', '.jpg']; // Adaptez selon vos fichiers
        const imgNumber = index + 1; // Pour correspondre à vos noms de fichiers
        const imgExtension = imageExtensions[index] || '.jpg'; // Fallback
        
        const img = document.createElement("img");
        img.src = `./img/${imgNumber}${imgExtension}`; // Chemin relatif correct
        img.alt = `Award ${imgNumber}`;
        
        // Style de l'image
        Object.assign(img.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%", // Assurez-vous que l'image remplit le conteneur
            height: "100%",
            objectFit: "cover", // Pour que l'image couvre bien la zone
            scale: "0",
            zIndex: Date.now()
        });


            awardPreview.appendChild(img);
            gsap.to(img, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });
        });

        award.addEventListener("mouseleave", (e) => {
            activeAward = null;
            const rect = award.getBoundingClientRect();
            const leavingFromTop = e.clientY < rect.top + rect.height / 2;

            currentPosition = leavingFromTop ? POSITION.TOP : POSITION.BOTTOM;
            gsap.to(wrapper, {
                y: currentPosition,
                duration: 0.4,
                ease: "power2.out",
            });
        });
    });
});