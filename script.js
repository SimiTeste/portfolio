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

// ===================================================
// FÍSICA INTERATIVA DO CRACHÁ E CORDINHA JUNTOS
// ===================================================
const badgeContainer = document.querySelector('.badge-container');
let isDragging = false;
let startX = 0;
let startY = 0;

const elasticidade = 0.15; 
const limiteX = 80;        
const limiteY = 60; // Reduzido um pouco para a cordinha não esticar no teto

badgeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    badgeContainer.style.transition = 'none'; 
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let deltaX = (e.clientX - startX) * elasticidade;
    let deltaY = (e.clientY - startY) * elasticidade;

    if (deltaX > limiteX) deltaX = limiteX;
    if (deltaX < -limiteX) deltaX = -limiteX;
    if (deltaY > limiteY) deltaY = limiteY;
    if (deltaY < 0) deltaY = 0; 

    let rotaçãoZ = deltaX * 0.3; 
    let rotaçãoX = deltaY * 0.2; 

    // Aplica o movimento no CONTAINER INTEIRO (a cordinha vai inclinar junto com o crachá)
    badgeContainer.style.transform = `translate(${deltaX}px, ${deltaY}px) rotateX(${rotaçãoX}deg) rotateZ(${rotaçãoZ}deg)`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    badgeContainer.style.transition = 'transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1)';
    badgeContainer.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateZ(0deg)';
});

// ===================================================
// GALERIA MAGNÉTICA INTERATIVA (EMBARALHAR E VOLTAR)
// ===================================================
const cards = document.querySelectorAll('.foto-card');
let itemArrastado = null;
let cliqueX = 0;
let cliqueY = 0;
let posXAtual = 0;
let posYAtual = 0;
let tempoRetorno = null;

cards.forEach(card => {
    // Inicializa variáveis internas para guardar a posição atual de arrasto de cada card
    card.dataset.x = 0;
    card.dataset.y = 0;
    card.dataset.r = 0; // rotação

    card.addEventListener('mousedown', (e) => {
        itemArrastado = card;
        card.style.transition = 'none'; // Remove animação enquanto o usuário controla
        
        // Pega a posição do clique relativa ao estado atual do card
        cliqueX = e.clientX - parseFloat(card.dataset.x);
        cliqueY = e.clientY - parseFloat(card.dataset.y);
        
        clearTimeout(tempoRetorno); // Cancela o retorno se o usuário interagir novamente
    });
});

document.addEventListener('mousemove', (e) => {
    if (!itemArrastado) return;

    // Calcula a nova posição baseada no movimento do mouse
    posXAtual = e.clientX - cliqueX;
    posYAtual = e.clientY - cliqueY;
    
    // Cria uma leve rotação de acordo com a velocidade/direção do arrasto lateral
    let mexeManeio = posXAtual * 0.05; 
    if(mexeManeio > 15) mexeManeio = 15;
    if(mexeManeio < -15) mexeManeio = -15;

    // Salva os valores atuais no elemento
    itemArrastado.dataset.x = posXAtual;
    itemArrastado.dataset.y = posYAtual;
    itemArrastado.dataset.r = mexeManeio;

    // Aplica o movimento na tela em tempo real
    itemArrastado.style.transform = `translate(${posXAtual}px, ${posYAtual}px) rotate(${mexeManeio}deg)`;
});

document.addEventListener('mouseup', () => {
    if (!itemArrastado) return;
    itemArrastado = null;

    // Aciona o cronômetro: 5 segundos (5000ms) após soltar qualquer foto, todas voltam
    clearTimeout(tempoRetorno);
    tempoRetorno = setTimeout(voltarParaAGrade, 5000); 
});

// Função que puxa todas as fotos de volta como um ímã
function voltarParaAGrade() {
    cards.forEach(card => {
        // Ativa uma transição suave de volta usando CSS cubic-bezier para efeito elástico
        card.style.transition = 'transform 0.8s cubic-bezier(0.25, 1.5, 0.5, 1)';
        
        // Zera as posições e rotações de volta para o ponto de origem na grade
        card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        
        // Reseta os dados armazenados internos
        card.dataset.x = 0;
        card.dataset.y = 0;
        card.dataset.r = 0;
    });
}