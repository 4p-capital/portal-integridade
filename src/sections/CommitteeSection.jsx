import { lorem } from '../data/content'

export default function CommitteeSection() {
  return (
    <section className="section">
      <span className="eyebrow">Governança</span>
      <h2 className="section-title">Comitê de Ética e Integridade</h2>

      <p className="section-lead">{lorem.lead}</p>
      <p>{lorem.p1}</p>

      <h3 className="subheading">Atribuições e responsabilidades</h3>
      <ul className="list">
        <li>{lorem.p2}</li>
        <li>{lorem.short} Consectetur adipiscing elit sed do eiusmod tempor.</li>
        <li>{lorem.short} Ut enim ad minim veniam quis nostrud exercitation.</li>
        <li>{lorem.short} Duis aute irure dolor in reprehenderit voluptate.</li>
        <li>{lorem.short} Excepteur sint occaecat cupidatat non proident.</li>
      </ul>

      <p>{lorem.p3}</p>
    </section>
  )
}
