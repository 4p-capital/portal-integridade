import { lorem } from '../data/content'
import { IconDoc, IconArrow } from './icons'

export default function CodeOfConductSection() {
  return (
    <section className="section">
      <span className="eyebrow">Lei nº 6.112/2018</span>
      <h2 className="section-title">Código de Ética e Conduta</h2>

      <p className="section-lead">{lorem.lead}</p>
      <p>{lorem.p1}</p>
      <p>{lorem.p3}</p>

      <h3 className="subheading">Lorem ipsum dolor sit</h3>
      <p>{lorem.p2}</p>

      <a className="link-card" href="#" onClick={(e) => e.preventDefault()}>
        <span className="link-card__icon"><IconDoc /></span>
        <span className="link-card__text">
          <strong>Código de Ética e Conduta</strong>
          <span>Documento · Lorem ipsum dolor</span>
        </span>
        <IconArrow className="link-card__arrow" style={{ width: 20, height: 20 }} />
      </a>
    </section>
  )
}
