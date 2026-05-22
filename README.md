# Portal de Integridade

Mini portal público de **denúncias 100% anônimas** para as empresas do grupo.
Reúne as condutas e políticas de integridade em uma única página, com navegação
por abas dentro do container principal (sem recarregar a página — apenas
"container change").

> ⚠️ **Template / MVP** — todos os textos descritivos são *lorem ipsum*.
> Apenas os títulos são reais. Substitua o conteúdo antes de publicar.

## Stack

- [Vite](https://vite.dev/) + [React 18](https://react.dev/)
- CSS puro (sem dependências de UI)

## Como rodar

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

Para gerar a build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
portal-integridade/
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # ponto de entrada
    ├── App.jsx                 # layout + estado da aba ativa
    ├── data/
    │   └── content.js          # textos (lorem ipsum) e configuração das abas
    ├── styles/
    │   └── global.css          # tokens de design + layout base
    ├── components/
    │   ├── Header.jsx           # cabeçalho com texto do site
    │   ├── ContainerNav.jsx     # menu de navegação dentro do container
    │   └── Footer.jsx
    └── sections/                # conteúdo de cada aba
        ├── EthicsSection.jsx
        ├── CodeOfConductSection.jsx
        ├── ReportChannelSection.jsx
        ├── ReportForm.jsx       # formulário de denúncia anônima
        ├── CommitteeSection.jsx
        ├── LgpdSection.jsx
        └── DocumentationSection.jsx
```

## Observações sobre anonimato

O formulário de denúncia **não coleta nome, e-mail ou qualquer dado de
identificação**. Ao registrar uma denúncia é gerado um **protocolo** que permite
acompanhar o caso de forma anônima.

Este template é apenas *front-end*. Para uso real, conecte o formulário a um
backend que não registre IP/metadados de identificação.
