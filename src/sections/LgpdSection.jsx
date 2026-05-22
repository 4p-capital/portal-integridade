import { lorem } from '../data/content'
import { IconLock, IconArrow } from './icons'

const policies = [
  { title: 'Política de Privacidade', meta: 'Documento · Lorem ipsum' },
  { title: 'Política de Proteção de Dados', meta: 'Documento · Lorem ipsum' },
]

export default function LgpdSection() {
  return (
    <section className="section">
      <span className="eyebrow">Lei nº 13.709/2018</span>
      <h2 className="section-title">LGPD</h2>

      <p className="section-lead">{lorem.lead}</p>
      <p>{lorem.p1}</p>

      {policies.map((doc) => (
        <a
          key={doc.title}
          className="link-card"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <span className="link-card__icon"><IconLock /></span>
          <span className="link-card__text">
            <strong>{doc.title}</strong>
            <span>{doc.meta}</span>
          </span>
          <IconArrow className="link-card__arrow" style={{ width: 20, height: 20 }} />
        </a>
      ))}

      <h3 className="subheading">Responsabilidade e Governança de Dados</h3>
      <p>{lorem.p2}</p>

      <div className="info-box">
        <h4>Encarregado de Proteção de Dados (DPO)</h4>
        <p>Lorem Ipsum Dolor</p>
        <p>dpo@exemplo.com</p>
      </div>
    </section>
  )
}
