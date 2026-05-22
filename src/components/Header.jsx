import { lorem } from '../data/content'
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
          Grupo · Integridade
        </span>

        <span className="site-header__tag">Canal 100% anônimo</span>
      </div>

      {/* texto principal do header */}
      <div className="site-header__hero">
        <p className="site-header__eyebrow">Programa de Integridade</p>
        <h1 className="site-header__title">Portal de Integridade</h1>
        <p className="site-header__text">{lorem.lead}</p>
      </div>
    </header>
  )
}
