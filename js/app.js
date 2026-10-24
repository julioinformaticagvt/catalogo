/* ============================================================
   LÓGICA DO CATÁLOGO
   Lê js/config.js e dados/produtos.js e monta a página.
   Em geral você NÃO precisa mexer neste arquivo.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CATALOGO_CONFIG || {};
  var PRODUTOS = (window.CATALOGO_PRODUTOS || []).filter(function (p) { return p && p.id && p.nome; });
  var CHAVE_LISTA = "ji_lista_v1";
  var NOVIDADES = "novidades"; // valor do filtro "Novidades"

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  // Protege contra texto com < > & " no nome dos produtos
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Tira acento e deixa minúsculo (para a busca achar "memoria" e "memória")
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function achar(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i];
    return null;
  }

  var numeroExemplo = !CFG.whatsapp || /^55\d{2}900000000$/.test(CFG.whatsapp);
  if (numeroExemplo) console.warn("Catálogo: troque o número do WhatsApp em js/config.js");

  /* ---------------- WhatsApp ---------------- */
  function waLink(msg) {
    return "https://wa.me/" + String(CFG.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
  }
  // Serviços (formatação, limpeza...) que o sistema manda junto com os produtos, na categoria "Serviços"
  function eServico(p) { return p.categoria === "Serviços"; }
  function msgProduto(p) {
    if (eServico(p)) {
      return String(CFG.mensagemServico || "Olá! Gostaria de um orçamento: {servico}").replace("{servico}", function () { return p.nome; });
    }
    var modelo = p.disponivel ? CFG.mensagemProduto : CFG.mensagemIndisponivel;
    return String(modelo || "Olá! Tenho interesse em: {produto}").replace("{produto}", function () { return p.nome; });
  }
  function rotuloBotao(p) {
    if (eServico(p)) return "Pedir orçamento";
    return p.disponivel ? "Chamar no WhatsApp" : "Avisar quando chegar";
  }
  // Selo do card e da janela: "Serviço", "Disponível" ou "Indisponível no momento"
  function selo(p) { return eServico(p) ? "Serviço" : p.disponivel ? "Disponível" : "Indisponível no momento"; }
  function corSelo(p) { return eServico(p) ? "svc" : p.disponivel ? "ok" : "off"; }

  /* ---------------- Imagens ---------------- */
  var PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/>' +
    '<g id="c" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
    '<g transform="translate(-5 0)" stroke="#19e9f5"><rect x="160" y="100" width="80" height="80" rx="10"/><path d="M180 100V80M200 100V80M220 100V80M180 180v20M200 180v20M220 180v20M160 120h-20M160 140h-20M160 160h-20M240 120h20M240 140h20M240 160h20"/></g>' +
    '<g transform="translate(5 0)" stroke="#ff4be8"><rect x="160" y="100" width="80" height="80" rx="10"/><path d="M180 100V80M200 100V80M220 100V80M180 180v20M200 180v20M220 180v20M160 120h-20M160 140h-20M160 160h-20M240 120h20M240 140h20M240 160h20"/></g>' +
    '<g stroke="#b4bac6"><rect x="160" y="100" width="80" height="80" rx="10"/><path d="M180 100V80M200 100V80M220 100V80M180 180v20M200 180v20M220 180v20M160 120h-20M160 140h-20M160 160h-20M240 120h20M240 140h20M240 160h20"/></g></g>' +
    '<text x="200" y="244" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#8b93a3">Foto em breve</text></svg>'
  );
  function imagensDe(p) {
    var lista = Array.isArray(p.imagens) ? p.imagens.slice() : (p.imagem ? [p.imagem] : []);
    return lista.length ? lista : [PLACEHOLDER];
  }
  // Se a foto não existir, mostra o desenho "Foto em breve"
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.src !== PLACEHOLDER && !t.hasAttribute("data-no-fallback")) {
      t.src = PLACEHOLDER;
    }
  }, true);

  /* ---------------- Estado ---------------- */
  var estado = { q: "", cat: "", soDisp: false, ordem: "destaque" };

  function lerURL() {
    var u = new URLSearchParams(location.search);
    estado.q = u.get("q") || "";
    estado.cat = u.get("cat") || "";
  }
  function gravarURL() {
    var u = new URLSearchParams();
    if (estado.q) u.set("q", estado.q);
    if (estado.cat) u.set("cat", estado.cat);
    var qs = u.toString();
    try {
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    } catch (e) { /* abrindo como arquivo, sem problema */ }
  }

  /* ---------------- Lista de interesse ---------------- */
  var lista = [];
  function lerLista() {
    try {
      var v = JSON.parse(localStorage.getItem(CHAVE_LISTA) || "[]");
      if (Array.isArray(v)) lista = v.filter(function (id) { return achar(id); });
    } catch (e) { lista = []; }
  }
  function salvarLista() {
    try { localStorage.setItem(CHAVE_LISTA, JSON.stringify(lista)); } catch (e) {}
  }
  function naLista(id) { return lista.indexOf(id) >= 0; }

  function alternar(id) {
    var i = lista.indexOf(id);
    if (i >= 0) { lista.splice(i, 1); aviso("Removido da lista"); }
    else { lista.push(id); aviso("Adicionado à lista"); }
    salvarLista();
    atualizarLista();
  }

  function msgLista() {
    var linhas = lista.map(achar).filter(Boolean).map(function (p, i) {
      return (i + 1) + ". " + p.nome + (p.disponivel ? "" : " (indisponível no momento)");
    });
    return (CFG.mensagemLista || "Tenho interesse nestes produtos:") + "\n\n" + linhas.join("\n") +
      (CFG.mensagemListaFim ? "\n\n" + CFG.mensagemListaFim : "");
  }

  // Atualiza tudo que depende da lista (barra, botões "+", janela da lista)
  function atualizarLista() {
    var n = lista.length;
    document.body.classList.toggle("tem-lista", n > 0);
    $("#lista-bar").hidden = n === 0;
    $("#lista-num").textContent = n;
    document.querySelectorAll("[data-lista]").forEach(function (b) {
      var id = b.getAttribute("data-lista") || (b.closest("[data-id]") || {}).getAttribute && b.closest("[data-id]").getAttribute("data-id");
      var marcado = naLista(id);
      b.setAttribute("aria-pressed", String(marcado));
      if (b.classList.contains("btn")) {
        b.classList.toggle("on", marcado);
        var t = b.querySelector("span");
        if (t) t.textContent = marcado ? "Na sua lista" : "Adicionar à lista";
      }
    });
    if (dlgLista.open) desenharLista();
  }

  var dlgLista = $("#lista-dlg");
  function abrirLista() { desenharLista(); if (!dlgLista.open) dlgLista.showModal(); }
  function desenharLista() {
    var itens = lista.map(achar).filter(Boolean);
    var html = '<button type="button" class="m-close" data-fechar aria-label="Fechar">&times;</button>' +
      '<h2 id="l-titulo">Sua lista de interesse</h2>';
    if (!itens.length) {
      html += "<p>Sua lista está vazia. Toque no + de um produto para adicionar.</p>";
    } else {
      html += "<p>Envie tudo de uma vez no WhatsApp. O valor e o parcelamento a gente passa na conversa.</p>" +
        '<ul class="l-lista">' + itens.map(function (p) {
          return '<li><span class="nome">' + esc(p.nome) +
            '<span class="st">' + selo(p) + "</span></span>" +
            '<button type="button" data-remover="' + esc(p.id) + '" aria-label="Remover ' + esc(p.nome) + ' da lista">&times;</button></li>';
        }).join("") + "</ul>" +
        '<div class="l-actions">' +
        '<a class="btn primary" href="' + waLink(msgLista()) + '" target="_blank" rel="noopener">' + ICONE_WA + "<span>Enviar lista no WhatsApp</span></a>" +
        '<button type="button" class="btn ghost" data-limpar>Limpar lista</button></div>';
    }
    $("#lista-conteudo").innerHTML = html;
  }
  dlgLista.addEventListener("click", function (e) {
    if (e.target === dlgLista || e.target.closest("[data-fechar]")) { dlgLista.close(); return; }
    var r = e.target.closest("[data-remover]");
    if (r) { alternar(r.getAttribute("data-remover")); return; }
    if (e.target.closest("[data-limpar]")) { lista = []; salvarLista(); atualizarLista(); }
  });

  /* ---------------- Categorias ---------------- */
  function categorias() {
    var cont = {};
    PRODUTOS.forEach(function (p) { if (p.categoria) cont[p.categoria] = (cont[p.categoria] || 0) + 1; });
    var ordem = (CFG.categorias || []).filter(function (c) { return cont[c]; });
    Object.keys(cont).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); })
      .forEach(function (c) { if (ordem.indexOf(c) < 0) ordem.push(c); });
    return ordem.map(function (c) { return { nome: c, total: cont[c] }; });
  }

  function desenharChips() {
    var itens = [{ nome: "", rotulo: "Todos", total: PRODUTOS.length }];
    var novos = PRODUTOS.filter(function (p) { return p.novo; }).length;
    if (novos) itens.push({ nome: NOVIDADES, rotulo: "Novidades", total: novos });
    categorias().forEach(function (c) { itens.push({ nome: c.nome, rotulo: c.nome, total: c.total }); });
    $("#chips").innerHTML = itens.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + esc(c.nome) + '" aria-pressed="' + (estado.cat === c.nome) + '">' +
        esc(c.rotulo) + " <small>" + c.total + "</small></button>";
    }).join("");
  }
  function marcarChips() {
    document.querySelectorAll(".chip").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === estado.cat));
    });
  }

  /* ---------------- Filtro e ordem ---------------- */
  function filtrar() {
    var termos = norm(estado.q).split(/\s+/).filter(Boolean);
    var lista2 = PRODUTOS.filter(function (p) {
      if (estado.cat === NOVIDADES) { if (!p.novo) return false; }
      else if (estado.cat && p.categoria !== estado.cat) return false;
      if (estado.soDisp && !p.disponivel) return false;
      if (!termos.length) return true;
      var alvo = norm([p.nome, p.marca, p.categoria, p.descricao].join(" "));
      return termos.every(function (t) { return alvo.indexOf(t) >= 0; });
    });
    var porNome = function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); };
    if (estado.ordem === "az") {
      lista2.sort(porNome);
    } else if (estado.ordem === "disp") {
      lista2.sort(function (a, b) { return (!!b.disponivel - !!a.disponivel) || porNome(a, b); });
    } else {
      lista2.sort(function (a, b) {
        return (!!b.destaque - !!a.destaque) || (!!b.disponivel - !!a.disponivel) || porNome(a, b);
      });
    }
    return lista2;
  }

  /* ---------------- Cards ---------------- */
  // Logo do WhatsApp, usado em todos os botões de WhatsApp. "currentColor" = pega a cor do texto do botão
  // (escuro no botão ciano, branco nos botões escuros).
  var ICONE_WA = '<svg class="ico wa" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';
  var ICONE_LUPA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
  var ICONE_ADD ='<svg class="i-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>' +
    '<svg class="i-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

  function etiquetas(p) {
    var t = "";
    if (p.novo) t += '<span class="tag">Novo</span>';
    if (p.condicao) t += '<span class="tag alt">' + esc(p.condicao) + "</span>";
    return t ? '<span class="tags">' + t + "</span>" : "";
  }

  function cardHTML(p) {
    var disp = !!p.disponivel;
    return '<article class="card' + (disp ? "" : " off") + '" data-id="' + esc(p.id) + '">' +
      '<div class="card-media">' +
        '<button type="button" class="card-open" data-abrir aria-label="Ver detalhes de ' + esc(p.nome) + '">' +
          '<img src="' + esc(imagensDe(p)[0]) + '" alt="" loading="lazy" decoding="async">' +
        "</button>" +
        '<span class="pill ' + corSelo(p) + '"><i></i>' + selo(p) + "</span>" +
        etiquetas(p) +
        '<button type="button" class="add" data-lista="' + esc(p.id) + '" aria-pressed="' + naLista(p.id) + '" aria-label="Adicionar à lista de interesse: ' + esc(p.nome) + '" title="Adicionar à lista">' + ICONE_ADD + "</button>" +
      "</div>" +
      '<div class="card-body">' +
        (p.marca ? '<p class="marca">' + esc(p.marca) + "</p>" : "") +
        '<h3><button type="button" data-abrir>' + esc(p.nome) + "</button></h3>" +
        (p.descricao ? '<p class="desc">' + esc(p.descricao) + "</p>" : "") +
        '<a class="btn ' + (disp ? "primary" : "ghost") + '" href="' + waLink(msgProduto(p)) + '" target="_blank" rel="noopener">' +
          ICONE_WA + "<span>" + rotuloBotao(p) + "</span></a>" +
      "</div></article>";
  }

  function desenhar() {
    var itens = filtrar();
    var vazio = $("#vazio");

    $("#grid").innerHTML = itens.map(cardHTML).join("");
    var n = itens.length;
    $("#contagem").textContent = n === 1 ? "1 produto" : n + " produtos";
    $("#busca-limpar").hidden = !estado.q;

    if (!PRODUTOS.length) {
      $("#vazio-titulo").textContent = "Catálogo em atualização";
      $("#vazio-texto").textContent = "Estamos preparando os produtos. Enquanto isso, fale com a gente no WhatsApp.";
      $("#vazio-wa").href = waLink(CFG.mensagemGeral || "Olá!");
      vazio.hidden = false;
      return;
    }
    if (n === 0) {
      $("#vazio-titulo").textContent = "Nenhum produto encontrado";
      $("#vazio-texto").textContent = "Tente outra palavra ou outra categoria. Se não achou, pergunte direto para a gente.";
      var termo = estado.q ? ' "' + estado.q + '"' : "";
      $("#vazio-wa").href = waLink("Olá! Procurei" + termo + " no catálogo e não encontrei. Vocês têm ou conseguem encomendar?");
      vazio.hidden = false;
    } else {
      vazio.hidden = true;
    }
  }

  /* ---------------- Janela do produto ---------------- */
  var modal = $("#modal");
  var produtoAberto = null;

  function abrirProduto(id, atualizarHash) {
    var p = achar(id);
    if (!p) return;
    produtoAberto = p;
    var disp = !!p.disponivel;
    var imgs = imagensDe(p);
    var marcado = naLista(p.id);

    var specs = (p.especificacoes || []).map(function (s) {
      return "<dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd>";
    }).join("");

    $("#modal-conteudo").innerHTML =
      '<button type="button" class="m-close" data-fechar aria-label="Fechar">&times;</button>' +
      '<div class="m-gal">' +
        (temFoto(p)
          ? '<button type="button" class="m-main" data-zoom aria-label="Ampliar foto"><img id="m-foto" src="' + esc(imgs[0]) + '" alt="' + esc(p.nome) + '">' +
            '<span class="m-lupa" aria-hidden="true">' + ICONE_LUPA + "Ampliar</span></button>"
          : '<div class="m-main"><img id="m-foto" src="' + esc(imgs[0]) + '" alt="' + esc(p.nome) + '"></div>') +
        (imgs.length > 1 ? '<div class="m-thumbs">' + imgs.map(function (src, i) {
          return '<button type="button" data-foto="' + esc(src) + '" aria-label="Foto ' + (i + 1) + '" aria-current="' + (i === 0) + '"><img src="' + esc(src) + '" alt=""></button>';
        }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="m-info">' +
        (p.marca ? '<p class="marca">' + esc(p.marca) + "</p>" : "") +
        '<h2 id="m-titulo">' + esc(p.nome) + "</h2>" +
        '<span class="m-status ' + corSelo(p) + '"><i></i>' + selo(p) + "</span>" +
        (p.descricao ? '<p class="m-desc">' + esc(p.descricao) + "</p>" : "") +
        (specs ? '<dl class="specs">' + specs + "</dl>" : "") +
        '<div class="m-actions">' +
          '<a class="btn ' + (disp ? "primary" : "ghost") + '" href="' + waLink(msgProduto(p)) + '" target="_blank" rel="noopener">' + ICONE_WA + "<span>" + rotuloBotao(p) + "</span></a>" +
          '<div class="row">' +
            '<button type="button" class="btn ghost' + (marcado ? " on" : "") + '" data-lista="' + esc(p.id) + '" aria-pressed="' + marcado + '"><span>' + (marcado ? "Na sua lista" : "Adicionar à lista") + "</span></button>" +
            '<button type="button" class="btn ghost" data-compartilhar>Compartilhar</button>' +
          "</div>" +
        "</div>" +
        '<p class="m-note">Preço e parcelamento: chame no WhatsApp.</p>' +
      "</div>";

    if (!modal.open) modal.showModal();
    if (atualizarHash !== false) {
      try { history.replaceState(null, "", location.pathname + location.search + "#" + id); } catch (e) {}
    }
  }

  function fecharProduto() { if (modal.open) modal.close(); }
  modal.addEventListener("close", function () {
    produtoAberto = null;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) return fecharProduto();                 // clique fora
    if (e.target.closest("[data-fechar]")) return fecharProduto();
    var thumb = e.target.closest("[data-foto]");
    if (thumb) {
      $("#m-foto").src = thumb.getAttribute("data-foto");
      modal.querySelectorAll("[data-foto]").forEach(function (b) { b.setAttribute("aria-current", String(b === thumb)); });
      return;
    }
    if (e.target.closest("[data-zoom]") && produtoAberto) {
      var fotos = imagensDe(produtoAberto);
      abrirZoom(fotos, Math.max(0, fotos.indexOf($("#m-foto").getAttribute("src"))));
      return;
    }
    var add = e.target.closest("[data-lista]");
    if (add) { alternar(add.getAttribute("data-lista")); return; }
    if (e.target.closest("[data-compartilhar]") && produtoAberto) compartilhar(produtoAberto);
  });

  /* ---------------- Foto ampliada (zoom) ----------------
     Toque/clique na foto: aproxima (2,5x) no ponto tocado. Toque de novo: afasta.
     Aproximada: no celular, arraste o dedo para passear; no computador, mova o mouse. */
  var ZOOM = 2.5;
  var zoomDlg = $("#zoom-dlg"), zoomImg = $("#zoom-img");
  var zoomFotos = [], zoomIdx = 0, zoomX = 50, zoomY = 50, toque = null;

  function temFoto(p) { return imagensDe(p)[0] !== PLACEHOLDER; }

  function abrirZoom(fotos, i) {
    zoomFotos = fotos;
    zoomDlg.classList.toggle("varias", fotos.length > 1);
    mostrarZoom(i);
    zoomDlg.showModal();
  }
  function mostrarZoom(i) {
    zoomIdx = (i + zoomFotos.length) % zoomFotos.length;
    zoomImg.src = zoomFotos[zoomIdx];
    zoomImg.alt = produtoAberto ? produtoAberto.nome + " - foto " + (zoomIdx + 1) : "";
    aproximar(false);
  }
  function aproximar(sim) {
    zoomDlg.classList.toggle("perto", sim);
    $("#zoom-dica").textContent = sim ? "Toque de novo para afastar" : "Toque na foto para aproximar";
  }
  function mirar(x, y) {   // x e y em % da tela (0 a 100)
    zoomX = Math.min(100, Math.max(0, x));
    zoomY = Math.min(100, Math.max(0, y));
    zoomImg.style.transformOrigin = zoomX + "% " + zoomY + "%";
  }
  function pontoNaTela(e) { return [e.clientX / innerWidth * 100, e.clientY / innerHeight * 100]; }

  zoomImg.addEventListener("pointerdown", function (e) {
    toque = { x: e.clientX, y: e.clientY, ox: zoomX, oy: zoomY, moveu: false };
    if (e.pointerType !== "mouse") zoomImg.setPointerCapture(e.pointerId);
  });
  zoomImg.addEventListener("pointermove", function (e) {
    if (!zoomDlg.classList.contains("perto")) return;
    if (e.pointerType === "mouse") { mirar.apply(null, pontoNaTela(e)); return; }
    if (!toque) return;
    var dx = e.clientX - toque.x, dy = e.clientY - toque.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) toque.moveu = true;
    var k = ZOOM / (ZOOM - 1);   // a foto acompanha o dedo
    mirar(toque.ox - dx / innerWidth * 100 * k, toque.oy - dy / innerHeight * 100 * k);
  });
  zoomImg.addEventListener("pointerup", function (e) {
    if (toque && !toque.moveu) {
      if (zoomDlg.classList.contains("perto")) aproximar(false);
      else { mirar.apply(null, pontoNaTela(e)); aproximar(true); }
    }
    toque = null;
  });
  zoomImg.addEventListener("pointercancel", function () { toque = null; });

  zoomDlg.addEventListener("click", function (e) {
    if (e.target.closest("[data-zfechar]")) { zoomDlg.close(); return; }
    var passo = e.target.closest("[data-zpasso]");
    if (passo) mostrarZoom(zoomIdx + Number(passo.getAttribute("data-zpasso")));
  });
  zoomDlg.addEventListener("keydown", function (e) {
    if (zoomFotos.length < 2) return;
    if (e.key === "ArrowLeft") mostrarZoom(zoomIdx - 1);
    if (e.key === "ArrowRight") mostrarZoom(zoomIdx + 1);
  });

  function compartilhar(p) {
    var url = location.protocol === "file:"
      ? location.href.split("#")[0] + "#" + p.id
      : location.origin + location.pathname + "#" + p.id;
    if (navigator.share) {
      navigator.share({ title: p.nome, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { aviso("Link copiado"); }, function () { aviso("Não foi possível copiar"); });
    } else {
      aviso("Copie o link na barra do navegador");
    }
  }

  var avisoTimer;
  function aviso(txt) {
    var t = $("#toast");
    t.textContent = txt; t.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }

  /* ---------------- Textos fixos da página ---------------- */
  function preencherTextos() {
    var nome = CFG.nomeLoja || "Loja";
    document.title = nome + " | Catálogo";

    if (CFG.titulo) $("#hero-titulo").textContent = CFG.titulo;
    $("#hero-sub").textContent = CFG.subtitulo || "";
    $("#aviso-preco").textContent = CFG.avisoPreco || "";

    var geral = waLink(CFG.mensagemGeral || "Olá!");
    ["#top-wa", "#hero-wa", "#fab"].forEach(function (s) { $(s).href = geral; });
    // Coloca o logo do WhatsApp nos botões que já vêm escritos no index.html
    ["#top-wa", "#hero-wa", "#vazio-wa", "#fab"].forEach(function (s) { $(s).insertAdjacentHTML("afterbegin", ICONE_WA); });

    var disponiveis = PRODUTOS.filter(function (p) { return p.disponivel && !eServico(p); }).length;
    $("#hero-note").textContent = PRODUTOS.length
      ? disponiveis + (disponiveis === 1 ? " produto disponível agora" : " produtos disponíveis agora")
      : "";

    if (CFG.passos && CFG.passos.length) {
      $("#passos-lista").innerHTML = CFG.passos.map(function (s, i) {
        return '<li><span class="n" aria-hidden="true">' + (i + 1) + "</span><div><strong>" + esc(s[0]) +
          '</strong><span class="t">' + esc(s[1]) + "</span></div></li>";
      }).join("");
      $("#passos-sec").hidden = false;
    }

    var info = [];
    if (CFG.cidade) info.push(esc(CFG.cidade));
    if (CFG.horario) info.push(esc(CFG.horario));
    if (CFG.instagram) {
      var ig = String(CFG.instagram).replace(/^@/, "");
      info.push('<a href="https://instagram.com/' + encodeURIComponent(ig) + '" target="_blank" rel="noopener">@' + esc(ig) + "</a>");
    }
    $("#foot-info").innerHTML = info.join(" &nbsp;|&nbsp; ");

    if (window.CATALOGO_ATUALIZADO) {
      var d = new Date(window.CATALOGO_ATUALIZADO + "T12:00:00");
      if (!isNaN(d)) $("#foot-upd").textContent = "Estoque atualizado em " + d.toLocaleDateString("pt-BR") + ".";
    }

    if (CFG.servicos && CFG.servicos.length) {
      $("#servicos-lista").innerHTML = CFG.servicos.map(function (s) {
        var msg = String(CFG.mensagemServico || "Olá! Gostaria de um orçamento: {servico}").replace("{servico}", s);
        return '<li><a href="' + waLink(msg) + '" target="_blank" rel="noopener">' + ICONE_WA + "<span>" + esc(s) + "</span></a></li>";
      }).join("");
      $("#servicos-sec").hidden = false;
    }

    dadosEstruturados(nome);
  }

  // Dados para o Google entender que é uma loja local (ajuda a aparecer em buscas)
  function dadosEstruturados(nome) {
    try {
      var o = { "@context": "https://schema.org", "@type": "ComputerStore", name: nome };
      if (location.protocol !== "file:") o.url = location.origin + location.pathname;
      if (!numeroExemplo) o.telephone = "+" + String(CFG.whatsapp).replace(/\D/g, "");
      if (CFG.cidade) o.address = { "@type": "PostalAddress", addressLocality: CFG.cidade };
      if (CFG.instagram) o.sameAs = ["https://instagram.com/" + String(CFG.instagram).replace(/^@/, "")];
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(o);
      document.head.appendChild(s);
    } catch (e) {}
  }

  /* ---------------- Eventos ---------------- */
  function ligarEventos() {
    var busca = $("#busca");
    var t;
    busca.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { estado.q = busca.value.trim(); gravarURL(); desenhar(); }, 80);
    });
    $("#busca-limpar").addEventListener("click", function () {
      busca.value = ""; estado.q = ""; gravarURL(); desenhar(); busca.focus();
    });
    $("#chips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      estado.cat = b.getAttribute("data-cat");
      marcarChips(); gravarURL(); desenhar();
    });
    $("#so-disp").addEventListener("change", function (e) { estado.soDisp = e.target.checked; desenhar(); });
    $("#ordem").addEventListener("change", function (e) { estado.ordem = e.target.value; desenhar(); });

    $("#grid").addEventListener("click", function (e) {
      var add = e.target.closest("[data-lista]");
      if (add) { alternar(add.getAttribute("data-lista")); return; }
      if (!e.target.closest("[data-abrir]")) return;
      var card = e.target.closest(".card");
      if (card) abrirProduto(card.getAttribute("data-id"));
    });

    $("#lista-bar").addEventListener("click", abrirLista);

    var topo = $("#topo");
    topo.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
    window.addEventListener("scroll", function () { topo.hidden = window.scrollY < 900; }, { passive: true });

    window.addEventListener("hashchange", function () {
      var id = decodeURIComponent(location.hash.slice(1));
      if (id) abrirProduto(id, false); else fecharProduto();
    });
  }

  /* ---------------- Início ---------------- */
  lerURL();
  lerLista();
  preencherTextos();
  $("#busca").value = estado.q;
  desenharChips();
  ligarEventos();
  desenhar();
  atualizarLista();
  if (location.hash.length > 1) abrirProduto(decodeURIComponent(location.hash.slice(1)), false);
})();
