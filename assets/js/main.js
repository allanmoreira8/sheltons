/* =============================================================
   Shelton's Solutions & 3D Art — comportamento da página
   Nada aqui precisa ser editado no dia a dia: os dados de
   contato ficam em assets/js/config.js
   ============================================================= */
(function () {
  "use strict";

  var cfg = window.SHELTONS || {};

  /* ---------- 1. Dados de contato vindos do config ---------- */
  function linkWhatsApp(mensagem) {
    var numero = (cfg.whatsapp || "").replace(/\D/g, "");
    var texto = encodeURIComponent(mensagem || cfg.mensagemPadrao || "");
    // Enquanto o número do config.js não for trocado pelo número real,
    // os botões continuam levando para a seção de contato.
    if (numero.length < 12 || /^55?0+$/.test(numero)) return null;
    return "https://wa.me/" + numero + (texto ? "?text=" + texto : "");
  }

  function aplicarConfig() {
    var href = linkWhatsApp();

    if (href) {
      document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
        el.setAttribute("href", href);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      });
    }

    document.querySelectorAll('[data-campo="telefone"]').forEach(function (el) {
      if (cfg.telefoneVisivel) el.textContent = cfg.telefoneVisivel;
    });

    document.querySelectorAll('[data-campo="email"]').forEach(function (el) {
      if (!cfg.email) return;
      el.textContent = cfg.email;
      el.setAttribute("href", "mailto:" + cfg.email);
    });

    document.querySelectorAll('[data-campo="instagram"]').forEach(function (el) {
      if (!cfg.instagram) return;
      el.setAttribute("href", cfg.instagram);
      el.textContent = "@" + cfg.instagram.replace(/\/+$/, "").split("/").pop();
    });

    document.querySelectorAll('[data-campo="cidade"]').forEach(function (el) {
      if (cfg.cidade) el.textContent = cfg.cidade;
    });

    document.querySelectorAll('[data-campo="atendimento"]').forEach(function (el) {
      if (cfg.atendimento) el.textContent = cfg.atendimento;
    });

    var nota = document.getElementById("formularioNota");
    if (nota) {
      nota.textContent = href
        ? "O botão abre o WhatsApp com a sua mensagem já escrita. Você confere antes de enviar."
        : "O botão abre seu aplicativo de e-mail com a mensagem já escrita. Você confere antes de enviar.";
    }
  }

  /* ---------- 2. Menu mobile ---------- */
  function menu() {
    var botao = document.getElementById("menuBotao");
    var nav = document.getElementById("menuPrincipal");
    if (!botao || !nav) return;

    function fechar() {
      nav.classList.remove("navegacao--aberta");
      botao.setAttribute("aria-expanded", "false");
    }

    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("navegacao--aberta");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", fechar);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fechar();
    });
  }

  /* ---------- 3. Sombra do cabeçalho + link ativo ---------- */
  function navegacaoAtiva() {
    var cabecalho = document.querySelector(".cabecalho");
    var secoes = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var links = {};

    document.querySelectorAll('.navegacao__lista a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });

    function atualizar() {
      if (cabecalho) cabecalho.classList.toggle("cabecalho--rolado", window.scrollY > 10);

      var atual = null;
      var limite = window.scrollY + 140;
      secoes.forEach(function (s) {
        if (s.offsetTop <= limite) atual = s.id;
      });

      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle("ativo", id === atual);
      });
    }

    var agendado = false;
    window.addEventListener("scroll", function () {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(function () {
        atualizar();
        agendado = false;
      });
    }, { passive: true });

    atualizar();
  }

  /* ---------- 4. Animação de entrada ---------- */
  function revelar() {
    var alvos = document.querySelectorAll(".revelar");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("revelar--visivel"); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("revelar--visivel");
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- 5. Filtros do portfólio ---------- */
  function filtros() {
    var botoes = document.querySelectorAll(".filtro");
    var trabalhos = document.querySelectorAll(".trabalho");
    var vazio = document.getElementById("galeriaVazio");
    if (!botoes.length) return;

    botoes.forEach(function (botao) {
      botao.addEventListener("click", function () {
        var alvo = botao.dataset.filtro;
        var visiveis = 0;

        botoes.forEach(function (b) {
          var ativo = b === botao;
          b.classList.toggle("filtro--ativo", ativo);
          b.setAttribute("aria-pressed", ativo ? "true" : "false");
        });

        trabalhos.forEach(function (t) {
          var mostra = alvo === "todos" || t.dataset.categoria === alvo;
          t.hidden = !mostra;
          if (mostra) visiveis++;
        });

        if (vazio) vazio.hidden = visiveis !== 0;
      });
    });
  }

  /* ---------- 6. Lightbox do portfólio ---------- */
  function lightbox() {
    var caixa = document.getElementById("lightbox");
    var imagem = document.getElementById("lightboxImagem");
    var legenda = document.getElementById("lightboxLegenda");
    if (!caixa || !imagem) return;

    var botoes = Array.prototype.slice.call(document.querySelectorAll(".trabalho__abrir"));
    var indice = 0;
    var ultimoFoco = null;

    function visiveis() {
      return botoes.filter(function (b) { return !b.closest(".trabalho").hidden; });
    }

    function mostrar(i) {
      var lista = visiveis();
      if (!lista.length) return;
      indice = (i + lista.length) % lista.length;
      var botao = lista[indice];
      var img = botao.querySelector("img");
      var titulo = botao.closest(".trabalho").querySelector("h3");
      imagem.src = img.src;
      imagem.alt = img.alt;
      legenda.textContent = titulo ? titulo.textContent : "";
    }

    function abrir(botao) {
      ultimoFoco = botao;
      caixa.hidden = false;
      document.body.style.overflow = "hidden";
      mostrar(visiveis().indexOf(botao));
      document.getElementById("lightboxFechar").focus();
    }

    function fechar() {
      caixa.hidden = true;
      document.body.style.overflow = "";
      if (ultimoFoco) ultimoFoco.focus();
    }

    botoes.forEach(function (botao) {
      botao.addEventListener("click", function () { abrir(botao); });
    });

    document.getElementById("lightboxFechar").addEventListener("click", fechar);
    document.getElementById("lightboxAnterior").addEventListener("click", function () { mostrar(indice - 1); });
    document.getElementById("lightboxProxima").addEventListener("click", function () { mostrar(indice + 1); });

    caixa.addEventListener("click", function (e) {
      if (e.target === caixa) fechar();
    });

    document.addEventListener("keydown", function (e) {
      if (caixa.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") mostrar(indice - 1);
      if (e.key === "ArrowRight") mostrar(indice + 1);
    });
  }

  /* ---------- 7. Formulário → WhatsApp ---------- */
  function formulario() {
    var form = document.getElementById("formularioContato");
    if (!form) return;

    function limparErro(campo) {
      var grupo = campo.closest(".campo");
      if (!grupo) return;
      grupo.classList.remove("campo--erro");
      var aviso = grupo.querySelector(".campo__erro");
      if (aviso) aviso.remove();
    }

    function marcarErro(campo, texto) {
      var grupo = campo.closest(".campo");
      if (!grupo || grupo.querySelector(".campo__erro")) return;
      grupo.classList.add("campo--erro");
      var aviso = document.createElement("span");
      aviso.className = "campo__erro";
      aviso.textContent = texto;
      grupo.appendChild(aviso);
    }

    form.querySelectorAll("input, textarea").forEach(function (campo) {
      campo.addEventListener("input", function () { limparErro(campo); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = form.nome;
      var detalhes = form.detalhes;
      var valido = true;

      [nome, detalhes].forEach(function (campo) {
        limparErro(campo);
        if (!campo.value.trim()) {
          marcarErro(campo, "Preencha este campo para enviarmos o orçamento.");
          valido = false;
        }
      });

      if (!valido) {
        form.querySelector(".campo--erro input, .campo--erro textarea").focus();
        return;
      }

      var dadosPeca =
        "Nome: " + nome.value.trim() + "\n" +
        "Tipo de peça: " + form.tipo.value + "\n" +
        "Quantidade: " + (form.quantidade.value.trim() || "a definir") + "\n" +
        "Descrição: " + detalhes.value.trim();

      var href = linkWhatsApp("Olá! Vim pelo site da Shelton's e gostaria de um orçamento.\n\n" + dadosPeca);
      var mensagem = href ? null : dadosPeca;

      if (href) {
        window.open(href, "_blank", "noopener");
      } else if (cfg.email) {
        window.location.href =
          "mailto:" + cfg.email +
          "?subject=" + encodeURIComponent("Pedido de orçamento pelo site — " + nome.value.trim()) +
          "&body=" + encodeURIComponent(mensagem);
      }
    });
  }

  /* ---------- 8. Ano do rodapé ---------- */
  function ano() {
    var el = document.getElementById("ano");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    aplicarConfig();
    menu();
    navegacaoAtiva();
    revelar();
    filtros();
    lightbox();
    formulario();
    ano();
  });
})();
