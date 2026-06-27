const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

/* =========================
   PARTÍCULAS
========================= */

const particles = [];

const TOTAL = 120;

for (let i = 0; i < TOTAL; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.5 + 0.2
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(30,144,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // loop infinito suave
        if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
        }

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
    }

    requestAnimationFrame(draw);
}

draw();

function abrirModal(caminhoImagem) {
    const modal = document.getElementById("modalCertificado");
    const imgModal = document.getElementById("imgModal");
    
    modal.style.display = "block";
    imgModal.src = caminhoImagem;
}

function fecharModal() {
    const modal = document.getElementById("modalCertificado");
    modal.style.display = "none";
}