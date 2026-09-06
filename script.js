// --- CONFIGURACIÓN ---
const MI_CUMPLEANOS = "24/09"; // REEMPLAZA ESTO CON LA FECHA DE TU CUMPLEAÑOS

// --- REFERENCIAS AL DOM ---
const stage1 = document.getElementById('stage-1');
const stage2 = document.getElementById('stage-2');
const stage3 = document.getElementById('stage-3');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const logsContainer = document.getElementById('terminal-logs');
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const successContainer = document.getElementById('success-container');

// --- ETAPA 1: VALIDACIÓN DEL FORMULARIO ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('user-name').value.trim();
    const userPin = document.getElementById('user-pin').value.trim();

    if (userPin !== MI_CUMPLEANOS) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    stage1.classList.add('hidden');
    stage2.classList.remove('hidden');
    
    // Iniciar la secuencia de la consola
    startTerminalSequence(userName);
});

// --- ETAPA 2: SECUENCIA DE CONSOLA ---
async function startTerminalSequence(name) {
    const messages = [
        `> Autenticando usuario: ${name}... [OK]`,
        `> Accediendo al servidor principal... [OK]`,
        `> Cargando recuerdos compartidos... [100%]`,
        `> Desencriptando módulo de sentimientos...`,
        `> WARNING: Nivel de compatibilidad extremo detectado.`,
        `> Ejecutando archivo: la_pregunta_mas_importante.exe...`
    ];

    for (let i = 0; i < messages.length; i++) {
        await typeLine(messages[i]);
    }

    // Transición a la etapa 3 después del último mensaje
    setTimeout(() => {
        stage2.classList.add('hidden');
        stage3.classList.remove('hidden');
    }, 1500);
}

function typeLine(text) {
    return new Promise(resolve => {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = text;
        logsContainer.appendChild(line);
        
        // Remover el cursor parpadeante de las líneas anteriores
        const allLines = document.querySelectorAll('.log-line');
        if(allLines.length > 1) {
            allLines[allLines.length - 2].style.borderRight = 'none';
        }

        setTimeout(resolve, 1500); // Tiempo entre cada línea
    });
}

// --- ETAPA 3: LA PROPUESTA (Botón escurridizo) ---
const huirBoton = (e) => {
    if(e && e.type === 'touchstart') e.preventDefault(); 
    const maxX = window.innerWidth - btnNo.offsetWidth - 20;
    const maxY = window.innerHeight - btnNo.offsetHeight - 20;
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'fixed'; 
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
};

btnNo.addEventListener('mouseover', huirBoton);
btnNo.addEventListener('touchstart', huirBoton);

btnYes.addEventListener('click', () => {
    // Confeti
    var duration = 3 * 1000;
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f472b6', '#10b981', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#f472b6', '#10b981', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // Ocultar botones y mostrar éxito
    document.querySelector('.buttons-container').classList.add('hidden');
    document.querySelector('.big-question').classList.add('hidden');
    
    successContainer.innerHTML = `
        <div class="success-message">
            > COMPILACIÓN EXITOSA <br><br>
            > Te quiero mucho ❤️<br>
            > Oficialmente en producción.
        </div>
    `;
});
