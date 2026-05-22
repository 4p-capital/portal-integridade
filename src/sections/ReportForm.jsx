import { useState } from 'react'
import { groupCompanies, reportCategories, bondTypes, lorem } from '../data/content'
import { IconShield, IconLock, IconCheck, IconUpload, IconX, IconDoc } from './icons'
import './ReportForm.css'

/* Gera um protocolo anônimo — único meio de acompanhar a denúncia. */
function makeProtocol() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `INT-${new Date().getFullYear()}-${code}`
}

/* Campos de texto do formulário (os anexos ficam em estado separado). */
const EMPTY = {
  empresa: '',
  vinculo: '',
  categoria: '',
  quando: '',
  local: '',
  relato: '',
}

/* Tipos de arquivo aceitos como prova e limite total de upload. */
const ACCEPT = 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
const MAX_TOTAL = 20 * 1024 * 1024 // 20 MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function ReportForm() {
  const [mode, setMode] = useState('new')          // 'new' | 'track'

  // --- registro de denúncia ---
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])           // anexos (prova)
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [protocol, setProtocol] = useState(null)
  const [copied, setCopied] = useState(false)

  // --- acompanhamento ---
  const [trackInput, setTrackInput] = useState('')
  const [tracked, setTracked] = useState(null)

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  /* ---- anexos ---- */
  function addFiles(fileList) {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return
    const merged = [...files, ...incoming]
    const total = merged.reduce((sum, f) => sum + f.size, 0)
    if (total > MAX_TOTAL) {
      setFileError('O total de anexos ultrapassa 20 MB. Remova algum arquivo.')
      return
    }
    setFileError('')
    setFiles(merged)
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFileError('')
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const protocolo = makeProtocol()

    /* --------------------------------------------------------------
       Dados prontos para o backend: registrar no banco de dados e
       disparar o e-mail para o Comitê de Ética. Como há anexos,
       o envio usa FormData (multipart/form-data).
       As chaves abaixo correspondem às colunas do banco / campos
       do e-mail.
    -------------------------------------------------------------- */
    const dados = new FormData()
    dados.append('protocolo', protocolo)
    dados.append('empresa', form.empresa)
    dados.append('vinculo', form.vinculo)
    dados.append('categoria', form.categoria)
    dados.append('data_ocorrido', form.quando)   // opcional
    dados.append('local_setor', form.local)      // opcional
    dados.append('relato', form.relato)
    dados.append('registrado_em', new Date().toISOString())
    files.forEach((arquivo) => dados.append('anexos', arquivo, arquivo.name))

    // TODO: integrar com o backend — ele grava no banco e envia o e-mail.
    // await fetch('/api/denuncias', { method: 'POST', body: dados })

    setProtocol(protocolo)
    setCopied(false)
    window.scrollTo({ top: document.querySelector('.report')?.offsetTop - 40, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(EMPTY)
    setFiles([])
    setFileError('')
    setProtocol(null)
    setCopied(false)
  }

  function copyProtocol() {
    if (navigator.clipboard) navigator.clipboard.writeText(protocol)
    setCopied(true)
  }

  function handleTrack(e) {
    e.preventDefault()
    if (trackInput.trim()) setTracked(trackInput.trim().toUpperCase())
  }

  return (
    <div className="report" id="formulario">
      <div className="report__head">
        <h3 className="report__heading">Registrar denúncia</h3>
        <p className="report__subheading">{lorem.short}</p>
      </div>

      {/* alterna entre registrar e acompanhar */}
      <div className="report__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'new'}
          className={'report__tab' + (mode === 'new' ? ' is-active' : '')}
          onClick={() => setMode('new')}
        >
          Nova denúncia
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'track'}
          className={'report__tab' + (mode === 'track' ? ' is-active' : '')}
          onClick={() => setMode('track')}
        >
          Acompanhar denúncia
        </button>
      </div>

      {/* ----- modo: nova denúncia ----- */}
      {mode === 'new' && !protocol && (
        <div className="report__panel">
          <div className="anon-banner">
            <span className="anon-banner__icon"><IconShield /></span>
            <div>
              <strong>Esta denúncia é 100% anônima</strong>
              <p>
                Não solicitamos nome, e-mail ou telefone e não registramos
                endereço de IP. {lorem.short}
              </p>
            </div>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            {/* Empresa do grupo */}
            <div className="field">
              <label htmlFor="empresa">Empresa do grupo *</label>
              <select
                id="empresa"
                name="empresa"
                required
                value={form.empresa}
                onChange={update('empresa')}
              >
                <option value="" disabled>Selecione…</option>
                {groupCompanies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Seu vínculo */}
            <div className="field">
              <label htmlFor="vinculo">Seu vínculo *</label>
              <select
                id="vinculo"
                name="vinculo"
                required
                value={form.vinculo}
                onChange={update('vinculo')}
              >
                <option value="" disabled>Selecione…</option>
                {bondTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Categoria da denúncia */}
            <div className="field">
              <label htmlFor="categoria">Categoria da denúncia *</label>
              <select
                id="categoria"
                name="categoria"
                required
                value={form.categoria}
                onChange={update('categoria')}
              >
                <option value="" disabled>Selecione…</option>
                {reportCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quando ocorreu */}
            <div className="field">
              <label htmlFor="quando">Quando ocorreu (opcional)</label>
              <input
                id="quando"
                name="data_ocorrido"
                type="date"
                value={form.quando}
                onChange={update('quando')}
              />
            </div>

            {/* Local ou setor */}
            <div className="field field--full">
              <label htmlFor="local">Local ou setor (opcional)</label>
              <input
                id="local"
                name="local_setor"
                type="text"
                placeholder="Ex.: filial, unidade, departamento…"
                value={form.local}
                onChange={update('local')}
              />
            </div>

            {/* Descreva o ocorrido */}
            <div className="field field--full">
              <label htmlFor="relato">Descreva o ocorrido *</label>
              <textarea
                id="relato"
                name="relato"
                required
                rows={6}
                maxLength={4000}
                placeholder="Descreva o que aconteceu com o máximo de detalhes possível…"
                value={form.relato}
                onChange={update('relato')}
              />
              <span className="field__hint">
                Evite incluir dados que possam identificar você.
                {' '}{form.relato.length}/4000
              </span>
            </div>

            {/* Anexar prova */}
            <div className="field field--full">
              <label htmlFor="anexos">Anexar prova (opcional)</label>
              <label
                className={'file-drop' + (dragOver ? ' is-drag' : '')}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  id="anexos"
                  name="anexos"
                  type="file"
                  multiple
                  accept={ACCEPT}
                  onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
                />
                <span className="file-drop__icon"><IconUpload /></span>
                <span className="file-drop__text">
                  <strong>Clique para anexar</strong> ou arraste os arquivos aqui
                </span>
                <span className="file-drop__hint">
                  Imagem, documento ou vídeo · até 20 MB no total
                </span>
              </label>

              {fileError && (
                <span className="field__hint field__hint--error">{fileError}</span>
              )}

              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((f, i) => (
                    <li key={f.name + f.size + i} className="file-list__item">
                      <span className="file-list__icon"><IconDoc /></span>
                      <span className="file-list__name">{f.name}</span>
                      <span className="file-list__size">{formatSize(f.size)}</span>
                      <button
                        type="button"
                        className="file-list__remove"
                        onClick={() => removeFile(i)}
                        aria-label={`Remover ${f.name}`}
                      >
                        <IconX />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="report-form__actions">
              <p className="report-form__note">
                <IconLock style={{ width: 15, height: 15, verticalAlign: -3 }} />
                {' '}Envio criptografado e sigiloso.
              </p>
              <button type="submit" className="btn btn--primary">
                Enviar denúncia
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----- modo: nova denúncia — confirmação ----- */}
      {mode === 'new' && protocol && (
        <div className="report__panel">
          <div className="report-done">
            <span className="report-done__icon"><IconCheck /></span>
            <h4>Denúncia registrada com sucesso</h4>
            <p>
              Guarde o protocolo abaixo — ele é o <strong>único meio</strong> de
              acompanhar a denúncia mantendo seu anonimato.
            </p>

            <div className="protocol-box">
              <div>
                <span className="protocol-box__label">Protocolo</span>
                <span className="protocol-box__code">{protocol}</span>
              </div>
              <button type="button" className="copy-btn" onClick={copyProtocol}>
                {copied ? 'Copiado ✓' : 'Copiar'}
              </button>
            </div>

            <p className="report-done__hint">{lorem.short}</p>

            <button type="button" className="btn btn--ghost" onClick={resetForm}>
              Registrar nova denúncia
            </button>
          </div>
        </div>
      )}

      {/* ----- modo: acompanhar ----- */}
      {mode === 'track' && (
        <div className="report__panel">
          <form className="track-form" onSubmit={handleTrack}>
            <div className="field field--full">
              <label htmlFor="track">Informe o número do protocolo</label>
              <input
                id="track"
                type="text"
                placeholder="INT-2026-XXXXXX"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn--primary">Consultar</button>
          </form>

          {tracked && (
            <div className="track-result">
              <div className="track-result__head">
                <span>Protocolo</span>
                <strong>{tracked}</strong>
              </div>
              <ol className="timeline">
                <li className="is-done">
                  <strong>Denúncia recebida</strong>
                  <span>{lorem.short}</span>
                </li>
                <li className="is-done">
                  <strong>Em triagem</strong>
                  <span>{lorem.short}</span>
                </li>
                <li className="is-current">
                  <strong>Em análise</strong>
                  <span>{lorem.short}</span>
                </li>
                <li>
                  <strong>Concluída</strong>
                  <span>{lorem.short}</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
