// ============================================================
// Canal de Denúncias — recebimento, persistência e notificação.
//
// Política de anonimato:
//   - Esta função NÃO lê, registra ou persiste o IP do cliente
//     (x-forwarded-for, cf-connecting-ip, x-real-ip, etc.).
//   - Não solicita nome, e-mail ou telefone do denunciante.
//   - Service role é usado apenas server-side (nunca devolvido).
//
// Endpoint público (verify_jwt: false): recebe multipart/form-data
// com os campos do formulário e 0..N arquivos no campo "anexos".
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import nodemailer from "npm:nodemailer@6.9.16";

const SUPABASE_URL          = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY      = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SMTP_HOST             = Deno.env.get("SMTP_HOST")!;
const SMTP_PORT             = Number(Deno.env.get("SMTP_PORT") ?? "587");
const SMTP_USER             = Deno.env.get("SMTP_USER")!;
const SMTP_PASS             = Deno.env.get("SMTP_PASS")!;
const SMTP_FROM             = Deno.env.get("SMTP_FROM") ?? "noreply@eonbr.com";
const SMTP_FROM_NAME        = Deno.env.get("SMTP_FROM_NAME") ?? "Canal de Denúncias EON";
const DESTINO_EMAIL         = Deno.env.get("DENUNCIA_DESTINO_EMAIL")!;
const SIGNED_URL_EXPIRES_S  = Number(Deno.env.get("SIGNED_URL_EXPIRES_SECONDS") ?? "2592000"); // 30 dias

const BUCKET = "denuncias-anexos";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const MAX_RELATO      = 4000;
const MIN_RELATO      = 10;

