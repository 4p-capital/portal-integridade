import { IconLock, IconArrow } from './icons'

const policies = [
  {
    title: 'Política de Privacidade',
    meta: 'Documento · PDF',
    href: '/politica-de-privacidade.pdf',
  },
  {
    title: 'Política de Proteção de Dados',
    meta: 'Documento · PDF',
    href: '/politica-de-protecao-de-dados.pdf',
  },
]

export default function LgpdSection({ onNavigate }) {
  return (
    <section className="section">
      <span className="eyebrow">Lei nº 13.709/2018</span>
      <h2 className="section-title">LGPD</h2>

      <p className="section-lead">
        A lei nº 13.709/2018, mais conhecida como Lei Geral de Proteção de
        Dados Pessoais (LGPD), sancionada em 2018 e em vigor desde setembro de
        2020, estabelece uma série de obrigações para as organizações que
        coletam e tratam dados pessoais. O objetivo principal da LGPD é
        assegurar a proteção dos dados pessoais de indivíduos, garantindo
        maior privacidade e controle sobre as informações fornecidas por
        clientes, colaboradores e parceiros.
      </p>
      <p>
        Nosso compromisso com a conformidade com a LGPD é fundamental para
        proteger os dados que manipulamos e, principalmente, para manter a
        confiança de todos que interagem com nossa organização. A lei
        estabelece que as empresas devem adotar práticas transparentes e
        seguras no tratamento de dados pessoais, incluindo a coleta,
        armazenamento, uso e compartilhamento dessas informações.
      </p>

      {policies.map((doc) => (
        <a
          key={doc.title}
          className="link-card"
          href={doc.href}
          target="_blank"
          rel="noopener noreferrer"
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
      <p>
        Dessa forma, informamos que possuímos severa política de privacidade
        e de segurança da informação, visando manter os dados de nossos
        clientes, colaboradores, parceiros e prestadores de serviços.
      </p>
      <p>
        Caso tenha quaisquer dúvidas sobre nossos processos de proteção,
        procure o nosso setor de tecnologia e informação para quaisquer
        esclarecimentos.
      </p>

      <div className="info-box">
        <h4>Contato — Tecnologia da Informação</h4>
        <p>tecnologia@eonbr.com</p>
      </div>

      <div className="section-cta">
        <button
          type="button"
          className="btn btn--primary btn--pulse"
          onClick={() => onNavigate('canal')}
        >
          Fazer uma denúncia anônima
          <IconArrow style={{ width: 16, height: 16, verticalAlign: -3, marginLeft: 8 }} />
        </button>
      </div>
    </section>
  )
}
