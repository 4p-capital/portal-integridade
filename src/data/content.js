/* ============================================================
   Conteúdo do portal.
   ============================================================ */

/* Abas de navegação dentro do container principal. */
/* Para reabilitar a aba "Documentação", basta descomentar a linha
   correspondente abaixo e a entrada em src/App.jsx (SECTIONS). */
export const navItems = [
  { id: 'etica',        label: 'Ética e Integridade' },
  { id: 'codigo',       label: 'Código de Ética e Conduta' },
  { id: 'canal',        label: 'Canal de Transparência', highlight: true },
  { id: 'comite',       label: 'Comitê de Ética e Integridade' },
  { id: 'lgpd',         label: 'LGPD' },
  // { id: 'documentacao', label: 'Documentação' },
]

/* Categorias do relato. */
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

/* Tipos de vínculo do relator com o grupo. */
export const bondTypes = [
  'Colaborador',
  'Prestador de serviço direto/indireto',
  'Terceiro',
  'Fornecedor',
  'Cliente',
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
  'Manual do Canal de Transparência',
  'Política de Compliance',
]
