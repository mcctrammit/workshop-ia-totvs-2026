# Workshop — IA nos Produtos TOTVS | Hotsite

**Versão V5 — Google Apps Script + Gmail**. Foto oficial na capa, quatro CTAs, sem RD Station ou Resend.

## O que já está confirmado
- O usuário executou a função `testarEmail()` no Apps Script, e **recebeu** o teste no endereço `fabio.loliveira@totvs.com.br`.
- O usuário implantou o Apps Script em uma URL `/exec` informada em 10/11/2026 (incluída no servidor em `api/lead.js`).
- Os quatro CTAs passam o identificador da palestra (1, 2, 3 ou 4).

## Configurar o segredo (OBRIGATÓRIO)

No Google Apps Script, abra Configurações do projeto → Propriedades do script → `FORM_TOKEN`. Defina uma senha aleatória longa (mínimo 32 caracteres). Caso ainda não exista, crie-a. Guarde-a privadamente.

Na Vercel, configure **exatamente o mesmo valor**:

- `FORM_TOKEN` = mesmo segredo que está nas propriedades do Apps Script.

Não inclua o token no HTML, no GitHub nem em mensagens de chat. Se adicionar/modificar a variável após o deploy, faça **Redeploy**.

A URL pública do Apps Script já está registrada em `api/lead.js`, e o servidor Vercel a chama sem expor o token ao visitante.

## Publicação com GitHub + Vercel

1. Crie um repositório GitHub e envie o conteúdo *desta pasta* para a raiz: `index.html`, `assets/`, `api/`, `package.json`, `tests/` etc.
2. Importe o repositório na Vercel (Framework Preset: **Other**; diretório raiz `./`).
3. Em Project → Settings → Environment Variables, crie `FORM_TOKEN` com o segredo configurado no Apps Script. Use Environment: Production (e Preview, se necessário).
4. Deploy ou Redeploy; confira que `https://seu-site.vercel.app/api/lead` retorna erro 405 quando acessada diretamente por GET (normal).
5. Abra a página e teste os quatro CTAs com dados de teste. Confirme **4 e-mails** em `fabio.loliveira@totvs.com.br`, cada um com o nome da palestra correspondente.
6. Se falhar, verifique Vercel → Logs → Functions e Apps Script → Execuções. Não divulgue a chave em capturas de tela.

## Diagnóstico de falhas
- **503:** falta o `FORM_TOKEN` no ambiente da Vercel (ou redeploy).
- **502:** Apps Script não retornou JSON `{ok:true}`; conferir se o script implantado é a versão do código com `doPost`, e se o token corresponde.
- **Google retorna login/HTML:** na implantação do Apps Script, use "Executar como: Eu" e "Quem pode acessar: Qualquer pessoa"; publique uma **nova versão** após editar o código.
- **Formulários sem envio:** confirme que o deploy inclui a pasta `api/` na raiz (deploy estático apenas não executa a função).

## Segurança e produção
- A Vercel preserva o token no servidor; NÃO o coloque no navegador. A página envia somente os dados do visitante, o identificador da palestra e consentimento.
- O endpoint é público: implemente rate limiting / CAPTCHA na Vercel antes de divulgação em escala. O honeypot atual é apenas uma proteção básica.
- Criar/linkar política de privacidade apropriada à TOTVS Paulista antes da divulgação, com validação jurídica.
- A marca no cabeçalho ainda é tipográfica/provisória; substituir por logos oficiais quando disponíveis.
- O envio completo formulário → Vercel → Apps Script → Gmail **ainda não foi testado ao vivo**. O teste anterior confirmou apenas Apps Script → Gmail.

## Arquivos
- `index.html` — hotsite com foto oficial e os quatro formulários.
- `assets/` — fotos do evento.
- `api/lead.js` — função Vercel que valida e envia ao Apps Script.
- `tests/lead.test.js` — testes simulados: `npm test`.
- `AGENTE-FUTURO.md` — planejamento do agente de pós-evento.
