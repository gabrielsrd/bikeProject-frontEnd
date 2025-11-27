# BikeProject - Frontend

Aplicação web desenvolvida como parte do TCC de Ciências da Computação - USP.

## Sobre o Projeto

Este projeto visualiza dados de infraestrutura cicloviária de São Paulo, incluindo ciclofaixas, Estações de bicicletas compartilhadas e análise de fluxo de viagens.

O objetivo é ajudar a entender melhor como as pessoas usam o sistema de bikes compartilhadas na cidade e identificar onde a infraestrutura pode ser melhorada.

<img src="public/capturaTela.png" width="100%" alt="capturatela">

## Funcionalidades

- Mapa interativo com ciclofaixas e estações
- Filtros para visualizar diferentes aspectos dos dados
- Visualização de zonas de alta demanda (hotzones)
- Análise de fluxo entre estações
- Gráficos com estatísticas de uso

## Tecnologias

- React
- Leaflet para mapas
- Bootstrap para UI
- Backend em Django (repositório separado)

## Como rodar

1. Instalar dependencias:
```bash
npm install
```

2. Certificar que o backend está rodando (ver repositório backend)

3. Iniciar aplicação:
```bash
npm start
```

A aplicação vai abrir em `http://localhost:3000`

## Backend

O backend desse projeto está em: https://github.com/gabrielsrd/bikeProject-backEnd

## Estrutura do Projeto

```
src/
├── components/    # Componentes React
├── services/      # Chamadas para API
├── hooks/         # Custom hooks
└── utils/         # Funções auxiliares
```