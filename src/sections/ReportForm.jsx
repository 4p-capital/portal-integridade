import { useState } from 'react'
import { reportCategories, bondTypes } from '../data/content'
import { IconShield, IconLock, IconCheck, IconUpload, IconX, IconDoc } from './icons'
import './ReportForm.css'

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

/* Endpoint da Edge Function que recebe a denúncia. */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const ENDPOINT = `${SUPABASE_URL}/functions/v1/denuncia-receber`

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function ReportForm() {
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  /* Máscara dd/mm/aaaa: só dígitos, insere as barras automaticamente. */
  function updateQuando(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    let masked = digits
    if (digits.length > 4) {
      masked = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else if (digits.length > 2) {
      masked = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    setForm((prev) => ({ ...prev, quando: masked }))
  }

  /* Converte 'dd/mm/aaaa' em ISO 'aaaa-mm-dd', ou devolve mensagem de erro. */
  function parseQuando(s) {
    if (!s) return { iso: null }
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s)
    if (!m) return { erro: 'Data inválida — use o formato dd/mm/aaaa.' }
    const [, dia, mes, ano] = m
    const iso = `${ano}-${mes}-${dia}`
    const d = new Date(`${iso}T12:00:00`)
    if (
      Number.isNaN(d.getTime()) ||
      d.getFullYear() !== Number(ano) ||
      d.getMonth() + 1 !== Number(mes) ||
      d.getDate() !== Number(dia)
    ) {
      return { erro: 'Data inválida.' }
    }
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999)
    if (d > hoje) return { erro: 'A data não pode ser futura.' }
    return { iso }
  }

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return

    /* Valida a data antes de bloquear o botão (campo é opcional). */
    const { iso: dataISO, erro: dataErro } = parseQuando(form.quando)
    if (dataErro) {
      setSubmitError(dataErro)
      return
    }

    /* --------------------------------------------------------------
       A Edge Function "denuncia-receber" descarta o IP do denunciante,
       grava a denúncia no banco e dispara o e-mail para o Comitê de
       Ética. Como há anexos, o envio usa FormData (multipart/form-data).
    -------------------------------------------------------------- */
    const dados = new FormData()
    dados.append('empresa', form.empresa)
    dados.append('vinculo', form.vinculo)
    dados.append('categoria', form.categoria)
    if (dataISO) dados.append('data_ocorrido', dataISO)
    if (form.local) dados.append('local_setor', form.local)
    dados.append('relato', form.relato)
    files.forEach((arquivo) => dados.append('anexos', arquivo, arquivo.name))

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY },
        body: dados,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json().catch(() => ({}))
      if (!data?.ok) throw new Error('resposta inesperada')

      setSubmitted(true)
      window.scrollTo({
        top: document.querySelector('.report')?.offsetTop - 40,
        behavior: 'smooth',
      })
    } catch (err) {
      setSubmitError(
        'Não foi possível enviar sua denúncia agora. Verifique sua conexão e tente novamente em alguns instantes.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setForm(EMPTY)
    setFiles([])
    setFileError('')
    setSubmitError('')
    setSubmitted(false)
  }

  return (
    <div className="report" id="formulario">
      <div className="report__head">
        <h3 className="report__heading">Registrar denúncia</h3>
        <p className="report__subheading">
          Preencha o formulário abaixo. Você não precisa se identificar.
        </p>
      </div>

      {/* ----- formulário ----- */}
      {!submitted && (
        <div className="report__panel">
          <div className="anon-banner">
            <span className="anon-banner__icon"><IconShield /></span>
            <div>
              <strong>Esta denúncia é 100% anônima</strong>
              <p>
                Não solicitamos nome, e-mail ou telefone e não registramos
                endereço de IP. Sua identidade é preservada do início ao fim
                do processo.
              </p>
            </div>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            {/* Empresa do grupo */}
            <div className="field">
              <label htmlFor="empresa">Empresa do grupo *</label>
              <input
                id="empresa"
                name="empresa"
                type="text"
                required
                maxLength={200}
                placeholder="Nome da empresa do grupo"
                value={form.empresa}
                onChange={update('empresa')}
              />
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
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                pattern="\d{2}/\d{2}/\d{4}"
                value={form.quando}
                onChange={updateQuando}
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

            {submitError && (
              <p className="field__hint field__hint--error" role="alert">
                {submitError}
              </p>
            )}

            <div className="report-form__actions">
              <p className="report-form__note">
                <IconLock style={{ width: 15, height: 15, verticalAlign: -3 }} />
                {' '}Envio criptografado e sigiloso.
              </p>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting && <span className="btn__spinner" aria-hidden="true" />}
                {submitting ? 'Enviando…' : 'Enviar denúncia'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----- confirmação ----- */}
      {submitted && (
        <div className="report__panel">
          <div className="report-done">
            <span className="report-done__icon"><IconCheck /></span>
            <h4>Denúncia registrada com sucesso</h4>
            <p>
              Sua denúncia foi enviada com segurança ao Comitê de Ética e
              Integridade da EON. Em respeito ao seu anonimato, não
              registramos qualquer dado que permita identificá-lo(a) e não
              há canal de acompanhamento ou consulta posterior.
            </p>
            <p className="report-done__hint">
              A apuração será conduzida internamente conforme as nossas
              políticas. Agradecemos pela sua contribuição.
            </p>

            <button type="button" className="btn btn--ghost" onClick={resetForm}>
              Registrar nova denúncia
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
