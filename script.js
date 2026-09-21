/* =========================================
   1. SISTEMA DE ENRUTAMIENTO Y ESTADO
   ========================================= */
let isUnlocked = false;
let currentGameInterval = null;

// Construcción del Girasol Hiper-Detallado
function drawDetailedPetals() {
  const container = document.getElementById('detailed-petals');
  if (!container) return;
  
  let petalsHTML = '';
  
  // Capa 1: Atrás (Oscuros/Naranjas) - 24 pétalos
  for(let i=0; i<24; i++) {
    let angle = i * 15;
    petalsHTML += `<path d="M0,0 C-22,-60 0,-125 0,-125 C0,-125 22,-60 0,0" fill="url(#petal-grad1)" transform="rotate(${angle}) scale(1)"/>`;
  }
  
  // Capa 2: Medio (Amarillos dorados) - 24 pétalos
  for(let i=0; i<24; i++) {
    let angle = (i * 15) + 7.5;
    petalsHTML += `<path d="M0,0 C-18,-50 0,-110 0,-110 C0,-110 18,-50 0,0" fill="url(#petal-grad2)" transform="rotate(${angle}) scale(1)"/>`;
  }
  
  // Capa 3: Frente (Amarillos brillantes) - 24 pétalos
  for(let i=0; i<24; i++) {
    let angle = (i * 15) + 3.75;
    petalsHTML += `<path d="M0,0 C-15,-40 0,-95 0,-95 C0,-95 15,-40 0,0" fill="#FFEB3B" transform="rotate(${angle}) scale(1)"/>`;
  }
  
  container.innerHTML = petalsHTML;
}

// Ejecutar al iniciar
document.addEventListener("DOMContentLoaded", () => {
  drawDetailedPetals();
});

function navigate(pageId) {
  if (!isUnlocked && pageId !== 'page-login') return; 
  
  if (currentGameInterval) { cancelAnimationFrame(currentGameInterval); currentGameInterval = null; }
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });
  
  const targetPage = document.getElementById(pageId);
  targetPage.classList.remove('hidden');
  targetPage.classList.add('active');
  
  if (pageId !== 'page-login') {
    document.getElementById('main-nav').classList.remove('hidden');
  }

  if (pageId === 'page-minigame-catch') resizeCanvas();
}

/* =========================================
   2. LOGIN AMIGABLE
   ========================================= */
function verifyLogin() {
  const apodo = document.getElementById('auth-apodo').value.toLowerCase().trim();
  const colores = document.getElementById('auth-colores').value.toLowerCase().trim();
  const comida = document.getElementById('auth-comida').value.toLowerCase().trim();
  const cumple = document.getElementById('auth-cumple').value.trim();
  const errorBox = document.getElementById('login-error');

  const isApodoValid = apodo.includes('kuchit'); 
  const isColoresValid = colores.includes('morado') && colores.includes('verde');
  const isComidaValid = comida.includes('ceviche');
  const isCumpleValid = cumple === '05/11/2002' || cumple === '05-11-2002' || cumple === '5/11/2002';

  if (isApodoValid && isColoresValid && isComidaValid && isCumpleValid) {
    isUnlocked = true;
    errorBox.innerText = "";
    navigate('page-dashboard');
  } else {
    errorBox.innerText = "Uy, algo pusiste mal amor jajaja. Fíjate bien y vuelve a intentar.";
    const card = document.querySelector('.login-card');
    card.style.transform = "translateX(-10px)";
    setTimeout(() => card.style.transform = "translateX(10px)", 100);
    setTimeout(() => card.style.transform = "translateX(0)", 200);
  }
}

/* =========================================
   3. JARDÍN INTERACTIVO
   ========================================= */
function plantFlower(e) {
  const garden = document.getElementById('interactive-garden-area');
  const rect = garden.getBoundingClientRect();
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const flower = document.createElement('div');
  flower.className = 'garden-flower';
  flower.style.left = `${x}px`;
  flower.style.top = `${y}px`;
  flower.innerHTML = `
    <svg viewBox="0 0 100 100">
      <path d="M50,100 L50,60" stroke="#16a34a" stroke-width="4"/>
      <circle cx="50" cy="50" r="15" fill="#facc15"/>
      <circle cx="50" cy="30" r="12" fill="#facc15"/>
      <circle cx="70" cy="50" r="12" fill="#facc15"/>
      <circle cx="50" cy="70" r="12" fill="#facc15"/>
      <circle cx="30" cy="50" r="12" fill="#facc15"/>
      <circle cx="50" cy="50" r="8" fill="#451a03"/>
    </svg>
  `;
  garden.appendChild(flower);
}

function clearGarden() {
  document.getElementById('interactive-garden-area').innerHTML = '';
}

/* =========================================
   4. MINIJUEGO: ATRAPA PÉTALOS
   ========================================= */
