import { IconShield, IconBalance, IconEye, IconArrow } from './icons'

const pillars = [
  {
    Icon: IconBalance,
    title: 'Transparência',
    text:
      'Atuamos de forma clara, ética e responsável, garantindo relações ' +
      'pautadas pela confiança, pela honestidade e pelo cumprimento das ' +
      'normas internas e legais.',
  },
  {
    Icon: IconShield,
    title: 'Respeito',
    text:
      'Valorizamos relações profissionais baseadas na dignidade, ' +
      'cordialidade, educação e cooperação, promovendo um ambiente ' +
      'saudável e íntegro para todos, independentemente do nível ' +
      'hierárquico que possua.',
  },
  {
    Icon: IconEye,
    title: 'Responsabilidade',
    text:
      'Assumimos o compromisso de agir com zelo, comprometimento e ' +
      'consciência em nossas atividades, preservando a integridade da ' +
      'Empresa, das pessoas e das relações construídas diariamente.',
  },
]

export default function EthicsSection({ onNavigate }) {
  return (
    <section className="section">
      <span className="eyebrow">Compromisso do grupo</span>
      <h2 className="section-title">Ética e Integridade</h2>

      <p className="section-lead">
        Ética refere-se a um conjunto de regras e preceitos de ordem valorativa
        e moral.
      </p>
      <p>
        Integridade significa conduzir nossas atividades com honestidade,
        respeito, responsabilidade e compromisso com as normas internas, a
        legislação e os valores que representam a nossa empresa.
      </p>
      <p>
        Mais do que uma obrigação a todos, o comportamento ético faz parte da
        nossa cultura organizacional e orienta a forma como nos relacionamos
        com prestadores de serviços diretos ou indiretos, parceiros e a
        sociedade. Buscamos promover um ambiente seguro, íntegro e
        responsável, pautado pela confiança, pela boa-fé e pela transparência
        em todas as decisões.
      </p>
      <p>
        Nossa atuação é guiada pelo compromisso permanente com a conformidade,
        a prevenção de irregularidades e a valorização de práticas que
        fortaleçam a credibilidade e a reputação da Empresa.
      </p>

      <div className="pillar-grid">
        {pillars.map(({ Icon, title, text }) => (
          <div className="pillar" key={title}>
            <div className="pillar__icon"><Icon /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className="section-cta">
        <button
          type="button"
          className="btn btn--primary btn--pulse"
          onClick={() => onNavigate('canal')}
        >
          Fazer um relato anônimo
          <IconArrow style={{ width: 16, height: 16, verticalAlign: -3, marginLeft: 8 }} />
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onNavigate('lgpd')}
        >
          Ver políticas LGPD
        </button>
      </div>
    </section>
  )
}
