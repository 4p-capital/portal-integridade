import { IconDoc, IconArrow } from './icons'

export default function CodeOfConductSection() {
  return (
    <section className="section">
      <span className="eyebrow">Lei nº 12.846/2013</span>
      <h2 className="section-title">Código de Ética e Conduta</h2>

      <p className="section-lead">
        A Lei nº 12.846/2013, também conhecida como Lei Anticorrupção, foi
        sancionada no Brasil com o objetivo de combater a corrupção no setor
        privado e responsabilizar as empresas por práticas ilícitas cometidas
        por seus empregados, representantes ou qualquer pessoa que atue em
        seu nome.
      </p>
      <p>
        Dessa forma, visando a demonstração de mecanismos e procedimentos
        internos de integridade da empresa, abaixo anexamos nosso Código de
        Ética e Conduta para conhecimento.
      </p>

      <a
        className="link-card"
        href="/codigo-de-conduta-e-etica.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="link-card__icon"><IconDoc /></span>
        <span className="link-card__text">
          <strong>Código de Ética e Conduta</strong>
          <span>Documento · PDF</span>
        </span>
        <IconArrow className="link-card__arrow" style={{ width: 20, height: 20 }} />
      </a>
    </section>
  )
}
