const apiUrl = 'https://rickandmortyapi.com/api/character';
const cardGrid = document.getElementById('card-grid');
const feedback = document.getElementById('feedback');
const infoPanel = document.getElementById('info-panel');
const paginationControls = document.getElementById('pagination-controls');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const statusSelect = document.getElementById('status-filter');
const genderSelect = document.getElementById('gender-filter');
const clearButton = document.getElementById('clear-filters');

const state = {
  page: 1,
  name: '',
  status: '',
  gender: ''
};

const statusLabel = {
  alive: 'Vivo',
  dead: 'Morto',
  unknown: 'Desconhecido'
};

const genderLabel = {
  female: 'Feminino',
  male: 'Masculino',
  genderless: 'Sem gênero',
  unknown: 'Desconhecido'
};

function showLoading(message = 'Carregando personagens...') {
  feedback.innerHTML = `
    <div class="spinner-area">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 mb-0">${message}</p>
      </div>
    </div>
  `;
  cardGrid.innerHTML = '';
  paginationControls.innerHTML = '';
  infoPanel.textContent = '';
}

function showError(message) {
  feedback.innerHTML = `
    <div class="error-message">
      <div>
        <h5>Ops! Algo deu errado.</h5>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `;
  cardGrid.innerHTML = '';
  paginationControls.innerHTML = '';
  infoPanel.textContent = '';
}

function createStatusBadge(status) {
  const className = status === 'Alive'
    ? 'badge-status-alive'
    : status === 'Dead'
      ? 'badge-status-dead'
      : 'badge-status-unknown';
  return `<span class="badge badge-custom ${className}">${status}</span>`;
}

function createCharacterCard(character) {
  return `
    <div class="col-sm-6 col-xl-4">
      <div class="card card-custom h-100">
        <img src="${character.image}" class="card-img-top" alt="${character.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${character.name}</h5>
          <p class="card-text text-muted mb-2">${character.species} • ${genderLabel[character.gender.toLowerCase()] || character.gender}</p>
          <div class="mb-3">${createStatusBadge(character.status)}</div>
          <div class="mt-auto d-grid gap-2">
            <button type="button" class="btn btn-outline-primary btn-show-episodes" data-id="${character.id}">Episódios</button>
            <a href="detalhes.html?id=${character.id}" class="btn btn-primary">Ver detalhes</a>
          </div>
        </div>
        <div class="card-footer text-muted small">
          Episódios: ${character.episode.length}
        </div>
      </div>
    </div>
  `;
}

function renderCharacters(characters) {
  const cards = characters.map(createCharacterCard).join('');
  cardGrid.innerHTML = cards;
  feedback.innerHTML = '';
}

function updateInfoPanel(info) {
  infoPanel.innerHTML = `
    <div><strong>Total de resultados:</strong> ${info.count.toLocaleString()}</div>
    <div><strong>Página:</strong> ${state.page} de ${info.pages}</div>
    <div><strong>Filtros:</strong> ${state.name || state.status || state.gender ? `"${state.name}" ${state.status ? '• ' + statusLabel[state.status] : ''} ${state.gender ? '• ' + genderLabel[state.gender] : ''}` : 'Nenhum filtro aplicado'}</div>
  `;
}

