# SPECS - Catálogo Júlio Informática

Especificação do que o catálogo faz e do que ainda falta. Regra de trabalho: **escrever aqui antes de implementar**.

## 1. Objetivo
Página pública, bonita e simples, para o link da bio do Instagram. O cliente vê o que a loja tem,
vê se está disponível e chama no WhatsApp. Sem preço.

## 2. Já implementado (v1)
- [x] Topo com tijolos, logo com glitch curto e frase da loja
- [x] "Como funciona" em 3 passos
- [x] Busca sem acento, categorias, chip "Novidades", "só disponíveis", ordenação
- [x] Cards com status Disponível / Indisponível no momento, etiquetas Novo e Usado
- [x] Janela de detalhes com especificações, fotos, compartilhar (link por produto: `#id`)
- [x] Botão de WhatsApp por produto com o nome do produto na mensagem
  (indisponível: botão "Avisar quando chegar" com outra mensagem)
- [x] Lista de interesse (salva no navegador do cliente) enviada numa única mensagem de WhatsApp
- [x] Serviços com botão de orçamento
- [x] Rodapé com tijolos, data de atualização do estoque
- [x] Botão flutuante de WhatsApp (celular) e botão de voltar ao topo
- [x] Dados estruturados (schema.org) para o Google, ícone da aba, imagem de prévia, página 404
- [x] Funciona abrindo o arquivo direto e no GitHub Pages

## 3. Pendências do dono (sem código)
- [x] Trocar o número de WhatsApp em `js/config.js`
- [x] Preencher instagram e cidade em `js/config.js` (horário: opcional, ainda vazio)
- [ ] Cadastrar de 10 a 20 produtos reais (agora pelo sistema de gestão, botão "Mandar para o catálogo")
- [x] Publicar no GitHub Pages: https://julioinformaticagvt.github.io/catalogo/
- [x] Depois de publicar, trocar `img/og.jpg` no `index.html` pelo endereço completo da imagem
  (WhatsApp e Instagram pedem o endereço completo para mostrar a prévia)
- [ ] Colocar o link na bio do Instagram, no Google Meu Negócio e no WhatsApp Business

## 4. Próximos passos (a implementar)

> **Feito (4.1 e 4.2):** implementado no sistema de gestão, versão 0.17.0 (botão "Mandar para o catálogo",
> envio automático ao GitHub). O sistema grava só `dados/produtos.js` e `img/produtos/`.

### 4.1 Botão "Publicar catálogo" no sistema de gestão  (prioridade alta)
No **sistema de gestão** (outro projeto), em Configurações:
1. No cadastro do produto, campos novos: "Mostrar no catálogo", descrição, categoria, marca,
   especificações (nome/valor), foto (nome do arquivo), "destaque", "novo", "condição".
2. Botão **Publicar catálogo** que gera o arquivo `produtos.js` no formato abaixo.
3. `disponivel = true` se o estoque do produto for maior que zero, senão `false`.
4. **Não exportar preço, custo, quantidade nem dados de cliente.**
5. `CATALOGO_ATUALIZADO` recebe a data de hoje (`AAAA-MM-DD`).
6. O arquivo é baixado e o dono o envia ao repositório do catálogo (manual, no começo).

Formato do arquivo (igual ao de `dados/produtos.js`):
```js
window.CATALOGO_ATUALIZADO = "2026-10-19";
window.CATALOGO_PRODUTOS = [
  { id: "p-0001", nome: "...", marca: "...", categoria: "...", descricao: "...",
    especificacoes: [["Memória","8 GB"]], imagens: ["img/p-0001.jpg"],
    disponivel: true, destaque: false, novo: false, condicao: "" }
];
```
O `id` deve ser o ID interno do produto no sistema (o sistema já terá IDs em todos os registros).

Critérios de aceite:
- Produto com estoque 0 aparece como "Indisponível no momento".
- Produto não marcado para o catálogo não aparece.
- O arquivo gerado abre no catálogo sem erro no console.

### 4.2 Envio automático para o GitHub  (depois)
Só avaliar depois do 4.1 funcionar. Exige uma chave de acesso do GitHub. **Nunca** deixar a chave no
código de um site público; guardar só no computador do dono.

### 4.3 Status "Sob encomenda"  (prioridade média)
Terceiro estado além de disponível/indisponível. Campo `status: "disponivel" | "indisponivel" | "encomenda"`
(mantendo compatibilidade com `disponivel`).

### 4.4 Melhorias futuras (avaliar)
- Contador de cliques no WhatsApp com ferramenta gratuita e que respeite a privacidade, para saber
  quais produtos despertam mais interesse
- Depoimentos reais de clientes, com autorização
- Edição dos produtos por planilha do Google (para editar pelo celular)
- Domínio próprio (ex.: julioinformatica.com.br). Deixar para depois

## 5. Fora do escopo
- Preço, carrinho, pagamento e login de cliente
- Editar produtos pela própria página do catálogo
- Misturar com o sistema de gestão financeira
