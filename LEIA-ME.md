# Catálogo Júlio Informática

Catálogo online da loja: o cliente vê as peças, vê se tem em estoque e clica para te chamar no WhatsApp com a mensagem já pronta, citando o produto. **Não mostra preço**, de propósito.

## Como abrir para ver

Dê dois cliques no arquivo `index.html`. Abre no navegador, sem instalar nada.
(As fontes precisam de internet. Sem internet funciona igual, só com uma fonte padrão.)

## O que mudar primeiro

1. **Seu número do WhatsApp**: abra `js/config.js` e troque `whatsapp` pelo seu número, só números, com 55 + DDD. Exemplo: `5548999998888`. Enquanto estiver o número de exemplo, os botões não chamam você.
2. **Instagram, cidade e horário**: no mesmo arquivo, se quiser que apareçam no rodapé.
3. **Produtos**: em `dados/produtos.js`. Os que estão lá são **só exemplos**: apague e coloque os seus.
4. **Cores**: no começo do `css/style.css`, no bloco `:root`.

## Produtos e fotos

- `disponivel: true` mostra "Disponível". `disponivel: false` mostra "Indisponível no momento" e o botão vira "Avisar quando chegar".
- Fotos: salve na pasta `img/` e escreva no produto `imagens: ["img/p-0001.jpg"]`. Sem foto, aparece o desenho "Foto em breve".
- Dica: use imagens de **fundo branco**, todas na mesma proporção (4x3, horizontal). Prefira as imagens oficiais do fabricante ou fotos suas. Evite copiar de lojas grandes.

## A identidade da marca

- A logo, os tijolos e as cores (ciano, magenta e a mira vermelha) vêm da sua logo.
- O glitch aparece só na logo do topo, numa tremida curta a cada 8 segundos, e nas bordas dos cards quando o mouse passa por cima. Quem usa o celular ou computador com "reduzir movimento" ligado não vê a tremida.
- Arquivos da marca em `img/`: `logo.png`, `tijolos.jpg`, `og.jpg` (prévia ao compartilhar), `favicon.png`, `apple-touch-icon.png`, `icone-512.png`.

## O que o catálogo faz

- Busca (acha "memoria" mesmo sem acento), categorias, "Novidades", "só disponíveis" e ordenação
- Janela com detalhes do produto, com botão de compartilhar (cada produto tem link próprio)
- Botão do WhatsApp em cada produto, com o nome dele na mensagem
- **Lista de interesse**: o cliente toca no + dos produtos e envia a lista toda numa mensagem
- Serviços com botão de orçamento
- Se a busca não acha nada, o cliente pode perguntar direto no WhatsApp
- Funciona bem no celular

## Quem pode mexer no catálogo

Só quem tem acesso ao repositório do GitHub (você). A página não tem nenhuma função de cadastrar ou editar: quem entra pelo link só vê. Por isso:
- proteja sua conta do GitHub com senha forte e verificação em dois passos;
- **nunca coloque preço, custo, quantidade ou dados de cliente** nos arquivos, porque o código de um site é sempre legível por quem quiser olhar.

## Colocar no ar (link para a bio)

1. Crie um repositório novo e separado, por exemplo `catalogo`.
2. Envie todos os arquivos desta pasta.
3. Em Settings > Pages, escolha a branch `main` e a pasta `/ (root)`.
4. O GitHub mostra o link do site. Esse link vai na bio do Instagram.
5. Depois de publicar, abra o `index.html` e troque `img/og.jpg` (no `og:image`) pelo endereço completo da imagem, por exemplo `https://seulink/img/og.jpg`. Assim o WhatsApp e o Instagram mostram a prévia com a sua logo.

## Para continuar o trabalho

Veja o `SPECS.md` (o que já foi feito e o que falta) e o `CLAUDE.md` (regras para o Code).
