const apiUrl = 'https://rickandmortyapi.com/api/character';
const cardGrid = document.getElementById('card-grid');
const feedback = document.getElementById('feedback');

// Exibe um estado de carregamento enquanto os dados são buscados
function showLoading() {
  feedback.innerHTML = `
    <div class="spinner-area">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 mb-0">Carregando personagens...</p>
      </div>
    </div>
  `;
}

// Exibe uma mensagem de erro amigável na interface
function showError(message) {
  feedback.innerHTML = `
    <div class="error-message">
      <div>
        <h5>Ops! Algo deu errado.</h5>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `;
}

// Gera o HTML de um card para cada personagem
function createCharacterCard(character) {
  return `
    <div class="col-sm-6 col-lg-4">
      <div class="card card-custom h-100">
        <img src="${character.image}" class="card-img-top" alt="${character.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${character.name}</h5>
          <p class="card-text text-muted mb-3">${character.species} - ${character.status}</p>
          <a href="detalhes.html?id=${character.id}" class="btn btn-primary mt-auto">Ver detalhes</a>
        </div>
      </div>
    </div>
  `;
}

// Renderiza a lista de personagens na página principal
function renderCharacters(characters) {
  const cards = characters.map(createCharacterCard).join('');
  cardGrid.innerHTML = cards;
  feedback.innerHTML = '';
}

// Busca personagens da API usando async/await
async function fetchCharacters() {
  try {
    showLoading();
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Não foi possível obter a lista de personagens.');
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      showError('Nenhum personagem encontrado na API.');
      return;
    }

    renderCharacters(data.results);
  } catch (error) {
    showError(error.message);
  }
}

// Inicializa a página ao carregar
document.addEventListener('DOMContentLoaded', fetchCharacters);
