/* ============================================================
   PRODUTOS DO CATÁLOGO  (ARQUIVOS DE EXEMPLO — troque pelos seus)

   Cada produto tem:
     id           identificador único (ex.: "p-0001"). Não repita.
     nome         nome que aparece no card
     marca        opcional
     categoria    tem que ser igual a uma das categorias do config.js
     descricao    texto curto (1 ou 2 frases)
     especificacoes  lista de [nome, valor] (opcional)
     imagens      lista de fotos, ex.: imagens: ["img/p-0001.jpg"], (opcional;
                  sem foto, aparece o desenho "Foto em breve")
     disponivel   true = tem em estoque | false = indisponível no momento
     destaque     true = aparece primeiro na ordem "Em destaque"
     novo         true = mostra a etiqueta "Novo"
     condicao     opcional: "Usado", "Seminovo"... (mostra uma etiqueta)

   Sem preço, de propósito.
   No futuro, o sistema de gestão vai gerar este arquivo sozinho a
   partir do estoque (botão "Publicar catálogo").
   ============================================================ */

window.CATALOGO_ATUALIZADO = "2026-10-19";

window.CATALOGO_PRODUTOS = [
  {
    id: "p-0001",
    nome: "Placa de vídeo RTX 4060 8GB",
    marca: "NVIDIA",
    categoria: "Placas de vídeo",
    descricao: "Boa para jogar em Full HD com qualidade alta e frames estáveis.",
    especificacoes: [["Memória", "8 GB GDDR6"], ["Saídas", "HDMI e DisplayPort"], ["Uso", "Jogos em Full HD"]],
    disponivel: true,
    destaque: true
  },
  {
    id: "p-0002",
    nome: "Placa de vídeo RX 7600 8GB",
    marca: "AMD",
    categoria: "Placas de vídeo",
    descricao: "Custo-benefício para quem quer jogar em Full HD sem complicação.",
    especificacoes: [["Memória", "8 GB GDDR6"], ["Saídas", "HDMI e DisplayPort"]],
    disponivel: false
  },
  {
    id: "p-0003",
    nome: "Processador Ryzen 5 5600",
    marca: "AMD",
    categoria: "Processadores",
    descricao: "6 núcleos, ótimo para jogos e multitarefa. Acompanha cooler.",
    especificacoes: [["Núcleos / threads", "6 / 12"], ["Soquete", "AM4"], ["Cooler", "Incluso"]],
    disponivel: true,
    destaque: true
  },
  {
    id: "p-0004",
    nome: "Processador Core i5-12400F",
    marca: "Intel",
    categoria: "Processadores",
    descricao: "6 núcleos de alto desempenho. Precisa de placa de vídeo dedicada.",
    especificacoes: [["Núcleos / threads", "6 / 12"], ["Soquete", "LGA 1700"], ["Vídeo integrado", "Não"]],
    disponivel: true
  },
  {
    id: "p-0005",
    nome: "Placa-mãe B550M",
    marca: "Gigabyte",
    categoria: "Placas-mãe",
    descricao: "Formato micro-ATX para processadores Ryzen da linha AM4.",
    especificacoes: [["Soquete", "AM4"], ["Formato", "micro-ATX"], ["Memória", "DDR4"]],
    disponivel: true
  },
  {
    id: "p-0006",
    nome: "Memória RAM 16GB (2x8GB) DDR4 3200MHz",
    marca: "Kingston",
    categoria: "Memória RAM",
    descricao: "Kit dual channel para deixar o PC mais rápido em jogos e programas pesados.",
    especificacoes: [["Capacidade", "16 GB (2x8)"], ["Velocidade", "3200 MHz"], ["Tipo", "DDR4"]],
    disponivel: true,
    destaque: true
  },
  {
    id: "p-0007",
    nome: "SSD NVMe 500GB",
    marca: "Kingston",
    categoria: "SSD e HD",
    descricao: "Liga o Windows em segundos e abre jogos bem mais rápido que um HD.",
    especificacoes: [["Capacidade", "500 GB"], ["Interface", "NVMe M.2"]],
    disponivel: true,
    novo: true
  },
  {
    id: "p-0008",
    nome: "SSD SATA 480GB",
    marca: "Kingston",
    categoria: "SSD e HD",
    descricao: "A forma mais simples de dar vida nova a um PC ou notebook antigo.",
    especificacoes: [["Capacidade", "480 GB"], ["Interface", "SATA 2,5\""]],
    disponivel: false
  },
  {
    id: "p-0009",
    nome: "Fonte 600W 80 Plus",
    marca: "Corsair",
    categoria: "Fontes",
    descricao: "Fonte com certificação para PCs gamer de entrada e intermediários.",
    especificacoes: [["Potência", "600 W"], ["Certificação", "80 Plus"]],
    disponivel: true
  },
  {
    id: "p-0010",
    nome: "Gabinete gamer com vidro lateral",
    marca: "Redragon",
    categoria: "Gabinetes",
    descricao: "Bom fluxo de ar e espaço para montar com folga. Acompanha fans.",
    especificacoes: [["Formato", "ATX"], ["Lateral", "Vidro temperado"]],
    disponivel: true,
    novo: true
  },
  {
    id: "p-0011",
    nome: "Monitor 24\" 144Hz",
    marca: "Samsung",
    categoria: "Monitores",
    descricao: "Imagem fluida para jogar, com taxa de atualização de 144 Hz.",
    especificacoes: [["Tamanho", "24 polegadas"], ["Taxa", "144 Hz"], ["Resolução", "Full HD"]],
    disponivel: true
  },
  {
    id: "p-0012",
    nome: "Teclado mecânico ABNT2",
    marca: "Redragon",
    categoria: "Periféricos",
    descricao: "Teclado mecânico com iluminação, layout brasileiro com Ç.",
    especificacoes: [["Layout", "ABNT2"], ["Tipo", "Mecânico"]],
    disponivel: true
  },
  {
    id: "p-0013",
    nome: "Mouse gamer 12.400 DPI",
    marca: "Logitech",
    categoria: "Periféricos",
    descricao: "Sensor preciso, botões programáveis e pegada confortável.",
    especificacoes: [["Sensor", "Até 12.400 DPI"], ["Conexão", "Com fio"]],
    disponivel: false
  },
  {
    id: "p-0014",
    nome: "Placa de vídeo GTX 1650 4GB",
    marca: "NVIDIA",
    categoria: "Placas de vídeo",
    descricao: "Placa usada, revisada e testada. Boa para jogos leves e e-sports.",
    especificacoes: [["Memória", "4 GB GDDR5"], ["Condição", "Usada e testada"]],
    disponivel: true,
    condicao: "Usado"
  }
];
