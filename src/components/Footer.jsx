import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Portal de Integridade</strong>
          <p>
            Canal oficial de ética e integridade para relatar, com segurança
            e sigilo, condutas que violem nosso Código de Ética e Conduta.
          </p>
        </div>

        <div className="site-footer__col">
          <span className="site-footer__title">Canal de Denúncias</span>
          <p>Denúncias e dúvidas tratadas com sigilo e sem retaliação.</p>
          <p>denuncias@eonbr.com</p>
        </div>
      </div>

      <div className="site-footer__logos">
        <img className="site-footer__logo" src="/logo-4p.svg" alt="4P Capital" />
        <span className="site-footer__plus" aria-hidden="true">+</span>
        <img className="site-footer__logo" src="/logo-eon.svg" alt="EON" />
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} EON - Todos os direitos reservados</span>
        <span>Denúncia 100% anônima e sigilosa</span>
      </div>
    </footer>
  )
}
