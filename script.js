/* =========================================
   1. SISTEMA DE ENRUTAMIENTO Y ESTADO
   ========================================= */
let isUnlocked = false;
let currentGameInterval = null;

// Construcción del Girasol Detallado (Se inyecta al cargar)
function drawDetailedPetals() {
  const container = document.getElementById('detailed-petals');
  if (!container) return;
  
  let petalsHTML = '';
  // Capa 1: Grandes (Fondo)
  for(let i=0; i<12; i++) {
    let angle = i * 30;
    petalsHTML += `<path d="M0,0 C-30,-60 0,-110 0,-110 C0,-110 30,-60 0,0" fill="url(#petal-grad1)" transform="rotate(${angle}) scale(1)"/>`;
  }
  // Capa 2: Medianas (Medio)
  for(let i=0; i<12; i++) {
    let angle = (i * 30) + 15;
    petalsHTML += `<path d="M0,0 C-25,-50 0,-95 0,-95 C0,-95 25,-50 0,0" fill="url(#petal-grad2)" transform="rotate(${angle}) scale(0.95)"/>`;
  }
  // Capa 3: Pequeñas (Frente)
  for(let i=0; i<12; i++) {
    let angle = (i * 30) + 7.5;
    petalsHTML += `<path d="M0,0 C-20,-40 0,-75 0,-75 C0,-75 20,-40 0,0" fill="#FFC107" transform="rotate(${angle}) scale(0.85)"/>`;
  }
  container.innerHTML = petalsHTML;
}

// Ejecutar al iniciar
document.addEventListener("DOMContentLoaded", () => {
  drawDetailedPetals();
  checkDownloadStatus();
});

function navigate(pageId) {
  if (!isUnlocked && pageId !== 'page-login') return; 
  
  // Limpiar juegos al salir de la pestaña
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

  // Ajustar tamaño del canvas al entrar a su página para evitar errores de renderizado
  if (pageId === 'page-minigame-catch') {
    resizeCanvas();
  }
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
  
  // Soporte para touch o click
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
   4. MINIJUEGO: ATRAPA PÉTALOS (Mejorado para Touch)
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
  // Ajusta el canvas al tamaño del contenedor padre
  canvas.width = canvas.parentElement.clientWidth - 40; // restando padding
  canvas.height = 400; // altura fija razonable para cel y pc
  mouseX = canvas.width / 2; // Iniciar en el centro
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
  update() {
    this.y += this.speed;
    this.angle += this.spin;
  }
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

// Seguimiento del Mouse (PC)
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// Seguimiento del Dedo (Celular)
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Evita que la pantalla haga scroll mientras juega
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
  
  // Dibujar la Canasta (Rectángulo verde centrado en el mouse)
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(mouseX - 40, canvas.height - 25, 80, 25);
  
  // Agregar texto en la canasta
  ctx.fillStyle = 'white';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText("Aquí", mouseX, canvas.height - 8);
  
  if (Math.random() < 0.08) particles.push(new Petal()); // Dificultad ajustada
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    
    // Colisión mejorada
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
    card.innerHTML = `
      <div class="front">?</div>
      <div class="back">${emoji}</div>
    `;
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
   6. BLOQUEO Y DESCARGA HD DE LA FLOR
   ========================================= */
const DOWNLOAD_KEY = 'kuchita_flower_downloaded_2026';

function checkDownloadStatus() {
  const isDownloaded = localStorage.getItem(DOWNLOAD_KEY);
  const btn = document.getElementById('btn-download');
  const warning = document.getElementById('download-warning');
  
  if (isDownloaded === 'true') {
    btn.innerHTML = "<span>Ya guardaste este recuerdo 💛</span>";
    btn.disabled = true;
    warning.innerText = "Esta flor ya fue guardada en tu corazón (y en tu galería).";
    warning.style.color = "#a7f3d0"; // Color verde suave indicando éxito
  }
}

function downloadHighResArt() {
  const btn = document.getElementById('btn-download');
  const warning = document.getElementById('download-warning');
  const targetElement = document.getElementById('art-to-download');
  
  // Verificación de seguridad extra
  if(localStorage.getItem(DOWNLOAD_KEY) === 'true') return;
  
  btn.innerHTML = "<span>Preparando la foto... aguanta un ratito ⏳</span>";
  btn.style.opacity = "0.7";
  btn.disabled = true;

  const options = {
    scale: 4, 
    useCORS: true,
    backgroundColor: '#020617',
    logging: false
  };

  html2canvas(targetElement, options).then(canvas => {
    const imageData = canvas.toDataURL('image/png', 1.0);
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `Flores-Kuchita-EdicionUnica.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // GUARDAR EN LOCALSTORAGE PARA BLOQUEAR FUTURAS DESCARGAS
    localStorage.setItem(DOWNLOAD_KEY, 'true');
    
    btn.innerHTML = "<span>¡Lista! Revisa tus descargas 💛</span>";
    btn.style.opacity = "1";
    warning.innerText = "¡Descargada con éxito! Esta flor ya es tuya para siempre.";
    warning.style.color = "#a7f3d0";
    
  }).catch(err => {
    console.error("Error al descargar:", err);
    btn.innerHTML = "<span>Uy, no quiso cargar. Intenta de nuevo.</span>";
    btn.disabled = false;
  });
}
