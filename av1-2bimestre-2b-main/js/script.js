const pokemonCard = document.getElementById('pokemon-card');
const pokemonButtons = document.querySelectorAll('[data-pokemon]');

async function loadPokemon(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  pokemonCard.innerHTML = '<div id="loading">Carregando...</div>';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }
    const pokemon = await response.json();
    renderPokemon(pokemon);
  } catch (error) {
    pokemonCard.innerHTML = `<p class="error">Não foi possível carregar os dados. ${error.message}</p>`;
  }
}

function renderPokemon(pokemon) {
  const types = pokemon.types.map((item) => item.type.name).join(', ');
  const abilities = pokemon.abilities.map((item) => item.ability.name).join(', ');
  const statsHtml = pokemon.stats.map((stat) => `
      <li><strong>${stat.stat.name}</strong>: ${stat.base_stat}</li>
    `).join('');

  pokemonCard.innerHTML = `
    <div class="pokemon-header">
      <div>
        <h2>${pokemon.name.toUpperCase()} (#${pokemon.id})</h2>
        <p><span class="badge">Tipo: ${types}</span></p>
      </div>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
    <div class="pokemon-info">
      <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Habilidades:</strong> ${abilities}</p>
      <div>
        <strong>Estatísticas:</strong>
        <ul class="stats">${statsHtml}</ul>
      </div>
    </div>
  `;
}

function setActiveButton(activeButton) {
  pokemonButtons.forEach((button) => {
    button.classList.toggle('active', button === activeButton);
  });
}

pokemonButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveButton(button);
    loadPokemon(button.dataset.pokemon);
  });
});

pokemonCard.innerHTML = '<div id="loading">Clique em um Pokémon acima para ver os detalhes.</div>';
