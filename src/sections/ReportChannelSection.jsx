import ReportForm from './ReportForm'

const howItWorks = [
  {
    title: 'Acesso facilitado:',
    text:
      'O canal está disponível online garantindo fácil acesso a qualquer ' +
      'momento. Ele pode ser acessado de forma simples, sem complicação, ' +
      'para que você possa realizar a denúncia com segurança e sem ' +
      'transtornos.',
  },
  {
    title: 'Confidencialidade garantida:',
    text:
      'Sabemos da importância de proteger a identidade de quem realiza a ' +
      'denúncia. Portanto, o Canal assegura total confidencialidade, ' +
      'permitindo que as informações sejam compartilhadas sem que a ' +
      'identidade do denunciante seja revelada, caso assim o deseje.',
  },
  {
    title: 'Denúncias anônimas:',
    text:
      'O Canal de Denúncias oferece a opção de denunciar de forma anônima, ' +
      'para garantir que todos se sintam seguros ao relatar comportamentos ' +
      'que comprometam a ética ou a integridade da empresa. Mesmo sendo ' +
      'anônima, cada denúncia é levada a sério e será investigada conforme ' +
      'as diretrizes da nossa política interna do comitê de ética e ' +
      'integridade.',
  },
  {
    title: 'Tipos de denúncias aceitas:',
    text:
      'O canal recebe denúncias relacionadas à prática de atos lesivos ' +
      'previstos na Lei nº 12.846/2013, como fraudes, suborno, corrupção e ' +
      'conflitos de interesse. Além disso, também podem ser registradas ' +
      'denúncias de discriminação, assédio moral ou sexual, abuso de ' +
      'poder, violação de normas internas, entre outras condutas ' +
      'inadequadas. Todas as denúncias são tratadas com a máxima ' +
      'seriedade, independentemente de sua natureza.',
  },
  {
    title: 'Acompanhamento e resolução:',
    text:
      'Após a denúncia ser recebida, ela é encaminhada para a nossa ' +
      'diretoria, integrante do Comitê de Ética e Integridade, que ' +
      'realizará a investigação de forma imparcial. Durante o processo, ' +
      'garantimos que as partes envolvidas sejam tratadas com respeito e ' +
      'justiça. Caso necessário, ações corretivas serão tomadas, ' +
      'observando as medidas cabíveis de acordo com o vínculo mantido com ' +
      'a empresa.',
  },
  {
    title: 'Compromisso com a não retaliação:',
    text:
      'Destacamos que possuímos uma política de não retaliação, ou seja, ' +
      'não permitimos que qualquer pessoa sofra prejuízos ou seja ' +
      'discriminada por ter feito uma denúncia. Nosso compromisso é criar ' +
      'um ambiente seguro para que todos possam relatar irregularidades ' +
      'sem medo de represálias.',
  },
]

export default function ReportChannelSection() {
  return (
    <section className="section" style={{ maxWidth: 'none' }}>
      <div style={{ maxWidth: 760 }}>
        <span className="eyebrow">Lei nº 12.846/2013</span>
        <h2 className="section-title">Canal de Denúncias</h2>

        <p className="section-lead">
          Em razão de acreditarmos que a transparência, integridade, ética e a
          confiança são fundamentais para mantermos uma cultura organizacional
          da empresa, apresentamos abaixo nosso canal de denúncias para
          conhecimento.
        </p>
        <p>
          Ressaltamos que o canal é seguro, acessível e confidencial, onde
          qualquer pessoa — seja prestador de serviços direto ou indireto,
          fornecedor, terceiros ou parceiros — pode relatar práticas
          inadequadas, comportamentos antiéticos ou violações dos nossos
          valores e políticas.
        </p>
      </div>

      {/* formulário de denúncia anônima */}
      <ReportForm />

      <div style={{ maxWidth: 760 }}>
        <h3 className="subheading">Como funciona</h3>
        <ol className="list">
          {howItWorks.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong> {item.text}
            </li>
          ))}
        </ol>

        <h3 className="subheading">Por que utilizar o Canal de Denúncias?</h3>
        <p>
          O Canal de Denúncias é uma ferramenta essencial para garantir que a
          empresa continue a ser um ambiente ético, transparente e
          responsável. Ele oferece a todos a possibilidade de contribuir para
          a melhoria contínua da empresa, ajudando a identificar e corrigir
          falhas ou comportamentos inadequados antes que se tornem problemas
          maiores.
        </p>
        <p>
          Ao utilizar o Canal de Denúncias, você ajuda a reforçar nossa
          cultura de integridade e a garantir que a empresa mantenha sua
          atuação pautada em seus princípios.
        </p>
        <p>
          Sua colaboração é fundamental para a criação de um ambiente de
          respeito, confiança e justiça para todos.
        </p>
      </div>
    </section>
  )
}
