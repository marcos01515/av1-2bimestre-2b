# av1-dwb-nome-sobrenome-2bimestre

## Descrição

Projeto de Desenvolvimento Web que consome a API pública Rick and Morty para exibir uma lista de personagens na página principal e os detalhes de cada personagem em uma página dedicada.

## Tecnologias utilizadas

- HTML5
- CSS3
- Bootstrap 5
- JavaScript puro (ES6+)
- Fetch API
- JSON

## Funcionalidades

- Busca de dados em uma API pública.
- Exibição de cards responsivos com imagem, nome e botão de detalhes.
- Redirecionamento para `detalhes.html?id=ID_DO_ITEM` ao clicar em "Ver detalhes".
- Leitura de parâmetro `id` via `URLSearchParams`.
- Exibição de foto, nome, espécie, status, gênero, origem, localização e número de episódios.
- Feedback visual de carregamento e mensagens de erro amigáveis.

## Estrutura de pastas

```
av1-dwb-nome-sobrenome-2bimestre/
├── index.html
├── detalhes.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── detalhes.js
└── README.md
```

## Como executar localmente

1. Abra a pasta do projeto no seu editor ou IDE preferido.
2. Abra o arquivo `index.html` no navegador.
3. A página carregará automaticamente os personagens da API Rick and Morty.
4. Clique em "Ver detalhes" para navegar até a página de detalhes de um personagem.

> Observação: não é necessário backend, somente um navegador com acesso à internet.

## API utilizada

- Rick and Morty API: https://rickandmortyapi.com/
