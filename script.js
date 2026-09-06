const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const contentDiv = document.getElementById('content');

// Función principal de evasión
const huirBoton = (e) => {
    // Si es un evento táctil, prevenimos que el click se registre
    if(e && e.type === 'touchstart') {
        e.preventDefault(); 
    }

    // Calculamos los límites de la pantalla restando el tamaño del botón
    // para que no se salga del viewport
    const maxX = window.innerWidth - btnNo.offsetWidth - 20;
    const maxY = window.innerHeight - btnNo.offsetHeight - 20;

    // Generamos coordenadas aleatorias seguras
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    // Cambiamos el botón a posición absoluta y lo movemos
    btnNo.style.position = 'fixed'; // Fixed funciona mejor en móviles que absolute
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
};

// Listeners para el botón "No"
btnNo.addEventListener('mouseover', huirBoton);
btnNo.addEventListener('touchstart', huirBoton);

// Listener para la resolución (Botón "Sí")
btnYes.addEventListener('click', () => {
    // 1. Disparar confeti
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#38bdf8', '#10b981', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#38bdf8', '#10b981', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // 2. Actualizar el DOM con el mensaje de éxito
    contentDiv.innerHTML = `
        <div class="success-message">
            > Status: 200 OK<br>
            > Pareja Encontrada<br>
            > Te quiero ❤️
        </div>
    `;
});
