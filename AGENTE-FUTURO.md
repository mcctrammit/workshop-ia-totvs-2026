# Blueprint — Futuro agente de pós-evento

Objetivo: transformar transcrições de um evento em um hotsite retrospectivo e campanha de follow-up, reproduzindo o fluxo deste projeto com revisão humana.

## Entradas esperadas
- Nome, data, organizador, agenda e palestrantes.
- Transcrições (uma por palestra), resumos opcionais e slides/fotos autorizados.
- Identidade visual, e-mail para alertas, conta RD Station, domínio e política de privacidade.

## Fluxo do agente
1. Receber e classificar materiais por palestra; sinalizar arquivos faltantes.
2. Extrair informações e exemplos da fala, com fonte e ressalvas para transcrições incertas.
3. Gerar título, resumo editorial, principais aprendizados, exemplos práticos e CTA contextualizado por palestra.
4. Sinalizar datas futuras, lançamentos e números que precisam de validação; jamais transformar previsões em garantias.
5. Gerar hotsite responsivo a partir de template consistente, com imagens autorizadas e espaço para a foto oficial.
6. Criar identificadores distintos de conversão no RD Station e e-mails de alerta; guardar chaves exclusivamente no backend.
7. Validar acessibilidade, responsividade, privacidade, erros e quatro caminhos de lead.
8. Submeter conteúdo/arte para aprovação humana antes de publicar e disparar comunicações.

## Regras
- Corrigir automaticamente erros recorrentes de reconhecimento, por exemplo TOTUS → TOTVS, mas validar nomes de produtos e pessoas.
- Nunca inventar dados, resultados, datas ou frases literais.
- Campos mínimos: nome, e-mail, celular, empresa, origem do interesse e consentimento.
- Publicação e disparos reais requerem credenciais e aprovação.

## Entregáveis
- Pacote GitHub/Vercel, resumo por palestra, galeria, CTA por palestra, matriz de eventos RD e checklist de implantação.
