import { lorem } from '../data/content'
import { IconShield, IconBalance, IconEye, IconArrow } from './icons'

const pillars = [
  { Icon: IconBalance, title: 'Transparência' },
  { Icon: IconShield,  title: 'Respeito' },
  { Icon: IconEye,     title: 'Responsabilidade' },
]

export default function EthicsSection({ onNavigate }) {
  return (
    <section className="section">
      <span className="eyebrow">Compromisso do grupo</span>
      <h2 className="section-title">Ética e Integridade</h2>

      <p className="section-lead">{lorem.lead}</p>
      <p>{lorem.p1}</p>
      <p>{lorem.p2}</p>

      <div className="pillar-grid">
        {pillars.map(({ Icon, title }) => (
          <div className="pillar" key={title}>
            <div className="pillar__icon"><Icon /></div>
            <h3>{title}</h3>
            <p>{lorem.short}</p>
          </div>
        ))}
      </div>

      <div className="section-cta">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onNavigate('canal')}
        >
          Fazer uma denúncia anônima
          <IconArrow style={{ width: 16, height: 16, verticalAlign: -3, marginLeft: 8 }} />
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onNavigate('documentacao')}
        >
          Ver políticas e documentos
        </button>
      </div>
    </section>
  )
}
