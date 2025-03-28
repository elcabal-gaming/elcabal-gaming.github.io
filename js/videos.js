// Toggle Menu Dropdown
document.getElementById('menuIcon').addEventListener('click', function () {
  const menuDropdown = document.getElementById('menuDropdown');
  menuDropdown.classList.toggle('active');
});

// Variables Globales
const videoPlayer = document.getElementById('videoPlayer');
const videoCover = document.getElementById('videoCover');
const playButton = document.getElementById('playButton');

// Configuración de JSONBin.io
const BIN_URL = "https://api.jsonbin.io/v3/b/67c486b5acd3cb34a8f3abd9"; // URL del bin
const SECRET_KEY = "$2a$10$7AAShAcznvVzanv4tgOsj.me3QsqDU75x8wllUwVRjPrwVWUNyn0q"; // Tu X-Master-Key

// Función para obtener el número de visitas
async function getVisits() {
  try {
    const response = await fetch(BIN_URL, {
      method: "GET",
      headers: {
        "X-Master-Key": SECRET_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener las visitas: ${response.status}`);
    }
    const data = await response.json();
    return data.record.visits || 0; // Devuelve el valor actual de "visits"
  } catch (error) {
    console.error("Error al obtener las visitas:", error);
    return 0;
  }
}

// Función para incrementar el número de visitas
async function incrementVisits() {
  try {
    const currentVisits = await getVisits(); // Obtiene el número actual de visitas
    const response = await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": SECRET_KEY,
      },
      body: JSON.stringify({ visits: currentVisits + 1 }), // Incrementa el contador
    });
    if (!response.ok) {
      throw new Error(`Error al incrementar las visitas: ${response.status}`);
    }
  } catch (error) {
    console.error("Error al incrementar las visitas:", error);
  }
}

// Mostrar las visitas cuando la página carga
document.addEventListener("DOMContentLoaded", async () => {
  const viewCountElement = document.getElementById("viewCount"); // Elemento donde se muestran las visitas

  // Obtener y mostrar el número actual de visitas
  const visits = await getVisits();
  viewCountElement.textContent = `${visits} views`;

  // Incrementar las visitas cuando se reproduce el video
  const handleVideoPlay = async () => {
    await incrementVisits(); // Incrementa las visitas
    const newVisits = await getVisits(); // Obtiene el nuevo valor
    viewCountElement.textContent = `${newVisits} views`; // Actualiza el texto
  };

  // Asegurarse de que las visitas solo se incrementen una vez por sesión
  let hasIncrementedVisits = false;

  playButton.addEventListener("click", async () => {
    if (!hasIncrementedVisits) {
      await handleVideoPlay();
      hasIncrementedVisits = true; // Marcar como incrementado
    }
  });

  videoCover.addEventListener("click", async () => {
    if (!hasIncrementedVisits) {
      await handleVideoPlay();
      hasIncrementedVisits = true; // Marcar como incrementado
    }
  });

  // Reproducir el video al hacer clic en el botón de reproducción
  playButton.addEventListener("click", () => {
    videoPlayer.play();
    videoCover.classList.add("hidden"); // Ocultar la imagen de portada
  });

  // Reproducir el video al hacer clic en la imagen de portada
  videoCover.addEventListener("click", () => {
    videoPlayer.play();
    videoCover.classList.add("hidden"); // Ocultar la imagen de portada
  });
});

// Lazy Loading para Imágenes
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function lazyLoadImages() {
  const images = document.querySelectorAll('.lazy-load');
  images.forEach((img) => {
    if (isElementInViewport(img)) {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc && !img.classList.contains('loaded')) {
        img.src = dataSrc;
        img.onload = () => img.classList.add('loaded');
      }
    }
  });
}

window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);
window.addEventListener('load', lazyLoadImages);
document.addEventListener('touchmove', lazyLoadImages);
