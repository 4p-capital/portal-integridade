import ReportForm from './ReportForm'

const howItWorks = [
  {
    title: 'Acesso facilitado:',
    text:
      'O canal está disponível online garantindo fácil acesso a qualquer ' +
      'momento. Ele pode ser acessado de forma simples, sem complicação, ' +
      'para que você possa realizar o relato com segurança e sem ' +
      'transtornos.',
  },
  {
    title: 'Confidencialidade garantida:',
    text:
      'Sabemos da importância de proteger a identidade de quem realiza o ' +
      'relato. Portanto, o Canal assegura total confidencialidade, ' +
      'permitindo que as informações sejam compartilhadas sem que a ' +
      'identidade do relator seja revelada, caso assim o deseje.',
  },
  {
    title: 'Relatos anônimos:',
    text:
      'O Canal de Transparência oferece a opção de relatar de forma anônima, ' +
      'para garantir que todos se sintam seguros ao relatar comportamentos ' +
      'que comprometam a ética ou a integridade da empresa. Mesmo sendo ' +
      'anônimo, cada relato é levado a sério e será investigado conforme ' +
      'as diretrizes da nossa política interna do comitê de ética e ' +
      'integridade.',
  },
  {
    title: 'Tipos de relatos aceitos:',
    text:
      'O canal recebe relatos relacionados à prática de atos lesivos ' +
      'previstos na Lei nº 12.846/2013, como fraudes, suborno, corrupção e ' +
      'conflitos de interesse. Além disso, também podem ser registrados ' +
      'relatos de discriminação, assédio moral ou sexual, abuso de ' +
      'poder, violação de normas internas, entre outras condutas ' +
      'inadequadas. Todos os relatos são tratados com a máxima ' +
      'seriedade, independentemente de sua natureza.',
  },
  {
    title: 'Acompanhamento e resolução:',
    text:
      'Após o relato ser recebido, ele é encaminhado para a nossa ' +
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
      'discriminada por ter feito um relato. Nosso compromisso é criar ' +
      'um ambiente seguro para que todos possam relatar irregularidades ' +
      'sem medo de represálias.',
  },
]

export default function ReportChannelSection() {
  return (
    <section className="section" style={{ maxWidth: 'none' }}>
      <div style={{ maxWidth: 760 }}>
        <span className="eyebrow">Lei nº 12.846/2013</span>
        <h2 className="section-title">Canal de Transparência</h2>

        <p className="section-lead">
          Em razão de acreditarmos que a transparência, integridade, ética e a
          confiança são fundamentais para mantermos uma cultura organizacional
          da empresa, apresentamos abaixo nosso canal de transparência para
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

      {/* formulário de relato anônimo */}
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

        <h3 className="subheading">Por que utilizar o Canal de Transparência?</h3>
        <p>
          O Canal de Transparência é uma ferramenta essencial para garantir que a
          empresa continue a ser um ambiente ético, transparente e
          responsável. Ele oferece a todos a possibilidade de contribuir para
          a melhoria contínua da empresa, ajudando a identificar e corrigir
          falhas ou comportamentos inadequados antes que se tornem problemas
          maiores.
        </p>
        <p>
          Ao utilizar o Canal de Transparência, você ajuda a reforçar nossa
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
