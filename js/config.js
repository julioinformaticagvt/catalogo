/* ============================================================
   CONFIGURAÇÕES DO CATÁLOGO
   Aqui você muda os dados da loja sem mexer no resto do código.
   Depois de editar, salve o arquivo e atualize a página (F5).
   ============================================================ */

window.CATALOGO_CONFIG = {
  // Nome da loja (usado em textos, no título da aba e no rodapé)
  nomeLoja: "Jul1o Informática",

  // IMPORTANTE: troque pelo seu número, só números, com 55 + DDD + número.
  // Exemplo: 5548999998888
  whatsapp: "5548991906456",

  // Opcionais: se deixar vazio "", a informação some da página.
  instagram: "@julioinformatica",   // só o nome do perfil, sem @. Ex.: "julioinformatica"
  cidade: "Gravatal - SC",      // Ex.: "Gravatal - SC"
  horario: "",     // Ex.: "Seg a Sex, 9h às 18h"

  // Frase logo abaixo da logo, no topo da página
  titulo: "Peças e periféricos para o seu PC",
  subtitulo:
    "Veja o que está em estoque e chame a gente no WhatsApp. O valor e o parcelamento a gente passa na conversa.",

  // Aviso sobre preço (aparece acima da lista de produtos)
  avisoPreco:
    "Os preços mudam todo dia, por isso não ficam aqui. Chame no WhatsApp para saber o valor e as formas de pagamento.",

  // "Como funciona" (3 passos logo abaixo do topo). Pode apagar para esconder.
  passos: [
    ["Escolha as peças", "Navegue pelo catálogo e marque o que te interessa."],
    ["Chame no WhatsApp", "Um toque e a conversa já abre com o produto na mensagem."],
    ["Receba o valor", "A gente passa o preço e as formas de parcelamento."]
  ],

  // Mensagens prontas do WhatsApp. {produto} vira o nome do produto clicado.
  mensagemGeral:
    "Olá! Vim pelo catálogo da Júlio Informática e gostaria de mais informações.",
  mensagemProduto:
    "Olá! Tenho interesse no produto: {produto}. Pode me passar mais informações?",
  mensagemIndisponivel:
    "Olá! Vi no catálogo que o produto {produto} está indisponível no momento. Vocês conseguem me avisar quando chegar ou encomendar?",
  mensagemServico:
    "Olá! Gostaria de um orçamento do serviço: {servico}.",
  // Lista de interesse: começo e fim da mensagem (os produtos entram no meio)
  mensagemLista: "Olá! Tenho interesse nestes produtos do catálogo:",
  mensagemListaFim: "Pode me passar os valores e as formas de pagamento?",

  // Serviços (faixa no final da página). Cada um vira um botão de orçamento.
  servicos: [
    "Limpeza de computador",
    "Troca de pasta térmica",
    "Formatação",
    "Backup e recuperação de dados",
    "Remoção de vírus",
    "Diagnóstico e orçamento"
  ],

  // Ordem das categorias nos botões de filtro.
  // Se deixar vazio [], elas aparecem em ordem alfabética.
  categorias: [
    "PC",
    "Placas de vídeo",
    "Processadores",
    "Placas-mãe",
    "Memória RAM",
    "SSD e HD",
    "Fontes",
    "Gabinetes",
    "Monitores",
    "Periféricos",
    "Console",
    "Acessórios"
  ]
};
