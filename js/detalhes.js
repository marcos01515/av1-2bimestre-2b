const detailsContainer = document.getElementById('details-content');
const feedback = document.getElementById('feedback');
const apiBaseUrl = 'https://rickandmortyapi.com/api/character';

// Exibe loading enquanto busca o item
function showLoading() {
  feedback.innerHTML = `
    <div class="spinner-area">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 mb-0">Carregando detalhes...</p>
      </div>
    </div>
  `;
}

// Exibe uma mensagem de erro amigável no local de feedback
function showError(message) {
  feedback.innerHTML = `
    <div class="error-message">
      <div>
        <h5>Não foi possível carregar o personagem.</h5>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `;
}

// Cria o conteúdo HTML dos detalhes do personagem
function renderDetails(character) {
  detailsContainer.innerHTML = `
    <div class="detail-card row g-4 align-items-center">
      <div class="col-md-5 text-center">
        <img src="${character.image}" alt="${character.name}" class="img-fluid mb-3">
      </div>
      <div class="col-md-7">
        <h2>${character.name}</h2>
        <p class="text-muted mb-4">${character.species} • ${character.status} • ${character.gender}</p>
        <ul class="list-unstyled mb-4">
          <li><span class="list-label">Origem:</span> ${character.origin.name}</li>
          <li><span class="list-label">Localização:</span> ${character.location.name}</li>
          <li><span class="list-label">Tipo:</span> ${character.type || 'Não informado'}</li>
          <li><span class="list-label">Episódios:</span> ${character.episode.length}</li>
        </ul>
        <a href="index.html" class="btn btn-primary">Voltar à listagem</a>
      </div>
    </div>
  `;
  feedback.innerHTML = '';
}

// Captura o ID do parâmetro da URL usando URLSearchParams
function getCharacterIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Busca os detalhes do personagem na API
async function fetchCharacterDetails(id) {
  try {
    showLoading();
    const response = await fetch(`${apiBaseUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Personagem não encontrado. Verifique o ID e tente novamente.');
      }
      throw new Error('Erro ao carregar o personagem. Tente novamente mais tarde.');
    }

    const data = await response.json();
    renderDetails(data);
  } catch (error) {
    showError(error.message);
  }
}

// Inicializa a página de detalhes
document.addEventListener('DOMContentLoaded', () => {
  const characterId = getCharacterIdFromUrl();
  if (!characterId) {
    showError('Nenhum ID de personagem foi informado na URL.');
    return;
  }

  fetchCharacterDetails(characterId);
});
