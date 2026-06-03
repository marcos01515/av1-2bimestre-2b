const detailsContainer = document.getElementById('details-content');
const feedback = document.getElementById('feedback');
const apiBaseUrl = 'https://rickandmortyapi.com/api/character';

function showLoading(message = 'Carregando detalhes...') {
  feedback.innerHTML = `
    <div class="spinner-area">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 mb-0">${message}</p>
      </div>
    </div>
  `;
}

function showError(message) {
  feedback.innerHTML = `
    <div class="error-message">
      <div>
        <h5>Não foi possível carregar os detalhes.</h5>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `;
  detailsContainer.innerHTML = '';
}

function formatCreatedDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function getStatusBadge(status) {
  if (status === 'Alive') return '<span class="badge badge-custom badge-status-alive">Vivo</span>';
  if (status === 'Dead') return '<span class="badge badge-custom badge-status-dead">Morto</span>';
  return '<span class="badge badge-custom badge-status-unknown">Desconhecido</span>';
}

function renderDetails(character, locationInfo, episodes) {
  const locationDimension = locationInfo?.dimension || 'Não disponível';
  const locationType = locationInfo?.type || 'Não disponível';

  detailsContainer.innerHTML = `
    <div class="detail-card row g-4 align-items-center">
      <div class="col-md-5 text-center">
        <img src="${character.image}" alt="${character.name}" class="img-fluid mb-3">
      </div>
      <div class="col-md-7">
        <div class="mb-3">${getStatusBadge(character.status)}</div>
        <h2>${character.name}</h2>
        <p class="text-muted mb-4">${character.species} • ${character.gender} • Criado em ${formatCreatedDate(character.created)}</p>
        <div class="row g-3 mb-4">
          <div class="col-sm-6">
            <div class="p-3 bg-light rounded-4">
              <span class="list-label">Origem</span>
              <p class="mb-0">${character.origin.name}</p>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 bg-light rounded-4">
              <span class="list-label">Localização</span>
              <p class="mb-0">${character.location.name}</p>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 bg-light rounded-4">
              <span class="list-label">Dimensão</span>
              <p class="mb-0">${locationDimension}</p>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 bg-light rounded-4">
              <span class="list-label">Tipo de local</span>
              <p class="mb-0">${locationType}</p>
            </div>
          </div>
        </div>

        <div>
          <h5 class="mb-3">Episódios relacionados</h5>
          <ul class="episode-list list-unstyled mb-4">
            ${episodes.length > 0 ? episodes.map(ep => `<li>${ep}</li>`).join('') : '<li class="text-muted">Nenhum episódio encontrado.</li>'}
          </ul>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <a href="index.html" class="btn btn-primary">Voltar à listagem</a>
          <a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary">Ver API oficial</a>
        </div>
      </div>
    </div>
  `;
  feedback.innerHTML = '';
}

function getCharacterIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

async function fetchLocationInfo(url) {
  if (!url) return null;
  return fetchJson(url);
}

function parseEpisodeIds(urls) {
  return urls
    .map(url => url.split('/').pop())
    .filter(Boolean)
    .join(',');
}

async function fetchEpisodeTitles(urls) {
  if (!urls || urls.length === 0) {
    return [];
  }

  const ids = parseEpisodeIds(urls);
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${ids}`);
  if (!response.ok) {
    return urls.map((_, index) => `Episódio ${index + 1}`);
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return data.map((episode) => `${episode.episode} - ${episode.name}`);
  }
  return [`${data.episode} - ${data.name}`];
}

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

    const character = await response.json();
    const [locationInfo, episodes] = await Promise.all([
      fetchLocationInfo(character.location.url),
      fetchEpisodeTitles(character.episode)
    ]);

    renderDetails(character, locationInfo, episodes);
  } catch (error) {
    showError(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const characterId = getCharacterIdFromUrl();
  if (!characterId) {
    showError('Nenhum ID de personagem foi informado na URL.');
    return;
  }

  fetchCharacterDetails(characterId);
});
