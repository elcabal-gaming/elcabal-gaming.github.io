// Función para ajustar el texto según el tamaño de la pantalla
function adjustFortniteText() {
    const fortniteText = document.querySelector('.fortnite-text');

    // Verificar si el ancho y alto de la pantalla coinciden con 370x554
    if (window.innerWidth <= 370 && window.innerHeight <= 554) {
        fortniteText.textContent = 'E'; // Cambiar el texto a "E"
    } else {
        fortniteText.textContent = 'ELCABAL'; // Restaurar el texto original
    }
}

// Llamar a la función al cargar la página
adjustFortniteText();

// Escuchar cambios en el tamaño de la ventana
window.addEventListener('resize', adjustFortniteText);

// Variables globales
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let isDragging = false;
let startX = 0;
let startY = 0; // Variable para detectar movimiento vertical
let scrollLeft = 0;
let isVerticalScroll = false;

// Intervalo automático
let autoSlideInterval;

// Función para mostrar un slide específico
function showSlide(index) {
    // Ocultar todos los slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });

    // Mostrar el slide actual
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    // Ajustar el scrollLeft para que coincida con el slide activo
    slidesContainer.scrollLeft = slides[currentSlide].offsetLeft;
}

// Función para avanzar al siguiente slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Función para iniciar el slider automático
function startAutoSlide() {
    // Detener cualquier intervalo existente antes de iniciar uno nuevo
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 3000); // Cambio cada 3 segundos
}

// Función para detener el slider automático
function stopAutoSlide() {
    clearInterval(autoSlideInterval); // Detener el intervalo automático
}

// Función para pausar el slider automático durante 2 segundos y luego reanudarlo
function pauseAutoSlide() {
    stopAutoSlide(); // Detener el intervalo automático
    setTimeout(() => {
        startAutoSlide(); // Reanudar el intervalo después de 2 segundos
    }, 2000);
}

// Inicializar el slider automático al cargar la página
startAutoSlide();

// Evento para cambiar el slide manualmente al hacer clic en los puntos
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Pausar el slider automático
        pauseAutoSlide();

        // Mostrar el slide seleccionado
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Inicializar el slider mostrando el primer slide
showSlide(currentSlide);

// Función para iniciar el arrastre
function startDrag(e) {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX; // Posición inicial del mouse/touch
    startY = e.pageY || e.touches[0].pageY; // Posición inicial vertical
    scrollLeft = slidesContainer.scrollLeft; // Posición inicial del scroll
    slidesContainer.style.cursor = 'grabbing'; // Cambia el cursor

    // Detectar si el movimiento inicial es vertical
    document.addEventListener('touchmove', detectVerticalScroll);
    function detectVerticalScroll(e) {
        const deltaY = Math.abs((e.pageY || e.touches[0].pageY) - startY);
        if (deltaY > 10) { // Umbral para detectar scroll vertical
            isVerticalScroll = true;
            stopDrag();
        }
    }
}

// Función para manejar el arrastre
function drag(e) {
    if (!isDragging || isVerticalScroll) return; // Si no estamos arrastrando o es scroll vertical, salir
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX; // Posición actual del mouse/touch
    const walk = (x - startX) * 2; // Distancia recorrida
    slidesContainer.scrollLeft = scrollLeft - walk; // Actualiza el scroll
}

// Función para detener el arrastre
function stopDrag(e) {
    isDragging = false;
    slidesContainer.style.cursor = 'grab'; // Restaura el cursor
    document.removeEventListener('touchmove', detectVerticalScroll);

    if (!isVerticalScroll) {
        const endX = e.pageX || e.changedTouches[0].pageX;
        const threshold = 50;

        if (startX - endX > threshold) {
            // Deslizamiento hacia la izquierda: avanza al siguiente slide
            nextSlide();
        } else if (endX - startX > threshold) {
            // Deslizamiento hacia la derecha: retrocede al slide anterior
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
    }

    isVerticalScroll = false; // Restablecer el estado
    pauseAutoSlide();
}

// Eventos para mouse
slidesContainer.addEventListener('mousedown', startDrag);
slidesContainer.addEventListener('mousemove', drag);
slidesContainer.addEventListener('mouseup', stopDrag);
slidesContainer.addEventListener('mouseleave', stopDrag);

// Eventos para touch (dispositivos móviles)
slidesContainer.addEventListener('touchstart', startDrag);
slidesContainer.addEventListener('touchmove', drag);
slidesContainer.addEventListener('touchend', stopDrag);

// MENÚ PRINCIPAL (For You, Patch, Events, etc.)
const menuIconMain = document.querySelector('.menu-icon');
const dropdownMenuMain = document.querySelector('.dropdown-menu');

menuIconMain.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el evento se propague al documento
    dropdownMenuMain.classList.toggle('active'); // Alterna la clase "active"
});

// Cerrar el menú principal al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!menuIconMain.contains(e.target) && !dropdownMenuMain.contains(e.target)) {
        dropdownMenuMain.classList.remove('active'); // Oculta el menú
    }
});

// MENÚ DE ROLES (Combatientes, Apoyo)
const expandIconRoles = document.querySelector('.expand-icon-roles');
const dropdownMenuRoles = document.querySelector('.dropdown-menu-roles');

expandIconRoles.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el evento se propague al documento
    dropdownMenuRoles.classList.toggle('active'); // Alterna la clase "active"
});

// Cerrar el menú de roles al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!expandIconRoles.contains(e.target) && !dropdownMenuRoles.contains(e.target)) {
        dropdownMenuRoles.classList.remove('active'); // Oculta el menú
    }
});

// NUEVA FUNCIONALIDAD: Scroll suave al hacer clic en opciones del submenú
const submenuItems = document.querySelectorAll('.submenu-item');

submenuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

        // Eliminar la clase 'active' de todos los elementos
        submenuItems.forEach((menuItem) => {
            menuItem.classList.remove('active');
        });

        // Agregar la clase 'active' al elemento seleccionado
        item.classList.add('active');

        // Obtener el ID de la sección objetivo desde el atributo 'href'
        const targetSectionId = e.target.getAttribute('href').substring(1); // Elimina el '#' inicial

        // Hacer scroll suave hacia la sección correspondiente
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth', // Añade la transición suave
            });
        }
    });
});
