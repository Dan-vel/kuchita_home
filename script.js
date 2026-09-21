/* =========================================
   LÓGICA DE NAVEGACIÓN
   ========================================= */
let isUnlocked = false;
let currentGameInterval = null;

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
}

/* =========================================
   LOGIN (Con respuestas amigables)
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
  const isCumpleValid = cumple === '05/11/2002' || cumple === '05-11-2002';

  if (isApodoValid && isColoresValid && isComidaValid && isCumpleValid) {
    isUnlocked = true;
    errorBox.innerText = "";
    navigate('page-dashboard');
  } else {
    // Texto mucho más natural y casual
    errorBox.innerText = "Uy, algo pusiste mal amor jajaja. Fíjate bien y vuelve a intentar.";
    
    const card = document.querySelector('.login-card');
    card.style.transform = "translateX(-10px)";
    setTimeout(() => card.style.transform = "translateX(10px)", 100);
    setTimeout(() => card.style.transform = "translateX(0)", 200);
  }
}

/* =========================================
   JARDÍN INTERACTIVO
   ========================================= */
function plantFlower(e) {
  const garden = document.getElementById('interactive-garden-area');
  const rect = garden.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

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
   ATRAPA PÉTALOS
   ========================================= */
const canvas = document.getElementById('catch-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let score = 0;
let gameTime = 30;
let isPlayingCatch = false;
let mouseX = 0;
let timerInterval;

canvas.width = 800;
canvas.height = 500;

class Petal {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 10 + 10;
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
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
});

function startCatchGame() {
  if (isPlayingCatch) return;
  isPlayingCatch = true;
  score = 0;
  gameTime = 30;
  particles = [];
  document.getElementById('score-catch').innerText = score;
  document.getElementById('btn-start-catch').innerText = "¡Jugando! Corre...";
  
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
  ctx.fillRect(mouseX - 40, canvas.height - 20, 80, 20);
  
  if (Math.random() < 0.1) particles.push(new Petal());
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    
    if (p.y > canvas.height - 20 && p.x > mouseX - 40 && p.x < mouseX + 40) {
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
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#facc15';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`¡Se acabó el tiempo! Hiciste ${score} puntos ✨`, canvas.width/2, canvas.height/2);
  document.getElementById('btn-start-catch').innerText = "Jugar otra vez";
}

/* =========================================
   MEMORIA
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
   BOTÓN DE DESCARGA DE LA FOTO
   ========================================= */
function downloadHighResArt() {
  const btn = document.getElementById('btn-download');
  const targetElement = document.getElementById('art-to-download');
  
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
    link.download = `Flores-Kuchita-21Sept.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    btn.innerHTML = "<span>¡Lista! Revisa tus descargas 💛</span>";
    btn.style.opacity = "1";
    
    setTimeout(() => {
      btn.innerHTML = "<span>Guardar foto en mi celular 📸</span>";
      btn.disabled = false;
    }, 4000);
  }).catch(err => {
    console.error("Error:", err);
    btn.innerHTML = "<span>Uy, no quiso cargar. Intenta de nuevo.</span>";
    btn.disabled = false;
  });
}