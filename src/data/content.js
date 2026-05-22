/* ============================================================
   Conteúdo do portal.

   TEMPLATE: os títulos são reais; todo texto descritivo é
   lorem ipsum e deve ser substituído antes da publicação.
   ============================================================ */

/* Abas de navegação dentro do container principal. */
export const navItems = [
  { id: 'etica',        label: 'Ética e Integridade' },
  { id: 'codigo',       label: 'Código de Ética e Conduta' },
  { id: 'canal',        label: 'Canal de Denúncias' },
  { id: 'comite',       label: 'Comitê de Ética e Integridade' },
  { id: 'lgpd',         label: 'LGPD' },
  { id: 'documentacao', label: 'Documentação' },
]

/* Blocos de texto reutilizáveis (lorem ipsum). */
export const lorem = {
  lead:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua, quis nostrud ' +
    'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  p1:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ' +
    'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
    'commodo consequat.',
  p2:
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  p3:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem ' +
    'accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab ' +
    'illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
  short:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
}

/* Empresas do grupo (usadas no formulário de denúncia). */
export const groupCompanies = [
  'Empresa Lorem Ipsum S.A.',
  'Lorem Holding Participações',
  'Dolor Sit Amet Ltda.',
  'Consectetur Serviços',
  'Adipiscing Tecnologia',
]

/* Categorias de denúncia. */
export const reportCategories = [
  'Assédio moral ou sexual',
  'Fraude ou desvio financeiro',
  'Corrupção e suborno',
  'Conflito de interesses',
  'Discriminação',
  'Segurança e saúde no trabalho',
  'Violação de dados pessoais (LGPD)',
  'Outros',
]

/* Tipos de vínculo do denunciante com o grupo. */
export const bondTypes = [
  'Colaborador(a)',
  'Fornecedor / Parceiro',
  'Cliente',
  'Terceiro',
]

/* Documentos para download. */
export const documents = [
  'Código de Ética e Conduta',
  'Política Anticorrupção',
  'Política de Privacidade',
  'Política de Proteção de Dados',
  'Política de Conflito de Interesses',
  'Política de Brindes e Hospitalidades',
  'Regimento do Comitê de Ética',
  'Manual do Canal de Denúncias',
  'Política de Compliance',
]
