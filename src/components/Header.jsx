import './Header.css'

/* Cabeçalho do site — exibe apenas texto (marca + chamada). */
export default function Header() {
  return (
    <header className="site-header">
      {/* barra superior com a marca */}
      <div className="site-header__bar">
        <span className="site-header__brand">
          <svg
            className="site-header__logo"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <path
              d="M32 4 8 14v18c0 16 10 24 24 28 14-4 24-12 24-28V14L32 4Z"
              fill="rgba(255,255,255,.14)"
              stroke="rgba(255,255,255,.55)"
              strokeWidth="2"
            />
            <path
              d="M22 32.5l7 7 14-15"
              fill="none"
              stroke="#fff"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          EON - Transparência
        </span>

        <span className="site-header__tag">Canal 100% anônimo</span>
      </div>

      {/* texto principal do header */}
      <div className="site-header__hero">
        <p className="site-header__eyebrow">Programa de Integridade</p>
        <h1 className="site-header__title">Portal de Transparência</h1>
        <p className="site-header__text">
          Acreditamos que o crescimento sustentável de uma empresa está
          diretamente ligado à ética, transparência, responsabilidade e
          respeito em todas as relações construídas ao longo da nossa
          trajetória. Mais do que diretrizes corporativas, esses princípios
          representam valores inegociáveis que orientam nossas decisões,
          condutas e a forma como nos relacionamos com colaboradores,
          clientes, parceiros e a sociedade.
        </p>
        <p className="site-header__text">
          Com o objetivo de fortalecer a cultura de integridade da nossa
          organização, reunimos abaixo nossas políticas internas, códigos de
          conduta, diretrizes de compliance, canais de comunicação e demais
          informações essenciais para promoção de um ambiente íntegro, seguro
          e responsável.
        </p>
        <p className="site-header__text">
          A integridade é um compromisso diário e coletivo. Por isso, contamos
          com a participação de todos na construção de um ambiente alinhado
          aos valores que representam a história da empresa.
        </p>
      </div>
    </header>
  )
}
