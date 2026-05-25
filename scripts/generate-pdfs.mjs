/**
 * Gera PDFs das políticas a partir dos arquivos Markdown.
 *
 * Uso:
 *   node scripts/generate-pdfs.mjs
 *
 * Saída:
 *   public/politica-de-privacidade.pdf
 *   public/politica-de-protecao-de-dados.pdf
 */

import { mdToPdf } from 'md-to-pdf'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const docs = [
  {
    src: path.join(ROOT, 'POLITICA-DE-PRIVACIDADE.md'),
    dst: path.join(ROOT, 'public', 'politica-de-privacidade.pdf'),
    title: 'Política de Privacidade — Portal de Integridade EON',
  },
  {
    src: path.join(ROOT, 'POLITICA-DE-PROTECAO-DE-DADOS.md'),
    dst: path.join(ROOT, 'public', 'politica-de-protecao-de-dados.pdf'),
    title: 'Política de Proteção de Dados — Portal de Integridade EON',
  },
  {
    src: path.join(ROOT, 'CODIGO-DE-CONDUTA-E-ETICA.md'),
    dst: path.join(ROOT, 'public', 'codigo-de-conduta-e-etica.pdf'),
    title: 'Código de Conduta e Ética — Portal de Integridade EON',
  },
]

/* Identidade visual alinhada ao Portal (paleta EON + tipografia Inter). */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --brand-700: #312418;
    --brand-900: #1a130c;
    --gold: #b58a4a;
    --gold-soft: #f1ebdf;
    --text: #1f1a14;
    --muted: #5a5048;
    --border: #e5dccd;
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--text);
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Capa / título principal */
  h1 {
    font-size: 22pt;
    font-weight: 800;
    color: var(--brand-900);
    margin: 0 0 8px 0;
    letter-spacing: -.02em;
    border-bottom: 3px solid var(--gold);
    padding-bottom: 12px;
  }

  h2 {
    font-size: 14pt;
    font-weight: 700;
    color: var(--brand-700);
    margin: 28px 0 10px 0;
    padding-top: 6px;
    border-top: 1px solid var(--border);
    padding-top: 18px;
  }

  h3 {
    font-size: 11.5pt;
    font-weight: 700;
    color: var(--brand-700);
    margin: 18px 0 6px 0;
  }

  h4 {
    font-size: 10.5pt;
    font-weight: 600;
    color: var(--brand-700);
    margin: 12px 0 4px 0;
  }

  p { margin: 0 0 10px 0; text-align: justify; }

  /* Listas */
  ul, ol { margin: 6px 0 12px 0; padding-left: 22px; }
  li { margin-bottom: 4px; }

  /* Tabelas */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th {
    background: var(--gold-soft);
    color: var(--brand-900);
    font-weight: 600;
    text-align: left;
    padding: 7px 9px;
    border: 1px solid var(--border);
  }

  td {
    padding: 7px 9px;
    border: 1px solid var(--border);
    vertical-align: top;
  }

  tr:nth-child(even) td { background: #fafaf7; }

  /* Blockquote (avisos importantes) */
  blockquote {
    margin: 14px 0;
    padding: 10px 14px;
    border-left: 3px solid var(--gold);
    background: var(--gold-soft);
    color: var(--brand-900);
    font-size: 10pt;
  }

  blockquote p { margin: 4px 0; }

  /* Códigos inline */
  code {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 9.5pt;
    background: #f4eee2;
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--brand-900);
  }

  pre {
    background: #f4eee2;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 9pt;
    overflow-x: auto;
    page-break-inside: avoid;
  }

  pre code { background: transparent; padding: 0; }

  /* Linha horizontal */
  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 24px 0;
  }

  /* Links */
  a {
    color: var(--brand-700);
    text-decoration: underline;
  }

  /* Strong */
  strong { color: var(--brand-900); }

  /* Quebra de página antes de cada H2 (exceto o primeiro)
     mantém visualmente cada seção começando bem */
  h2 { page-break-after: avoid; }

  /* Evita órfãs em parágrafos curtos */
  p, li { orphans: 2; widows: 2; }

  /* Evita quebrar tabelas ou blockquotes no meio */
  table, blockquote, pre { page-break-inside: avoid; }
`

const pdfOptions = {
  format: 'A4',
  margin: {
    top: '25mm',
    right: '20mm',
    bottom: '25mm',
    left: '20mm',
  },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `
    <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #5a5048; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between;">
      <span style="font-weight: 600; color: #312418;">Portal de Integridade — EON</span>
      <span class="title"></span>
    </div>
  `,
  footerTemplate: `
    <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #5a5048; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between;">
      <span>Confidencial — Documento institucional</span>
      <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>
  `,
}

console.log('Gerando PDFs...\n')

for (const doc of docs) {
  const name = path.basename(doc.dst)
  process.stdout.write(`  • ${name} ... `)

  try {
    await mdToPdf(
      { path: doc.src },
      {
        dest: doc.dst,
        stylesheet_encoding: 'utf-8',
        css,
        pdf_options: pdfOptions,
        launch_options: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }
    )
    console.log('OK')
  } catch (err) {
    console.error('ERRO')
    console.error(err)
    process.exit(1)
  }
}

console.log('\nPDFs gerados em ./public/')
