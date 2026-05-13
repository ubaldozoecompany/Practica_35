//Se define la url de la API
const url_api = 'https://api.tvmaze.com/shows';


const createShowCard = (show) => {
    const card = document.createElement("section");
    card.classList.add("show-card");

    const infoDiv = document.createElement("article");
    infoDiv.classList.add("show-info" );

    const name = document.createElement("h2");
    name.classList.add("show-name");
    name.textContent = show.name;

    const gener = document.createElement("p");
    gener.classList.add("show-gener");
    gener.textContent = `Genero: ${show.genres}`;

    const url = document.createElement("a");
    url.setAttribute("target", "_blank");
    url.setAttribute("rel", "_blank","noreferer noopener nofollow");
    url.classList.add("show-url");
    url.href = show.url;
    url.textContent = "Ver más";
    url.target = "_blank";

    infoDiv.appendChild(name);
    infoDiv.appendChild(gener);
    infoDiv.appendChild(url);

    card.appendChild(infoDiv);

    const imageContainer = document.createElement("figure");
    imageContainer.classList.add("show-image-continer" );

    if (show.image && show.image.medium) {
        const img = document.createElement("img" , alt="Imagen de ${show.name}" );
        img.classList.add("show-image" );
        img.src = show.image.medium;
        img.alt = show.name;

        imageContainer.appendChild(img);

        card.appendChild(imageContainer);
    }
    return card;
};
//funcion para cargar las series
const loadShows = async () => {
    const showGrid = document.getElementById("show-grid");
    try {
        const response = await axios.get(url_api);
        const shows = response.data;

        showGrid.innerHTML = '';

        for (const show of shows) {
            const showCard = createShowCard(show);
            showGrid.appendChild(showCard);
        }
    } catch (error) {
        console.log("Error fetch: ", error);
    }
};

// Función para buscar shows por nombre
const searchShows = async () => {
    const query = document.getElementById("shows-search").value;
    const showGrid = document.getElementById("show-grid");

    if (!query) {
        loadShows();
        return;
    }

    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
        const results = response.data;

        showGrid.innerHTML = '';

        for (const result of results) {
            const showCard = createShowCard(result.show);
            showGrid.appendChild(showCard);
        }
    } catch (error) {
        console.log("Error búsqueda: ", error);
    }
};


document.addEventListener("DOMContentLoaded", loadShows);
document.getElementById("search-button").addEventListener("click", searchShows);

//______

const chatToggleBtn = document.getElementById('chatToggleBtn');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatContainer = document.getElementById('chatContainer');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Base de conocimientos del chatbot con respuestas predefinidas para ciertas preguntas o palabras clave.
const respuestas = {
    "hola": "¡Hola! ¿Cómo estás? ¿En qué te puedo colaborar?",
    "adios": "¡Hasta luego! Que tengas un excelente día.",
    "como estas": "Estoy bien, gracias por preguntar..",
    "recomiendame": "¿Que deseas ver series o peliculas?",
    "peliculas": "Te recomiendo ver 'La naranja mecanica' o la saga de 'Jhon Wick'.",
    "series": "Te recomiendo ver 'Breaking Bad' o 'Peaky blinders'.",
    "que puedes hacer": "Puedo responder a tus preguntas básicas..",
    "gracias": "De nada! Si tienes más preguntas, no dudes en preguntar.",
    "contacto": "Puedes escribirnos al correo ubaldozoe@correo.com.",
};
chatToggleBtn.addEventListener('click', () => {
    chatContainer.classList.remove('idden');
    chatToggleBtn.style.display = 'none';
});

closeChatBtn.addEventListener('click', () => {
    chatContainer.classList.add('idden');
    chatToggleBtn.style.display = 'block';
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    appendMessage(text, 'user-message');
    userInput.value = "";

    // Crear y mostrar indicador de "Respondiendo..."
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-dots');
    typingIndicator.innerHTML = '<span>Respondiendo...</span>';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simular tiempo de procesamiento (1.5 segundos)
    setTimeout(() => {
        // Eliminar indicador de carga
        chatBox.removeChild(typingIndicator);
        
        // Agregar respuesta real
        const botReply = getBotResponse(text);
        appendMessage(botReply, 'bot-message');
    }, 1500);
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(message) {
    const cleanMessage = message.toLowerCase();
    
    for (const clave in respuestas) {
        if (cleanMessage.includes(clave)) {
            return respuestas[clave];
        }
    }
    
    return "Lo siento, no entiendo tu pregunta. Intenta con, 'recomendar' , 'series', 'peliculas'.";
}
