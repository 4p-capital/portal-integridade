import { lorem } from '../data/content'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Portal de Integridade</strong>
          <p>{lorem.short}</p>
        </div>

        <div className="site-footer__col">
          <span className="site-footer__title">Canal de Denúncias</span>
          <p>Lorem ipsum dolor sit amet</p>
          <p>consectetur@exemplo.com</p>
          <p>0800 000 0000</p>
        </div>

        <div className="site-footer__col">
          <span className="site-footer__title">Encarregado (DPO)</span>
          <p>Lorem Ipsum</p>
          <p>dpo@exemplo.com</p>
        </div>
      </div>

      <div className="site-footer__logos">
        <img className="site-footer__logo" src="/logo-4p.svg" alt="4P Capital" />
        <span className="site-footer__plus" aria-hidden="true">+</span>
        <img className="site-footer__logo" src="/logo-eon.svg" alt="EON" />
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Grupo · Lorem Ipsum. Todos os direitos reservados.</span>
        <span>Denúncia 100% anônima e sigilosa</span>
      </div>
    </footer>
  )
}
