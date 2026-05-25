# Briefing técnico — Portal de Integridade EON
## Insumo para elaboração da Política de Privacidade e Política de Proteção de Dados

> **Para quê serve este documento:** levantamento técnico, baseado em auditoria do código-fonte do portal, de **todos os pontos onde dados pessoais são (ou podem ser) tratados**. O objetivo é alimentar a redação das políticas com fatos verificáveis — não com presunções.
>
> **Data do scan:** 2026-05-25
> **Branch auditada:** `main` · commit `2eabb3e`
> **Auditor:** Claude (IA) — revisão recomendada pelo jurídico antes de publicação.
> **Revisão deste documento:** v2 — incorporadas decisões do time técnico/diretoria (Vercel, Supabase Pro em São Paulo, DPO Guilherme Rocha, distribuição por e-mail aos 4 diretores).

---

## 1. Identificação do Controlador

| Item | Valor | Observação |
|---|---|---|
| Nome | EON *(razão social oficial a confirmar)* | confirmar razão social formal |
| CNPJ | **17.958.805/0001-45** ✅ | |
| Endereço | **Setor de Autarquias Sul, Quadra 4, Bloco A, Sala 602 — Asa Sul, Brasília/DF, CEP 70070-938** ✅ | |
| E-mail institucional | `denuncia@eonbr.com` | grupo do Workspace com os 4 diretores; usado no rodapé do site e como destino das denúncias |
| E-mail de TI | `tecnologia@eonbr.com` | usado na seção LGPD do site |
| Encarregado de Dados (DPO) | **Guilherme Rocha** ✅ | designado conforme art. 41 LGPD |
| E-mail do DPO | `tecnologia@eonbr.com` ✅ | canal oficial para titulares exercerem direitos |

> ✅ **Resolvido:** Guilherme Rocha designado como Encarregado de Dados (DPO), com canal `tecnologia@eonbr.com`.

---

## 2. Arquitetura do sistema (estado atual)

