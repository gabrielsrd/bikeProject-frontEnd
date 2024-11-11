### README

## Projeto (Português)

**Título**: Aplicação Web para Análise de Ciclofaixas e Estações de Bicicletas Compartilhadas em São Paulo

**Descrição**: Este projeto faz parte do Trabalho de Conclusão de Curso (TCC) em Ciência da Computação e consiste em uma aplicação web interativa desenvolvida em React. A página exibe um mapa da cidade de São Paulo, com informações sobre as ciclofaixas (faixas dedicadas para bicicletas) e as estações de bicicletas compartilhadas fornecidas pela Tembici. 

Os usuários podem aplicar filtros no mapa para visualizar:
- Ciclofaixas existentes
- Localização das estações de bicicletas Tembici
- Zonas da cidade que necessitam de mais ciclofaixas ou melhorias na infraestrutura cicloviária

Além disso, a aplicação exibe dados de usuários de bicicletas, incluindo as rotas mais utilizadas. Este sistema é voltado para:
1. Organizações e empresas que desejam entender e melhorar a infraestrutura cicloviária urbana.
2. Operadoras de bicicletas compartilhadas, que podem usar os dados para otimizar suas operações.

A aplicação obtém os dados em formato GeoJSON de uma API desenvolvida em Python, localizada em outro repositório, que realiza cálculos e processa informações para fornecer os dados geográficos.

**Funcionalidades**:
- **Mapeamento Interativo**: permite a navegação pelo mapa de São Paulo.
- **Filtros**: exibe ciclofaixas, estações de bicicletas e áreas que precisam de infraestrutura adicional.
- **Análise de Dados**: visualização de dados sobre uso de bicicletas, rotas percorridas e insights para melhorias.

**Tecnologias Utilizadas**:
- **Frontend**: React, JavaScript
- **Backend**: API em Python (para processamento de dados e geração de GeoJSON)
- **Mapas**: integração com serviços de mapas para renderização e visualização

**Como Executar o Projeto**:
1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/nomerepositorio.git
   ```
2. Instale as dependências:
   ```bash
   cd nomerepositorio
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm start
   ```
4. Configure o backend (repositório Python) para fornecer os dados da API, e certifique-se de que o backend está em execução antes de carregar a página.

---

## Project (English)

**Title**: Web Application for Analyzing Bike Lanes and Shared Bike Stations in São Paulo

**Description**: This project is part of the undergraduate thesis in Computer Science, featuring an interactive web application built with React. The webpage displays a map of São Paulo, including information on bike lanes and shared bike stations provided by Tembici.

Users can apply filters on the map to visualize:
- Existing bike lanes
- Locations of Tembici bike-sharing stations
- Zones in need of more bike lanes or infrastructure improvements

Additionally, the app shows data on bike users and the routes they frequent. This system is designed for:
1. Organizations and businesses looking to improve urban cycling infrastructure.
2. Shared bike providers aiming to optimize their services based on usage insights.

The application retrieves data in GeoJSON format from a Python-based API (located in a separate repository), which performs calculations and processes information to provide geographical data.

**Features**:
- **Interactive Map**: enables navigation through São Paulo’s map.
- **Filters**: displays bike lanes, bike-sharing stations, and areas needing additional infrastructure.
- **Data Analysis**: provides visualizations of bike usage data, frequently used routes, and actionable insights.

**Technologies Used**:
- **Frontend**: React, JavaScript
- **Backend**: Python API (for data processing and GeoJSON generation)
- **Maps**: integration with mapping services for rendering and visualization

**How to Run the Project**:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/repositoryname.git
   ```
2. Install dependencies:
   ```bash
   cd repositoryname
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Ensure the backend (Python repository) is configured to serve the API data and is running before loading the frontend page.