const canvas = document.getElementById('catch-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let score = 0;
let gameTime = 30;
let isPlayingCatch = false;
let mouseX = 0;
let timerInterval;

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth - 40; 
  canvas.height = 400; 
  mouseX = canvas.width / 2;
}
window.addEventListener('resize', () => { if(isPlayingCatch) resizeCanvas(); });

class Petal {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 8 + 8;
    this.speed = Math.random() * 3 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.1;
  }
  update() { this.y += this.speed; this.angle += this.spin; }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#ffc107';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); 
  const rect = canvas.getBoundingClientRect();
  mouseX = e.touches[0].clientX - rect.left;
}, { passive: false });

function startCatchGame() {
  if (isPlayingCatch) return;
  resizeCanvas();
  isPlayingCatch = true;
  score = 0;
  gameTime = 30;
  particles = [];
  document.getElementById('score-catch').innerText = score;
  document.getElementById('btn-start-catch').innerText = "¡Corre, atrápalos!";
  
  timerInterval = setInterval(() => {
    gameTime--;
    document.getElementById('time-catch').innerText = gameTime;
    if (gameTime <= 0) endGameCatch();
  }, 1000);
  
  gameLoop();
}

function gameLoop() {
  if (!isPlayingCatch) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(mouseX - 40, canvas.height - 25, 80, 25);
  ctx.fillStyle = 'white';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText("Aquí", mouseX, canvas.height - 8);
  
  if (Math.random() < 0.08) particles.push(new Petal()); 
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    if (p.y > canvas.height - 25 && p.x > mouseX - 40 && p.x < mouseX + 40) {
      score += 10;
      document.getElementById('score-catch').innerText = score;
      particles.splice(i, 1);
    } else if (p.y > canvas.height) {
      particles.splice(i, 1);
    }
  }
  currentGameInterval = requestAnimationFrame(gameLoop);
}

function endGameCatch() {
  isPlayingCatch = false;
  clearInterval(timerInterval);
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffc107';
  ctx.font = '22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`¡Tiempo! Hiciste ${score} puntos ✨`, canvas.width/2, canvas.height/2);
  document.getElementById('btn-start-catch').innerText = "Jugar otra vez";
}

/* =========================================
   5. JUEGO DE MEMORIA
   ========================================= */
const memoryEmojis = ['🌻','🌼','🌞','🐝','🍯','🍋','🏵️','💛'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  document.getElementById('memory-victory').classList.add('hidden');
  matchedPairs = 0;
  moves = 0;
  document.getElementById('moves-count').innerText = moves;
  
  memoryCards = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
  
  memoryCards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.value = emoji;
    card.dataset.index = index;
    card.innerHTML = `<div class="front">?</div><div class="back">${emoji}</div>`;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  flippedCards.push(card);
  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves-count').innerText = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (c1.dataset.value === c2.dataset.value) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === memoryEmojis.length) {
      setTimeout(() => document.getElementById('memory-victory').classList.remove('hidden'), 500);
    }
  } else {
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}
initMemoryGame();

/* =========================================
   6. DESCARGAS (PNG y SVG Animado)
   ========================================= */

// Descargar Foto Estática (Alta Resolución)
function downloadHighResPNG() {
  const btn = document.getElementById('btn-download-png');
  const targetElement = document.getElementById('art-to-download');
  
  btn.innerHTML = "<span>Preparando foto... ⏳</span>";
  btn.style.opacity = "0.7";
  btn.disabled = true;

  html2canvas(targetElement, { scale: 4, useCORS: true, backgroundColor: '#020617', logging: false }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = `Flores-Kuchita-Foto.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    btn.innerHTML = "<span>¡Foto Guardada! 📸</span>";
    btn.style.opacity = "1";
    setTimeout(() => { btn.innerHTML = "<span>Guardar Foto HD (Fija) 📸</span>"; btn.disabled = false; }, 4000);
  }).catch(err => {
    btn.innerHTML = "<span>Error. Intenta de nuevo.</span>";
    btn.disabled = false;
  });
}

// Descargar Archivo Animado SVG (Conservando todo el movimiento y diseño)
function downloadAnimatedSVG() {
  const btn = document.getElementById('btn-download-svg');
  const svgElement = document.getElementById('flower-svg-export');
  
  btn.innerHTML = "<span>Generando flor mágica... ✨</span>";
  btn.disabled = true;

  try {
    // Clonamos el SVG para asegurarnos de que guarda el estado exacto (con los 72 pétalos de JS)
    const clone = svgElement.cloneNode(true);
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(clone);

    // Aseguramos que tenga los atributos necesarios de un archivo SVG
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    // Declaración XML
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // Convertir a Data URI y Forzar Descarga
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Flor-Animada-Kuchita.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    btn.innerHTML = "<span>¡Flor descargada! ✨</span>";
    setTimeout(() => { btn.innerHTML = "<span>Descargar Flor Animada (Movimiento) ✨</span>"; btn.disabled = false; }, 4000);

  } catch (err) {
    console.error(err);
    btn.innerHTML = "<span>Error al descargar.</span>";
    btn.disabled = false;
  }
}
