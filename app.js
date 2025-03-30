document.addEventListener("DOMContentLoaded", () => {
    const awardListContainer = document.querySelector('.awards-list');

    const awards = [
        { name: "Photo One", type: "Children" },
        { name: "Photo Two", type: "Silver" },
        { name: "Photo Three", type: "Portrait" },
        { name: "Photo Four", type: "People" }
    ];
n
    awards.forEach((award, index) => {
        const awardElement = document.createElement("div");
        awardElement.className = "award";
        awardElement.innerHTML = `
            <div class="award-wrapper">
                <div class="award-name">
                    <h1>${award.name}</h1>
                    <h1>${award.type}</h1>
                </div>
            </div>`;
        
        awardListContainer.appendChild(awardElement);

        let currentImg = null;

        awardElement.addEventListener("mouseenter", (e) => {
            // Si une image existe déjà, la supprimer immédiatement
            if (currentImg) {
                currentImg.remove();
                currentImg = null;
            }

            const imageExtensions = ['.jpg', '.webp', '.webp', '.jpg'];
            const imgNumber = index + 1;
            const imgExtension = imageExtensions[index] || '.jpg';

            currentImg = document.createElement("img");
            currentImg.className = "award-image";
            currentImg.src = `./img/${imgNumber}${imgExtension}`;
            currentImg.alt = `Award ${imgNumber}`;

            Object.assign(currentImg.style, {
                position: "absolute",
                top: `${e.clientY - 100}px`,
                left: `${e.clientX - 100}px`,
                width: "400px",
                height: "400px",
                objectFit: "cover",
                transform: "scale(0)",
                zIndex: 1000,
                pointerEvents: "none", // Empêche l'image de bloquer le survol
            });

            document.body.appendChild(currentImg);

            gsap.to(currentImg, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });
        });

        awardElement.addEventListener("mouseleave", () => {
            if (currentImg) {
                gsap.to(currentImg, {
                    scale: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto", // Force l'arrêt des animations précédentes
                    onComplete: () => {
                        if (currentImg) {
                            currentImg.remove();
                            currentImg = null;
                        }
                    },
                });
            }
        });
    });
});