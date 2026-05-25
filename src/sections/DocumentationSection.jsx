import { documents } from '../data/content'
import { IconDoc, IconDownload } from './icons'

export default function DocumentationSection() {
  return (
    <section className="section" style={{ maxWidth: 'none' }}>
      <span className="eyebrow">Biblioteca</span>
      <h2 className="section-title">Documentação</h2>
      <p className="section-lead" style={{ maxWidth: 760 }}>
        Acesse abaixo as políticas, regulamentos e demais documentos que
        integram o nosso Programa de Integridade.
      </p>

      <div className="doc-grid">
        {documents.map((name) => (
          <a
            key={name}
            className="doc-card"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span className="doc-card__icon"><IconDoc /></span>
            <strong>{name}</strong>
            <span className="doc-card__meta">
              <IconDownload style={{ width: 14, height: 14 }} />
              PDF
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
