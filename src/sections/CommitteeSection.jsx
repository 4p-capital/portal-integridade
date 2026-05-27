import { IconArrow } from './icons'

const responsibilities = [
  {
    title: 'Recebimento e Apuração de Relatos:',
    text:
      'O comitê é responsável por receber e investigar todos os relatos ' +
      'feitos, de maneira confidencial e segura. Isso pode ser feito por ' +
      'meio de canais internos, como nosso Canal de Transparência, ou por ' +
      'outros meios disponíveis. Cada relato é tratado com a máxima ' +
      'seriedade, seguindo um processo justo e rigoroso.',
  },
  {
    title: 'Garantia de Imparcialidade e Transparência:',
    text:
      'O comitê atua de forma totalmente independente, garantindo que ' +
      'todos os envolvidos, sejam relatores ou acusados, recebam ' +
      'tratamento justo. Nosso processo de apuração é transparente e ' +
      'ético, respeitando a privacidade e os direitos de todos os ' +
      'indivíduos.',
  },
  {
    title: 'Análise e Recomendações:',
    text:
      'Após a apuração dos relatos, o comitê analisa as evidências e ' +
      'fatos, tomando as ações apropriadas conforme a gravidade da ' +
      'situação. Isso pode incluir medidas disciplinares, correções de ' +
      'processos ou outras ações preventivas, visando corrigir falhas e ' +
      'evitar futuros incidentes.',
  },
  {
    title: 'Promoção de Cultura de Integridade:',
    text:
      'O comitê também tem um papel educativo dentro da empresa, ' +
      'promovendo treinamentos e campanhas para reforçar a importância da ' +
      'ética, da transparência e da responsabilidade em todas as áreas de ' +
      'atuação. A integridade é um valor central, e o comitê contribui ' +
      'ativamente para que todos os colaboradores e parceiros compartilhem ' +
      'desse compromisso.',
  },
  {
    title: 'Apoio ao Compromisso com a Conformidade:',
    text:
      'Além de investigar, o comitê também auxilia na implementação de ' +
      'políticas, sistemas de monitoramento e estratégias de compliance ' +
      'para garantir que as normas internas e as leis externas sejam ' +
      'cumpridas rigorosamente.',
  },
]

export default function CommitteeSection({ onNavigate }) {
  return (
    <section className="section">
      <span className="eyebrow">Governança</span>
      <h2 className="section-title">Comitê de Ética e Integridade</h2>

      <p className="section-lead">
        O Comitê de Ética e Integridade da empresa, composto por nossos
        diretores, possui a responsabilidade de apurar os relatos
        realizados, bem como estabelecer as medidas que serão tomadas de
        acordo com a situação relatada.
      </p>
      <p>
        Trata-se de pessoas que são independentes e imparciais, responsáveis
        por promover, monitorar e garantir que todas as práticas empresariais
        estejam alinhadas aos mais elevados padrões éticos e legais, possuindo
        um papel crucial no procedimento de apuração de relatos
        relacionadas a condutas inadequadas, corrupção, fraudes ou qualquer
        violação dos nossos valores corporativos.
      </p>

      <h3 className="subheading">Funções e Responsabilidades</h3>
      <ul className="list">
        {responsibilities.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong> {item.text}
          </li>
        ))}
      </ul>

      <div className="section-cta">
        <button
          type="button"
          className="btn btn--primary btn--pulse"
          onClick={() => onNavigate('canal')}
        >
          Fazer um relato anônimo
          <IconArrow style={{ width: 16, height: 16, verticalAlign: -3, marginLeft: 8 }} />
        </button>
      </div>
    </section>
  )
}