// MIME types permitidos (espelha o ACCEPT do front).
const ALLOWED_MIME = [
  /^image\//,
  /^video\//,
  /^application\/pdf$/,
  /^application\/msword$/,
  /^application\/vnd\.openxmlformats-officedocument\./,
  /^application\/vnd\.ms-excel$/,
  /^application\/vnd\.ms-powerpoint$/,
  /^text\/plain$/,
];

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ erro: "metodo_nao_permitido" }, 405);
  }

  let denunciaId: string | null = null;

  try {
    const form = await req.formData();

    const empresa       = trim(form.get("empresa"));
    const vinculo       = trim(form.get("vinculo"));
    const categoria     = trim(form.get("categoria"));
    const data_ocorrido = trim(form.get("data_ocorrido")) || null;
    const local_setor   = trim(form.get("local_setor"))   || null;
    const relato        = trim(form.get("relato"));

    // ----- validação básica -----
    if (!empresa || !vinculo || !categoria || !relato) {
      return json({ erro: "campos_obrigatorios" }, 400);
    }
    if (empresa.length > 200 || vinculo.length > 100 || categoria.length > 200) {
      return json({ erro: "tamanho_invalido" }, 400);
    }
    if (relato.length < MIN_RELATO || relato.length > MAX_RELATO) {
      return json({ erro: "relato_fora_do_limite" }, 400);
    }
    if (local_setor && local_setor.length > 500) {
      return json({ erro: "local_setor_invalido" }, 400);
    }
    if (data_ocorrido && !/^\d{4}-\d{2}-\d{2}$/.test(data_ocorrido)) {
      return json({ erro: "data_invalida" }, 400);
    }

    const anexos = form.getAll("anexos").filter((v): v is File => v instanceof File);
    let totalBytes = 0;
    for (const f of anexos) {
      totalBytes += f.size;
      if (!ALLOWED_MIME.some((re) => re.test(f.type))) {
        return json({ erro: "tipo_arquivo_nao_permitido" }, 400);
      }
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      return json({ erro: "tamanho_total_excedido" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ----- 1) grava denúncia -----
    const { data: denuncia, error: insertErr } = await supabase
      .from("denuncias")
      .insert({ empresa, vinculo, categoria, data_ocorrido, local_setor, relato })
      .select("id, criado_em")
      .single();

    if (insertErr || !denuncia) {
      console.error("denuncia_insert_fail", insertErr?.message);
      return json({ erro: "falha_persistencia" }, 500);
    }
    denunciaId = denuncia.id;

    // ----- 2) upload anexos + metadados + signed URL -----
    const anexosInfo: { nome: string; signed_url: string; tamanho: number; mime: string }[] = [];

    for (const file of anexos) {
      const safeName = file.name.replace(/[^\w.\-]/g, "_").slice(0, 120);
      const path = `${denuncia.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        console.error("anexo_upload_fail", upErr.message);
        return json({ erro: "falha_upload_anexo" }, 500);
      }

      const { error: metaErr } = await supabase
        .from("denuncia_anexos")
        .insert({
          denuncia_id:   denuncia.id,
          storage_path:  path,
          nome_original: file.name,
          tamanho_bytes: file.size,
          mime_type:     file.type,
        });
      if (metaErr) {
        console.error("anexo_meta_fail", metaErr.message);
        return json({ erro: "falha_metadata_anexo" }, 500);
      }

      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_EXPIRES_S);
      if (signErr || !signed) {
        console.error("anexo_sign_fail", signErr?.message);
        return json({ erro: "falha_url_assinada" }, 500);
      }

      anexosInfo.push({
        nome: file.name,
        signed_url: signed.signedUrl,
        tamanho: file.size,
        mime: file.type,
      });
    }

    // ----- 3) e-mail para o Comitê de Ética -----
    const html = montarEmailHtml({
      id: denuncia.id,
      criado_em: denuncia.criado_em,
      empresa, vinculo, categoria,
      data_ocorrido, local_setor, relato,
      anexos: anexosInfo,
      expiracaoLinksDias: Math.floor(SIGNED_URL_EXPIRES_S / 86400),
    });

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true para 465 (TLS implícito), false para 587 (STARTTLS)
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    try {
      await transporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
        to: DESTINO_EMAIL,
        subject: `[Canal de Denúncias] ${categoria} — ${empresa}`,
        html,
      });
    } finally {
      transporter.close();
    }

    // Resposta opaca: não devolvemos id ao cliente para reforçar o anonimato
    // (sem canal de acompanhamento posterior).
    return json({ ok: true }, 200);
  } catch (err) {
    // Não logamos cabeçalhos nem corpo, apenas a mensagem do erro.
    console.error("denuncia_receber_unhandled", (err as Error)?.message, "denunciaId=", denunciaId);
    return json({ erro: "falha_interna" }, 500);
  }
});

// ---------- helpers ----------

function trim(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function fmtBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

// "25/05/2026 às 13:42" em hora de Brasília
function fmtData(iso: string): string {
  const d = new Date(iso);
  const data = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(d);
  const hora = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(d);
  return `${data} às ${hora}`;
}

function montarEmailHtml(d: {
  id: string;
  criado_em: string;
  empresa: string;
  vinculo: string;
  categoria: string;
  data_ocorrido: string | null;
  local_setor: string | null;
  relato: string;
  anexos: { nome: string; signed_url: string; tamanho: number; mime: string }[];
  expiracaoLinksDias: number;
}): string {
  // Tokens da identidade do portal (espelham src/styles/global.css)
  const c = {
    bg:        "#f1f1f2",
    card:      "#ffffff",
    surface2:  "#f7f7f8",
    line:      "#e5e5e7",
    ink:       "#1f2225",
    inkSoft:   "#62656b",
    inkFaint:  "#9a9da3",
    brand900:  "#1d1d1f",
    gold:      "#8c7245",
    goldOnDark:"#bcab8f",
  };
  const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  const fmtDataOcorrido = (s: string | null) => {
    if (!s) return "—";
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
  };

  const row = (label: string, value: string, isLast = false) => {
    const border = isLast ? "none" : `1px solid ${c.line}`;
    return `<tr>
      <td style="padding:13px 18px;font-size:12px;color:${c.inkSoft};font-weight:500;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;width:130px;vertical-align:top;border-bottom:${border};">${label}</td>
      <td style="padding:13px 18px;font-size:14px;color:${c.ink};border-bottom:${border};">${escapeHtml(value)}</td>
    </tr>`;
  };

  const anexosBloco = d.anexos.length
    ? `
      <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${c.inkSoft};font-weight:600;margin:0 0 6px;">
        Anexos · ${d.anexos.length}
      </div>
      <div style="font-size:11px;color:${c.inkFaint};margin:0 0 14px;">
        Links válidos por ${d.expiracaoLinksDias} dias.
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${c.line};border-radius:10px;border-collapse:separate;">
        ${d.anexos.map((a, i) => {
          const border = i === d.anexos.length - 1 ? "none" : `1px solid ${c.line}`;
          return `<tr>
            <td style="padding:12px 16px;font-size:14px;border-bottom:${border};">
              <a href="${a.signed_url}" style="color:${c.gold};text-decoration:none;font-weight:600;">${escapeHtml(a.nome)}</a>
              <div style="color:${c.inkFaint};font-size:11px;margin-top:2px;">${fmtBytes(a.tamanho)} · ${escapeHtml(a.mime || "arquivo")}</div>
            </td>
          </tr>`;
        }).join("")}
      </table>`
    : `
      <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${c.inkSoft};font-weight:600;margin:0 0 6px;">Anexos</div>
      <div style="font-size:13px;color:${c.inkFaint};">Nenhum anexo enviado.</div>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Nova denúncia · Canal de Integridade EON</title>
</head>
<body style="margin:0;padding:0;background:${c.bg};font-family:${font};color:${c.ink};line-height:1.55;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.bg};padding:32px 16px;">
    <tr><td align="center">

      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background:${c.card};border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(20,20,20,.10);">

        <!-- HEADER -->
        <tr>
          <td style="background:${c.brand900};padding:28px 32px 24px;color:#ffffff;">
            <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${c.goldOnDark};font-weight:600;margin:0 0 8px;">
              Canal de Integridade · EON
            </div>
            <div style="font-size:22px;font-weight:700;letter-spacing:.2px;line-height:1.25;">
              Nova denúncia recebida
            </div>
          </td>
        </tr>
        <!-- Linha dourada de acento -->
        <tr><td style="height:3px;background:${c.gold};line-height:3px;font-size:0;">&nbsp;</td></tr>

        <!-- META -->
        <tr>
          <td style="padding:22px 32px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:${c.inkSoft};">
              <tr>
                <td style="padding:0 0 6px;">
                  <span style="font-weight:600;color:${c.ink};text-transform:uppercase;letter-spacing:.4px;">Protocolo</span>
                  &nbsp;
                  <span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;color:${c.ink};background:${c.surface2};padding:3px 9px;border-radius:6px;font-size:12px;">${escapeHtml(d.id)}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="font-weight:600;color:${c.ink};text-transform:uppercase;letter-spacing:.4px;">Recebida em</span>
                  &nbsp;${escapeHtml(fmtData(d.criado_em))} <span style="color:${c.inkFaint};">(horário de Brasília)</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DADOS -->
        <tr>
          <td style="padding:18px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${c.line};border-radius:12px;border-collapse:separate;overflow:hidden;">
              ${row("Empresa",     d.empresa)}
              ${row("Vínculo",     d.vinculo)}
              ${row("Categoria",   d.categoria)}
              ${row("Quando",      fmtDataOcorrido(d.data_ocorrido))}
              ${row("Local/Setor", d.local_setor ?? "—", true)}
            </table>
          </td>
        </tr>

        <!-- RELATO -->
        <tr>
          <td style="padding:22px 32px 0;">
            <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${c.inkSoft};font-weight:600;margin:0 0 8px;">
              Relato
            </div>
            <div style="background:${c.surface2};border-left:3px solid ${c.gold};border-radius:10px;padding:16px 20px;font-size:14px;color:${c.ink};white-space:pre-wrap;line-height:1.65;">${escapeHtml(d.relato)}</div>
          </td>
        </tr>

        <!-- ANEXOS -->
        <tr>
          <td style="padding:22px 32px 28px;">
            ${anexosBloco}
          </td>
        </tr>

        <!-- FOOTER do card -->
        <tr>
          <td style="background:${c.surface2};border-top:1px solid ${c.line};padding:18px 32px;font-size:11px;color:${c.inkSoft};line-height:1.55;">
            Esta mensagem foi gerada automaticamente pelo Canal de Denúncias.
            Em respeito ao anonimato do denunciante,
            <strong style="color:${c.ink};font-weight:600;">nenhum dado identificador</strong>
            (IP, nome, e-mail ou telefone) é coletado ou armazenado.
          </td>
        </tr>

      </table>

      <!-- Assinatura -->
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;margin-top:14px;">
        <tr>
          <td align="center" style="font-size:11px;color:${c.inkFaint};letter-spacing:.4px;padding:8px 16px;">
            EON · Canal de Integridade
          </td>
        </tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;
}
