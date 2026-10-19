# CLAUDE.md - Catálogo Júlio Informática

Leia este arquivo e o `SPECS.md` antes de mexer no projeto.

## O que é
Catálogo online público da loja Júlio Informática (peças e periféricos, foco em PC gamer).
O link vai na bio do Instagram. O cliente vê os produtos, vê se tem em estoque e chama o dono
no WhatsApp com a mensagem pronta. **Não mostra preço, de propósito** (os preços mudam todo dia).

## Quem é o usuário
O dono da loja. Está aprendendo a programar e **não tem experiência com HTML, CSS e JavaScript**.
- Responda sempre em **português**.
- Depois de cada mudança com código, explique em linguagem simples, para iniciante, o que mudou e por quê.
- Diga quais arquivos foram alterados.
- Não substitua arquivos inteiros sem necessidade: edite só o que precisa.

## Tecnologia
HTML, CSS e JavaScript puros. Sem framework, sem build, sem npm.
Abre dando dois cliques em `index.html` (também funciona publicado no GitHub Pages).
Por isso os produtos ficam em `dados/produtos.js` (um arquivo JS) e **não** em JSON carregado por `fetch`,
que não funciona abrindo o arquivo direto.

## Estrutura
- `index.html` - estrutura da página
- `css/style.css` - visual. Cores e fontes no bloco `:root` no começo
- `js/config.js` - dados da loja, textos e mensagens do WhatsApp (o dono edita aqui)
- `js/app.js` - lógica (busca, filtros, lista de interesse, janelas)
- `dados/produtos.js` - lista de produtos (hoje são exemplos)
- `img/` - logo, tijolos, ícones, imagem de prévia e fotos dos produtos
- `404.html` - página de erro do GitHub Pages

## Identidade visual (não mudar sem o dono pedir)
- Fundo preto com parede de tijolos (`img/tijolos.jpg`), igual ao banner do Instagram.
- Logo com glitch: ciano `#00f5ff`, magenta `#ff1fe8`, e a mira vermelha. Cores no `:root`.
- Fonte dos títulos: Chakra Petch. Texto: Inter.
- O efeito glitch é **só** na logo do topo (curto, a cada 8 s) e nas sombras de hover. Não espalhar.
- **Acessibilidade:** respeitar `prefers-reduced-motion` e nunca passar de 3 flashes por segundo (WCAG 2.3.1).
- Fotos de produto entram sobre fundo claro (`--photo-bg`), pensando em imagens de fundo branco.

## Regras importantes
1. **Nada sigiloso nos arquivos.** O código do site é público. Nunca colocar preço, custo, quantidade
   em estoque, dados de cliente, senha ou chave de acesso. O catálogo só tem nome, foto, descrição e
   `disponivel: true/false`.
2. O número de WhatsApp de exemplo (`5548900000000`) deve ser trocado pelo número real em `js/config.js`.
3. Só o dono altera o catálogo (quem tem acesso ao repositório). A página não tem nenhuma função de editar.
4. Este projeto é **separado** do sistema de gestão financeira. Não misturar código nem repositório.
5. Usar sempre `esc()` ao colocar texto de produto no HTML (evita quebrar a página).

## Como testar
Abrir `index.html` no navegador. Conferir no computador e no celular (largura 390 px):
busca, categorias, "só disponíveis", janela do produto, lista de interesse e botões do WhatsApp.

## Git
Commits pequenos e com mensagem em português descrevendo o que mudou.