function updatePagination(info) {
  const prevDisabled = !info.prev ? 'disabled' : '';
  const nextDisabled = !info.next ? 'disabled' : '';

  paginationControls.innerHTML = `
    <button class="btn btn-outline-primary pagination-btn" ${prevDisabled} data-page="${state.page - 1}">Anterior</button>
    <span class="text-muted">Página ${state.page} de ${info.pages}</span>
    <button class="btn btn-primary pagination-btn" ${nextDisabled} data-page="${state.page + 1}">Próxima</button>
  `;

  paginationControls.querySelectorAll('button[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      const newPage = Number(button.dataset.page);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= info.pages) {
        fetchCharacters(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function getQueryUrl() {
  const params = new URLSearchParams();
  params.append('page', state.page);
  if (state.name) params.append('name', state.name);
  if (state.status) params.append('status', state.status);
  if (state.gender) params.append('gender', state.gender);
  return `${apiUrl}?${params.toString()}`;
}

function parseEpisodeIds(urls) {
  return urls
    .map(url => url.split('/').pop())
    .filter(Boolean)
    .join(',');
}

async function fetchEpisodesByUrls(urls) {
  const ids = parseEpisodeIds(urls);
  if (!ids) return [];

  const response = await fetch(`https://rickandmortyapi.com/api/episode/${ids}`);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return data.map((episode) => `${episode.episode} - ${episode.name}`);
  }
  return [`${data.episode} - ${data.name}`];
}

function renderEpisodesModal(character, episodes) {
  const modalTitle = document.getElementById('episodesModalLabel');
  const modalSubtitle = document.getElementById('episodes-modal-subtitle');
  const modalBody = document.getElementById('episodes-modal-body');

  modalTitle.textContent = `${character.name} - Episódios`;
  modalSubtitle.textContent = `Status: ${character.status} · ${character.species} · ${genderLabel[character.gender.toLowerCase()] || character.gender}`;

  if (episodes.length === 0) {
    modalBody.innerHTML = `<p class="text-muted">Nenhum episódio disponível para este personagem.</p>`;
  } else {
    modalBody.innerHTML = `
      <ul class="list-group">
        ${episodes.map(ep => `<li class="list-group-item">${ep}</li>`).join('')}
      </ul>
    `;
  }

  episodesModal.show();
}

async function showCharacterEpisodes(characterId) {
  const modalTitle = document.getElementById('episodesModalLabel');
  const modalSubtitle = document.getElementById('episodes-modal-subtitle');
  const modalBody = document.getElementById('episodes-modal-body');

  modalTitle.textContent = 'Carregando episódios...';
  modalSubtitle.textContent = '';
  modalBody.innerHTML = `
    <div class="spinner-area">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 mb-0">Buscando informações do personagem...</p>
      </div>
    </div>
  `;
  episodesModal.show();

  const response = await fetch(`${apiUrl}/${characterId}`);
  if (!response.ok) {
    modalTitle.textContent = 'Erro';
    modalBody.innerHTML = `<p class="text-muted">Não foi possível carregar os episódios deste personagem.</p>`;
    return;
  }

  const character = await response.json();
  const episodes = await fetchEpisodesByUrls(character.episode);
  renderEpisodesModal(character, episodes);
}

function registerEpisodeButtonListeners() {
  cardGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-show-episodes');
    if (!button) return;
    const id = button.dataset.id;
    if (id) {
      showCharacterEpisodes(id);
    }
  });
}

async function fetchCharacters(page = 1) {
  state.page = page;

  try {
    showLoading();
    const response = await fetch(getQueryUrl());

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Nenhum personagem encontrado com esses critérios. Tente outro filtro ou nome.');
      }
      throw new Error('Não foi possível obter a lista de personagens. Verifique sua conexão e tente novamente.');
    }

    const data = await response.json();
    renderCharacters(data.results);
    updateInfoPanel(data.info);
    updatePagination(data.info);
  } catch (error) {
    showError(error.message);
  }
}

function handleSearch(event) {
  event.preventDefault();
  state.name = searchInput.value.trim();
  state.page = 1;
  fetchCharacters(1);
}

function handleFilterChange() {
  state.status = statusSelect.value;
  state.gender = genderSelect.value;
  state.page = 1;
  fetchCharacters(1);
}

function clearFilters() {
  state.name = '';
  state.status = '';
  state.gender = '';
  state.page = 1;
  searchInput.value = '';
  statusSelect.value = '';
  genderSelect.value = '';
  fetchCharacters(1);
}

let episodesModal;

function initializePage() {
  episodesModal = new bootstrap.Modal(document.getElementById('episodes-modal'));
  searchForm.addEventListener('submit', handleSearch);
  statusSelect.addEventListener('change', handleFilterChange);
  genderSelect.addEventListener('change', handleFilterChange);
  clearButton.addEventListener('click', clearFilters);
  registerEpisodeButtonListeners();
  fetchCharacters();
}

document.addEventListener('DOMContentLoaded', initializePage);