### 2.1 Front-end (público)
- **Stack:** Vite 6 + React 18 (SPA estática)
- **Hospedagem:** **Vercel** ✅
  - Empresa: Vercel Inc. (Delaware, EUA)
  - Edge Network global com PoP em São Paulo (latência baixa no Brasil)
  - HTTPS automático via Let's Encrypt
  - **Vercel possui DPA público** ([vercel.com/legal/dpa](https://vercel.com/legal/dpa)) — assinar no painel da conta
- **Domínio:** *(a definir — provavelmente `integridade.eonbr.com` ou similar)*
- **HTTPS:** ✅ garantido pela Vercel
- **Logs de acesso da Vercel:** por padrão registram IP, user-agent, URL, timestamp (necessários para mitigação de ataques). Retenção: 30 dias no plano Pro.

### 2.2 Back-end — Supabase (definido)
- **Plataforma:** [Supabase](https://supabase.com) (BaaS — Backend-as-a-Service) ✅
  - **Empresa:** Supabase Inc. (Delaware, EUA)
  - **Infraestrutura subjacente:** AWS (Amazon Web Services)
- **Plano contratado:** **Supabase Pro** ✅
  - Backups diários com Point-in-Time Recovery (retenção 30 dias)
  - Logs de auditoria básicos
  - SLA de 99,9%
  - Suporte por e-mail
- **Região do projeto:** **`sa-east-1` (São Paulo)** ✅
  - Dados em repouso em território brasileiro
  - Simplifica discussão de transferência internacional (ver §10)
- **Banco de dados:** PostgreSQL gerenciado pela Supabase
- **Armazenamento de arquivos:** Supabase Storage (bucket privado, links assinados de curta duração)
- **Segurança de acesso:** **Row Level Security (RLS) ativado** ✅ — controle de acesso a nível de linha no PostgreSQL, executado pelo banco antes de qualquer consulta.

#### O que RLS significa juridicamente (importante para a política)
Com RLS ativado, **cada acesso a dados pessoais passa por uma política declarativa no banco**. Isso é um forte argumento de conformidade com:
- LGPD art. 6º, VII (princípio da segurança)
- LGPD art. 46 (medidas técnicas e administrativas)
- LGPD art. 50 (boas práticas e governança)

Operacionalmente: nem o front-end nem usuários comuns conseguem ler denúncias de outros — apenas perfis explicitamente autorizados pela política RLS (no caso, os membros do Comitê de Ética).

#### Modelo de envio (definido)

```
1. Visitante preenche o formulário no portal (Vercel)
        ↓
2. Front-end chama Edge Function da Supabase
        ↓
3. Edge Function:
   - Recebe os dados
   - DESCARTA o IP do visitante (não grava nem propaga)
   - Salva denúncia no banco (com RLS de INSERT público anônimo)
   - Salva anexos no Supabase Storage (bucket privado)
   - Envia e-mail via SMTP Workspace (noreply@eonbr.com → grupo denuncia@eonbr.com)
        ↓
4. E-mail aos diretores contém:
   - Conteúdo COMPLETO da denúncia (decisão da EON)
   - Anexos como links assinados temporários
        ↓
5. Diretores acessam painel autenticado para revisar/atualizar
   status interno da denúncia.
```

- **Edge Function descarta IP:** ✅ definido (honra a promessa "não registramos endereço de IP" feita no formulário)
- **Sem protocolo de acompanhamento:** ✅ definido — o sistema **não gera protocolo** nem oferece consulta pelo denunciante. A denúncia é enviada em modelo *fire-and-forget*: o denunciante apenas recebe uma confirmação de envio.
- **Auth dos diretores no painel:** Supabase Auth — *modalidade a definir (magic link recomendado para 4 usuários fixos, com 2FA obrigatório)*
- **Envio de e-mail:** SMTP do **Google Workspace** ✅ (remetente: `noreply@eonbr.com`; relay `smtp-relay.gmail.com:587` autenticado)
- **Destinatário das notificações:** **grupo do Workspace `denuncia@eonbr.com`** ✅ — contém os 4 diretores; mudança de diretor = atualizar membros do grupo (sem redeploy)
- **Backups:** Point-in-Time Recovery de 30 dias (incluído no plano Pro) ✅

### 2.3 Acompanhamento de denúncia pelo denunciante
**Não há acompanhamento.** A EON optou conscientemente por não gerar protocolo nem oferecer canal de consulta de status para o denunciante. Trade-offs registrados:

| Vantagem | Desvantagem |
|---|---|
| Reduz superfície de identificação do denunciante (impossibilita correlação entre identidade e protocolo) | Denunciante não tem visibilidade sobre andamento ou resolução |
| Simplifica arquitetura e reduz pontos de falha | Não é possível complementar a denúncia depois (cada nova informação vira nova denúncia) |
| Reduz exposição regulatória sobre tratamento prolongado de relação titular↔processo | Não atende plenamente recomendações da CGU sobre retorno ao denunciante |

> ⚠️ **Implicação para a política:** a Política de Proteção de Dados precisa **omitir** qualquer menção a "protocolo" ou "acompanhamento" e declarar que a comunicação é unidirecional.

---

## 3. INVENTÁRIO DE DADOS PESSOAIS COLETADOS

### 3.1 Pelo formulário de denúncia (`ReportForm.jsx`)

| # | Campo | Tipo | Obrigatório | Natureza LGPD |
|---|---|---|---|---|
| 1 | Empresa do grupo | seleção (lista fixa) | ✅ Sim | dado contextual |
| 2 | Vínculo do denunciante | seleção (Colaborador / Fornecedor / Cliente / Terceiro) | ✅ Sim | **dado pessoal indireto** (do denunciante) |
| 3 | Categoria da denúncia | seleção | ✅ Sim | dado contextual; pode revelar **dado sensível** (assédio = saúde/dignidade; discriminação = origem racial/orientação sexual/religião → art. 5º, II LGPD) |
| 4 | Data do ocorrido | data | ❌ Opcional | dado contextual |
| 5 | Local ou setor | texto livre | ❌ Opcional | pode identificar pessoas |
| 6 | Relato | texto livre (até 4.000 caracteres) | ✅ Sim | **CRÍTICO** — quase sempre contém dados pessoais e potencialmente sensíveis de terceiros (denunciado, vítimas, testemunhas) |
| 7 | Anexos (provas) | arquivos | ❌ Opcional | **CRÍTICO** — fotos, e-mails, contratos, prints podem conter qualquer tipo de PII e dado sensível |

**Categorias de denúncia configuradas hoje** (`content.js`):
- Assédio moral ou sexual ⚠️ *dado sensível potencial*
- Fraude ou desvio financeiro
- Corrupção e suborno
- Conflito de interesses
- Discriminação ⚠️ *dado sensível potencial*
- Segurança e saúde no trabalho ⚠️ *dado sensível (saúde)*
- Violação de dados pessoais (LGPD)
- Outros

**Tipos de arquivo aceitos em anexos:**
```
image/*, video/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt
```
Limite: **20 MB no total** por denúncia.

### 3.2 Dados NÃO coletados (declarado no site)
- Nome do denunciante
- E-mail do denunciante
- Telefone do denunciante
- Endereço IP do denunciante *(declarado, mas ver §4)*

### 3.3 Dados coletados **indiretamente** (logs, infra)

Mesmo sem o site pedir, **o ambiente coleta automaticamente:**

| Origem | Dados | Captado por |
|---|---|---|
| Servidor web | IP, user-agent, URL, timestamp | provedor de hospedagem |
| Provedor de e-mail | IP do servidor de origem, timestamp, headers SMTP | servidor de e-mail destinatário |
| Backend (quando existir) | timestamp do registro, IP, fingerprint | a depender da implementação |

> ⚠️ **PONTO DE ATENÇÃO JURÍDICO:** o site afirma textualmente *"não registramos endereço de IP"* (`ReportForm.jsx`, linha 167). Para que essa afirmação seja **verdadeira**, o backend precisará ser desenhado para descartar IP no momento do recebimento. Caso contrário, a política e o texto da interface se tornam **enganosos** — risco regulatório.

---

## 4. Cookies, trackers e analytics

### 4.1 O que existe hoje
**Zero cookies próprios.** Auditoria do código não encontrou:
- `localStorage` / `sessionStorage`
- `document.cookie`
- Google Analytics, Meta Pixel, Hotjar, Clarity, ou qualquer tag de tracking

### 4.2 Decisão sobre analytics
**Não serão usados Google Analytics, pixels ou heatmaps.** ✅
Decisão alinhada com a promessa de anonimato do canal de denúncia.

### 4.3 Conexões externas no carregamento da página
O `index.html` carrega recursos de terceiros:

| Recurso | Origem | Dados enviados | Decisão |
|---|---|---|---|
| Fonte Inter | `fonts.googleapis.com` / `fonts.gstatic.com` (Google Fonts) | IP do visitante, user-agent, referrer | **Manter no CDN** ✅ |

> ⚠️ **PONTO DE MENÇÃO OBRIGATÓRIA NA POLÍTICA:**
> Como a EON optou por manter o Google Fonts servido pelo CDN do Google LLC (EUA), a política precisa:
> 1. Declarar o uso do serviço.
> 2. Indicar Google LLC como operador internacional (art. 33 LGPD).
> 3. Indicar a finalidade (renderização tipográfica do site).
> 4. Indicar a base legal (legítimo interesse, art. 7º, IX LGPD).
> 5. Referenciar a [Política de Privacidade do Google](https://policies.google.com/privacy) como ponto de consulta complementar.

---

## 5. Destinatários dos dados (compartilhamento)

### 5.1 Internos
**Os 4 (quatro) diretores da EON**, que compõem o Comitê de Ética e Integridade. ✅

> **Pendência (não bloqueante):** identificar os 4 cargos diretivos nominalmente em ata interna do Comitê (a política pode citar apenas "os 4 diretores da Empresa, integrantes do Comitê de Ética e Integridade").

### 5.2 Externos (operadores)

| Operador | Função | Dados acessados | País / Datacenter | DPA |
|---|---|---|---|---|
| **Supabase Inc.** | Backend (banco PostgreSQL + Storage + Edge Functions + Auth) | **TUDO** — denúncias, anexos, logs administrativos | EUA (matriz) / **Brasil (sa-east-1)** datacenter | ✅ Disponível publicamente — [link](https://supabase.com/legal/dpa). **Precisa ser aceito** |
| **AWS (Amazon Web Services)** | Infraestrutura subjacente do Supabase | Dados em repouso | Brasil (datacenter São Paulo) | Sub-operador do Supabase — coberto pelo DPA dele |
| **Vercel Inc.** | Hospedagem do front-end | Logs de acesso ao site (IP, user-agent) | EUA (matriz) / Edge Network global com PoP em São Paulo | ✅ Disponível publicamente — [link](https://vercel.com/legal/dpa). **Precisa ser aceito** |
| **Google LLC — Google Workspace** | Recebimento e armazenamento das denúncias completas nas caixas dos 4 diretores | **Conteúdo completo de cada denúncia** | EUA (matriz) / Datacenters globais | [Google Cloud DPA](https://workspace.google.com/terms/dpa_terms.html) — **assinar no Admin Console** |
| **Google LLC — SMTP Workspace (relay)** | Envio das notificações com a denúncia pela Edge Function da Supabase | **Conteúdo completo de cada denúncia (em trânsito SMTP)** | EUA (matriz) / Datacenters globais | **DPA Workspace já cobre este uso** ✅ — mesmo contrato Google Cloud DPA |
| **Google LLC** (Google Fonts) | Tipografia do site | IP do visitante | EUA | Coberto pela [Política do Google](https://policies.google.com/privacy) |

> ⚠️ **Cada operador precisa estar contratualmente vinculado (art. 39 LGPD).**
> Ação imediata: aceitar/assinar **DPA da Supabase** e **DPA da Vercel** no painel das respectivas plataformas. Quando o provedor de e-mail transacional for escolhido, fazer o mesmo.

### 5.3 Autoridades públicas
A política precisa mencionar que dados podem ser compartilhados quando exigido por lei (ordem judicial, ANPD, MPT, Receita Federal, etc.).

---

## 5.3 Modelo de distribuição por e-mail aos diretores — pontos que a política precisa cobrir

A EON optou conscientemente por enviar o **conteúdo completo** da denúncia ao e-mail corporativo dos 4 diretores (decisão de negócio, registrada neste briefing). Esse modelo é juridicamente válido, mas exige que a Política de Proteção de Dados aborde explicitamente alguns pontos:

### 5.3.1 Pontos obrigatórios de menção
1. **Lista nominal de destinatários internos** — declarar que o conteúdo é compartilhado com os 4 diretores da EON (membros do Comitê de Ética).
2. **Finalidade do compartilhamento** — apuração da denúncia conforme Lei 12.846/2013, Lei 14.457/2022 e Código de Ética interno.
3. **Google Workspace como operador** — declarado; DPA pendente de assinatura no Admin Console.
4. **SMTP do Google Workspace** como mecanismo de envio (relay autenticado) — coberto pelo mesmo DPA do Workspace.
5. **Dever de sigilo dos diretores** — vincular cada diretor a um termo de confidencialidade específico (NDA) que sobrevive ao desligamento.
6. **Procedimento em caso de troca de diretor** — quando um diretor sai da empresa:
   - Acesso ao e-mail corporativo é revogado
   - Caixa postal arquivada conforme política interna
   - Substituto recebe acesso ao histórico apenas mediante ata de posse no Comitê
7. **Proibição expressa de encaminhamento** — diretores não podem encaminhar denúncias para terceiros (interno ou externo) sem decisão formal do Comitê.

### 5.3.2 Cláusulas técnicas que a EON precisa implementar para sustentar a política
- [ ] **2FA obrigatório** em todas as 4 contas de e-mail corporativo dos diretores
- [ ] **Política de senha forte** (Microsoft 365 / Google Workspace já oferecem)
- [ ] **DLP (Data Loss Prevention)** ativado no provedor de e-mail para bloquear encaminhamento automático externo
- [ ] **Retenção da caixa postal** alinhada com a política da EON (5 anos sugeridos — ver §7)
- [ ] **Termo de Confidencialidade** assinado pelos 4 diretores específico para tratamento de denúncias
- [ ] **Procedimento documentado de offboarding** de diretor com acesso ao canal

### 5.3.3 Riscos residuais que a política precisa declarar honestamente
A LGPD exige transparência. A política precisa informar aos titulares (denunciantes, denunciados, terceiros mencionados) que:
- O conteúdo é replicado em 4 caixas postais corporativas além do banco Supabase
- Os provedores de e-mail mantêm backups próprios sob suas políticas
- Em caso de incidente em uma das caixas, o procedimento de notificação é o do §11

---

## 6. Bases legais aplicáveis (art. 7º e 11 LGPD)

Sugestão técnica — **a confirmar pelo jurídico**:

| Tratamento | Base legal aplicável |
|---|---|
| Coleta da denúncia | **Cumprimento de obrigação legal/regulatória** (Lei 12.846/2013 + Decreto 11.129/2022 + Lei 14.457/2022 sobre canal de denúncias) |
| Distribuição da denúncia para os 4 diretores via e-mail | **Cumprimento de obrigação legal/regulatória** + **exercício regular de direito** (apuração) |
| Logs da Vercel (IP, user-agent) | **Legítimo interesse** (segurança da informação, mitigação de ataques) — art. 7º, IX |
| Logs administrativos do Supabase | **Legítimo interesse** (auditoria interna) — art. 7º, IX |
| Dados sensíveis no relato (saúde, raça, orientação sexual) | **Cumprimento de obrigação legal/regulatória** — art. 11, II, "a" |
| Dados de terceiros mencionados (denunciado, testemunhas) | **Exercício regular de direito** + **legítimo interesse da Empresa** em apurar irregularidades |
| Google Fonts (mantido no CDN) | **Legítimo interesse** (renderização tipográfica do site) — art. 7º, IX |

---

## 7. Retenção e descarte

**A definir pelo jurídico/compliance.** Referenciais comuns no mercado:

| Dado | Prazo sugerido | Fundamento | Local |
|---|---|---|---|
| Denúncia + apuração + parecer (no Supabase) | **5 anos** após conclusão | prazo de prescrição da Lei Anticorrupção (art. 25, Lei 12.846/2013) | Supabase |
| Anexos (provas) | mesmo prazo da denúncia | acompanha o processo | Supabase Storage |
| **E-mails com denúncias (4 caixas dos diretores)** | **mesmo prazo de 5 anos** — política de retenção aplicada via Google Workspace Vault / regras de retenção | acompanha o processo | Google Workspace |
| Logs da Vercel (IP, user-agent do visitante) | **6 meses** (Marco Civil — Lei 12.965/2014, art. 15) | obrigação legal mínima | Vercel (30 dias por padrão Pro) |
| Logs administrativos do Supabase | 90 dias (padrão Pro) | configuração do plano | Supabase |
| Backup Supabase (PITR) | 30 dias após exclusão dos dados primários | configuração do plano Pro | Supabase |

> ⚠️ **Ponto crítico:** o prazo de retenção dos e-mails deve ser **alinhado entre Supabase e provedor de e-mail**. Se o provedor de e-mail guardar por menos tempo (ex.: 1 ano), há divergência de evidência. Se guardar por mais tempo (ex.: backup eterno), há violação de minimização (art. 6º, III LGPD).

---

## 8. Direitos dos titulares (art. 18 LGPD)

A política precisa listar e indicar como exercer:

- Confirmação da existência de tratamento
- Acesso aos dados
- Correção de dados incompletos/inexatos
- Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos
- Portabilidade
- Eliminação dos dados tratados com consentimento
- Informação sobre compartilhamento
- Informação sobre não fornecer consentimento e consequências
- Revogação de consentimento
- Revisão de decisões automatizadas (não aplicável a este sistema)

**Canal proposto para exercício dos direitos:** `tecnologia@eonbr.com` (ou e-mail específico do DPO quando nomeado).

> ⚠️ **Conflito de direitos no canal de denúncia:** o denunciado tem direito de acesso aos dados sobre ele, **mas** isso pode comprometer a apuração e o anonimato do denunciante. A política precisa equilibrar isso — a Lei 12.846/2013 e regulamentos da CGU permitem **restringir o direito de acesso** durante a apuração.

---

## 9. Segurança da informação

### 9.1 O que já está garantido tecnicamente
- ✅ Anonimato no front-end (não pede dados de identificação)
- ✅ Acesso via HTTPS (assumindo hospedagem moderna)
- ✅ **Sem protocolo / sem acompanhamento** — modelo *fire-and-forget* elimina qualquer rastro de correlação titular↔denúncia
- ✅ **Row Level Security (RLS) ativado no Supabase** — controle de acesso a dados executado pelo banco antes de qualquer query (LGPD art. 46)
- ✅ **Criptografia em repouso** — Supabase criptografa todos os dados (AES-256) por padrão (provido pela AWS)
- ✅ **Criptografia em trânsito** — TLS 1.2+ obrigatório no Supabase
- ✅ **Backups automáticos** — Point-in-Time Recovery do Supabase (retenção depende do plano)
- ✅ **Compliance certificações Supabase:** SOC 2 Type II, HIPAA-eligible

### 9.2 O que ainda precisa ser implementado/decidido
- [ ] **Edge Function (ou trigger) que descarta IP** ao gravar a denúncia. *Sem isso, o site mente quando afirma "não registramos IP".*
- [ ] **Políticas RLS bem desenhadas:**
  - `INSERT` público anônimo na tabela `denuncias` (qualquer um pode criar)
  - `SELECT` restrito a usuários autenticados com claim `role = 'comite_etica'`
  - `UPDATE/DELETE` restrito a `role = 'comite_etica'` + log de auditoria
  - Storage de anexos com bucket privado, links assinados de curta duração
- [ ] **Log de auditoria de acesso administrativo** — Supabase tem audit logs no plano Team; em planos menores, criar tabela `audit_log` com trigger
- [ ] **Plano de resposta a incidentes** (LGPD art. 48): processo escrito de quem faz o quê em caso de vazamento; prazo de comunicação à ANPD e aos titulares
- [ ] **2FA obrigatório** para os diretores que acessam o painel
- [ ] **Política de senhas fortes** (mínimo 12 caracteres, complexidade) — configurável no Supabase Auth

---

## 10. Transferência internacional de dados (art. 33 LGPD)

### 10.1 Cenário definido
- ✅ **Supabase em `sa-east-1` (São Paulo)** — dados em repouso no Brasil
- ⚠️ **Supabase Inc. é empresa dos EUA** — embora os dados estejam no Brasil, o operador é estrangeiro
- ⚠️ **Vercel é empresa dos EUA** — front-end é servido por edge network global; logs de acesso podem trafegar pelos EUA
- ⚠️ **Google LLC (Google Fonts)** — IP do visitante enviado aos EUA
- ⚠️ **Google Workspace** (provedor de e-mail corporativo) = EUA
- ⚠️ **SMTP do Google Workspace** (envio das notificações) = mesmo provedor Google → coberto pelo Workspace DPA

### 10.2 Garantias contratuais a invocar na política
Para cada operador, a política deve declarar a garantia que ampara a transferência internacional (art. 33, II LGPD):

| Operador | Garantia |
|---|---|
| Supabase | [DPA público](https://supabase.com/legal/dpa) + Standard Contractual Clauses + certificação SOC 2 Type II |
| AWS (sub-operador) | AWS DPA + cláusulas-padrão GDPR + datacenter no Brasil |
| Vercel | [DPA público](https://vercel.com/legal/dpa) + Standard Contractual Clauses |
| Provedor de e-mail | DPA do provedor (Microsoft / Google têm públicos) |
| SMTP Workspace (envio) | Coberto pelo Google Cloud DPA ✅ |
| Google LLC (Fonts) | [Política do Google](https://policies.google.com/privacy) |

### 10.3 Base legal da transferência
Art. 33, II, alínea "a" LGPD — *cláusulas contratuais específicas para determinada transferência*.

---

## 11. Especificidades regulatórias do Canal de Denúncias

A Política de Proteção de Dados (a do canal) precisa se alinhar com:

| Norma | Exigência relevante |
|---|---|
| **Lei 12.846/2013** (Anticorrupção) + **Decreto 11.129/2022** | Canal de denúncias com confidencialidade; investigação imparcial; sanções administrativas |
| **Lei 14.457/2022** (Programa Emprega + Mulher) | Empresas com CIPA precisam ter canal de denúncia de assédio com sigilo |
| **CLT, art. 482** | Justa causa por violação de código de ética só vale com processo formal |
| **CGU IN nº 1/2018** e **Portarias CGU** | Boas práticas de canal de denúncia |
| **Resolução CFM, OAB, etc.** | Se aplicável aos colaboradores de classes regulamentadas |
| **Guia ANPD sobre Canais de Denúncia** (2023) | Recomendações específicas para tratamento de dados em canais de ética |

---

## 12. Checklist final — decisões tomadas e pendências

### ✅ Sobre a empresa (decidido)
- [ ] CNPJ, razão social, endereço completo da EON — *(formalidade documental, jurídico preenche)*
- [x] **Encarregado de Dados (DPO): Guilherme Rocha** ✅
- [ ] E-mail dedicado do DPO (sugerido `dpo@eonbr.com`) — *pendência menor*
- [x] **Comitê de Ética e Integridade: 4 diretores da EON** ✅ (identificação nominal em ata interna)

### ✅ Sobre infraestrutura (decidido)
- [x] **Front-end:** Vercel ✅
- [ ] Domínio final — *a definir (sugerido `integridade.eonbr.com`)*
- [x] **Provedor de e-mail corporativo: Google Workspace** ✅
- [x] **Analytics/Trackers:** Não serão usados ✅
- [x] **Google Fonts:** Manter no CDN ✅ — política precisa declarar Google LLC como operador

### ✅ Sobre o backend (decidido)
- [x] **Plataforma:** Supabase ✅
- [x] **Segurança de acesso:** Row Level Security (RLS) ativado ✅
- [x] **Região do projeto:** `sa-east-1` São Paulo ✅
- [x] **Plano:** Supabase Pro ✅
- [x] **Inserção da denúncia:** via Edge Function que descarta IP ✅
- [ ] **Auth dos diretores no painel:** Magic link recomendado + 2FA — *implementação pendente*
- [x] **Envio de e-mail:** SMTP do Google Workspace (relay autenticado via `noreply@eonbr.com`) ✅
- [x] **DPA da Supabase aceito** ✅
- [x] **DPA da Vercel aceito** ✅
- [x] **DPA do Google Workspace aceito** ✅
- [x] **Storage de anexos:** bucket privado com links assinados ✅

### ✅ Sobre distribuição da denúncia (decidido)
- [x] **Conteúdo completo enviado por e-mail aos 4 diretores** ✅
- [ ] **2FA obrigatório** nas 4 contas corporativas — *implementação pendente*
- [ ] **DLP no provedor de e-mail** (bloquear encaminhamento externo) — *configuração pendente*
- [ ] **NDA específico** para cada diretor sobre tratamento de denúncias — *jurídico providencia*

### Sobre retenção
- [ ] Confirmar 5 anos para denúncias + apurações + e-mails — *sugestão técnica; jurídico confirma*
- [ ] Procedimento de descarte coordenado entre Supabase e caixas postais — *implementação pendente*

### Sobre direitos do titular
- [x] E-mail oficial para exercício de direitos LGPD: **`tecnologia@eonbr.com`** ✅
- [ ] Prazo de resposta — sugestão: 15 dias úteis (recomendação ANPD)

### Sobre incidentes
- [x] Responsável pela notificação à ANPD: Guilherme Rocha (DPO) ✅
- [ ] Procedimento escrito de resposta a incidentes — *jurídico/compliance redige*

---

## 13. Resumo executivo (TL;DR para o jurídico)

> ### O que é o sistema
> O Portal de Integridade é uma SPA estática (Vite + React) hospedada na **Vercel**, com backend em **Supabase Pro (região São Paulo)** com **Row Level Security ativado**. Coleta denúncias anônimas por formulário e distribui o conteúdo aos 4 diretores da EON (Comitê de Ética) por e-mail.
>
> ### Arquitetura de dados
> ```
> Visitante → Vercel (front) → Edge Function Supabase (descarta IP)
>                                  ↓
>                          Banco PostgreSQL (RLS) + Storage (anexos)
>                                  ↓
>                          E-mail transacional → 4 caixas corporativas
> ```
>
> ### Quem trata os dados (operadores)
> - **Supabase Inc.** (EUA, datacenter São Paulo) — banco, storage, edge functions, auth
> - **Vercel Inc.** (EUA, edge global) — hospedagem do front
> - **Google LLC — Google Workspace** (EUA) — recebimento e armazenamento das denúncias completas nas 4 caixas dos diretores
> - **SMTP do Google Workspace** (envio via `noreply@eonbr.com`, destinatário grupo `denuncia@eonbr.com`)
> - **Google LLC** (EUA) — Google Fonts (apenas tipografia)
>
> ### Encarregado de Dados (DPO)
> **Guilherme Rocha** — canal oficial `tecnologia@eonbr.com`.
>
> ### Pontos críticos para a redação das políticas
> 1. **Dois operadores estrangeiros (Supabase + Vercel) com datacenter no Brasil** — declarar a transferência internacional indireta (art. 33, II LGPD) com SCCs + DPAs públicos.
> 2. **Conteúdo da denúncia trafega e fica armazenado em 5 lugares simultaneamente** — Supabase + 4 caixas postais dos diretores. A política precisa cobrir explicitamente isso (§5.3 deste briefing).
> 3. **Promessa de "não registrar IP do denunciante"** precisa ser sustentada por Edge Function (em implementação) — sem isso, a política se torna enganosa.
> 4. **Categorias de denúncia incluem dado sensível** (assédio, discriminação, saúde) → base do art. 11, II, "a" LGPD aplicável.
> 5. **Google Fonts mantido no CDN** → declarar Google LLC como operador internacional.
> 6. **Não há analytics, cookies ou trackers** — pode ser citado como boa prática.
> 7. **Retenção sugerida:** 5 anos (Lei Anticorrupção, art. 25) para denúncias e e-mails; 6 meses (Marco Civil, art. 15) para logs Vercel.
> 8. **Medidas técnicas a invocar (art. 46 e 50 LGPD):** RLS + criptografia AES-256 em repouso + TLS em trânsito + SOC 2 Type II do Supabase + 2FA obrigatório nas contas dos diretores.
>
> ### Ações imediatas antes de publicar o portal
> 1. ✅ ~~Aceitar DPA da **Supabase**~~ — **CONCLUÍDO**
> 2. ✅ ~~Aceitar DPA da **Vercel**~~ — **CONCLUÍDO**
> 3. ✅ ~~Assinar DPA do **Google Workspace**~~ — **CONCLUÍDO**
> 4. ⬜ Configurar **2FA obrigatório** nas 4 contas dos diretores
> 5. ⬜ Implementar **Edge Function de ingestão sem IP**
> 6. ⬜ Criar **NDA específico** para os 4 diretores sobre tratamento de denúncias

---

*Documento gerado a partir de auditoria do código-fonte. Não substitui parecer jurídico.*
