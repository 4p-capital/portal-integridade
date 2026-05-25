import { useState } from 'react'
import Header from './components/Header'
import ContainerNav from './components/ContainerNav'
import Footer from './components/Footer'
import { navItems } from './data/content'

import EthicsSection from './sections/EthicsSection'
import CodeOfConductSection from './sections/CodeOfConductSection'
import ReportChannelSection from './sections/ReportChannelSection'
import CommitteeSection from './sections/CommitteeSection'
import LgpdSection from './sections/LgpdSection'
// import DocumentationSection from './sections/DocumentationSection'

import './sections/sections.css'

/* Cada aba aponta para o componente da sua seção. */
/* "documentacao" desabilitado até subirmos os PDFs reais — para
   reabilitar, descomentar a linha abaixo e o item em
   src/data/content.js (navItems). */
const SECTIONS = {
  etica: EthicsSection,
  codigo: CodeOfConductSection,
  canal: ReportChannelSection,
  comite: CommitteeSection,
  lgpd: LgpdSection,
  // documentacao: DocumentationSection,
}

export default function App() {
  const [active, setActive] = useState('etica')
  const ActiveSection = SECTIONS[active]

  return (
    <div className="app">
      <Header />

      <main className="container-wrap">
        <div className="container-card">
          {/* menu de navegação dentro do próprio container */}
          <ContainerNav items={navItems} active={active} onChange={setActive} />

          {/*
            A `key` força a remontagem a cada troca de aba, disparando a
            animação de "container change" definida em global.css.
          */}
          <div className="container-body" key={active}>
            <ActiveSection onNavigate={setActive} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
