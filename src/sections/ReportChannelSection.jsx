import { lorem } from '../data/content'
import ReportForm from './ReportForm'

export default function ReportChannelSection() {
  return (
    <section className="section" style={{ maxWidth: 'none' }}>
      <div style={{ maxWidth: 760 }}>
        <span className="eyebrow">Lei nº 12.846/2013</span>
        <h2 className="section-title">Canal de Denúncias</h2>

        <p className="section-lead">{lorem.lead}</p>
        <p>{lorem.p1}</p>

        <h3 className="subheading">Como funciona</h3>
        <ol className="list">
          <li>{lorem.short} Lorem ipsum dolor sit amet consectetur.</li>
          <li>{lorem.short} Adipiscing elit sed do eiusmod tempor.</li>
          <li>{lorem.short} Incididunt ut labore et dolore magna.</li>
          <li>{lorem.short} Ut enim ad minim veniam quis nostrud.</li>
          <li>{lorem.short} Exercitation ullamco laboris nisi aliquip.</li>
          <li>{lorem.short} Duis aute irure dolor in reprehenderit.</li>
        </ol>

        <h3 className="subheading">Por que utilizar o Canal de Denúncias?</h3>
        <p>{lorem.p2}</p>
        <p>{lorem.p3}</p>
      </div>

      {/* formulário de denúncia anônima */}
      <ReportForm />
    </section>
  )
}
