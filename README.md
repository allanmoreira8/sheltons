# Shelton's Solutions & 3D Art — site institucional

Página web estática (HTML, CSS e JavaScript puros) para divulgar os serviços de
impressão 3D da Shelton's: utilidades domésticas, peças de reposição, protótipos
e componentes industriais.

Não usa framework, não precisa de build e não depende de servidor: basta abrir o
`index.html` no navegador ou publicar os arquivos em qualquer hospedagem.

---

## 1. O que editar primeiro

### Telefone, e-mail e redes sociais
Tudo fica em **`assets/js/config.js`**. Troque os valores entre aspas:

```js
window.SHELTONS = {
  whatsapp: "5511999998888",        // 55 + DDD + número, só dígitos
  telefoneVisivel: "(11) 99999-8888",
  email: "contato@sheltons.com.br",
  instagram: "https://instagram.com/seu_perfil",
  cidade: "Campinas — SP",
  atendimento: "Seg. a sex., 8h às 18h · Sáb., 8h às 12h",
  mensagemPadrao: "Olá! Vim pelo site da Shelton's e gostaria de um orçamento."
};
```

O site usa esses dados em todos os botões de WhatsApp, no rodapé e na seção de
contato. Enquanto o número não for trocado, os botões apenas rolam a página até
o formulário (nenhum link quebrado aparece para o cliente).

### Textos
Abra o `index.html` em qualquer editor de texto. As seções estão marcadas com
comentários (`<!-- ================= SERVIÇOS ================= -->`), então é
fácil achar o trecho certo. Os blocos marcados com "Ajuste estes destaques"
existem para serem trocados pela realidade da oficina.

---

## 2. Publicar um trabalho no portfólio

1. Coloque a foto em `assets/img/portfolio/` (use JPG, proporção 4:3, algo em
   torno de 1000 × 750 px já é suficiente).
2. No `index.html`, copie um bloco `<article class="trabalho" ...>` inteiro,
   cole logo abaixo e troque:
   - `src` da imagem e o texto do `alt`;
   - o título (`<h3>`) e a descrição (`<p>`);
   - a categoria em **dois lugares**: `data-categoria` e o texto da `<span class="etiqueta">`.

Categorias disponíveis nos filtros:

| `data-categoria` | Etiqueta sugerida        |
|------------------|--------------------------|
| `domestico`      | Utilidades domésticas    |
| `industrial`     | Industrial               |
| `reposicao`      | Reposição                |
| `prototipo`      | Protótipos               |
| `personalizado`  | Personalizados           |

> As imagens que estão hoje em `assets/img/portfolio/` são **provisórias** —
> foram geradas só para o site não ficar com espaços vazios. Substitua pelas
> fotos reais das peças assim que possível: é o que mais convence quem chega
> pelo Google ou pelo Instagram. Dica: fotografe a peça sobre fundo liso, com
> luz natural, e inclua uma régua ou trena quando o tamanho importar.

Para criar novas imagens provisórias (caso precise de mais espaços), rode:

```bash
python3 tools/gerar-placeholders.py   # requer a biblioteca Pillow
```

---

## 3. Estrutura dos arquivos

```
index.html                      página única com todas as seções
assets/css/styles.css           estilos (cores da marca no topo do arquivo)
assets/js/config.js             ← dados de contato (edite este)
assets/js/main.js               menu, filtros, lightbox, formulário
assets/img/logo.png             logo completa (fundo claro)
assets/img/logo-mark.png        só os ícones (usado no rodapé escuro)
assets/img/favicon-*.png        ícone da aba do navegador
assets/img/og-image.jpg         imagem de pré-visualização ao compartilhar link
assets/img/portfolio/           fotos dos trabalhos
tools/gerar-placeholders.py     gerador das imagens provisórias
```

As cores da marca ficam nas variáveis do início do `styles.css`
(`--laranja`, `--verde`, `--carvao`), então dá para ajustar o visual inteiro
mexendo em poucas linhas.

---

## 4. Como o formulário funciona

O formulário de orçamento **não envia e-mail nem precisa de servidor**: ele monta
uma mensagem com os dados preenchidos e abre o WhatsApp já com o texto escrito,
para o cliente apenas conferir e enviar. Se o WhatsApp não estiver configurado,
ele usa o e-mail do `config.js` como alternativa.

---

## 5. Como colocar no ar

**Opção 1 — GitHub Pages (grátis):** no repositório, vá em
*Settings → Pages*, escolha a branch que contém estes arquivos e a pasta `/root`.
Em poucos minutos o site fica disponível em `https://<usuario>.github.io/sheltons/`.

**Opção 2 — hospedagem própria:** envie todos os arquivos por FTP para a pasta
pública do domínio. Não há nada para instalar.

Depois de publicar com domínio próprio, atualize a linha
`<link rel="canonical" href="...">` e a meta tag `og:image` no `index.html` com o
endereço real do site — isso melhora a aparência do link quando ele é
compartilhado no WhatsApp e nas redes.

---

## 6. Testar localmente

Abrir o `index.html` com dois cliques já funciona. Para simular um servidor:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```
