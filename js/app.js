$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio(); // Inicie com a categoria 'burgers'
  },
};

cardapio.metodos = {
  // Obtem a lista de itens do cardapio
  obterItensCardapio: (categoria = 'burgers', vermais = false) => {
    var filtro = MENU[categoria];
    console.log(filtro);

    if (!vermais) {
      $('#itensCardapio').html('');
      $('#btnVerMais').removeClass('hidden');
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${id}/g, e.id);

      // botão ver mais foi clicado
      if (vermais && i >= 8 && i < 12) {
        $('#itensCardapio').append(temp);
      }
      //paginação inicial
      if (!vermais && i < 8) {
        $('#itensCardapio').append(temp);
      }
    });

    //remove o ativo
    $('.container-menu a').removeClass('active');

    //seta o menu ativo

    $('#menu-' + categoria).addClass('active');
  },

  //clique no botão ver mais
  verMais: () => {
    var ativo = $('.container-menu a.active').attr('id').split('menu-')[1]; //menu-burgers
    cardapio.metodos.obterItensCardapio(ativo, true);

    $('#btnVerMais').addClass('hidden');
  },
  //diminuir a quantiade do intem no cardapio
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());
    if (qntdAtual > 0) {
      $('#qntd-' + id).text(qntdAtual - 1);
    }
  },
  //aumentar a quantidade do intem no cardapio
  aumentarQuantidade: (id) => {
    var quantidade = $('#qntd-' + id).text();
    quantidade++;
    $('#qntd-' + id).text(quantidade);
  },

  // adicionar ao carrinho o item do cardapio
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());

    if (qntdAtual > 0) {
      //obter a categoria ativa
      var categoria = $('.container-menu a.active')
        .attr('id')
        .split('menu-')[1];

      //obter a lista de itens
      let filtro = MENU[categoria];

      // obtem o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        //validar se ja existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id;
        });

        //caso ja exista o item no carrinho, so altera a quantidade
        if (existe.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        //caso não exista o item no carrinho, adiciona ele
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }
        cardapio.metodos.mensagem('Item adicionado com sucesso', 'green');
        $('#qntd-' + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();
      }
    }
  },

  //atualiza o badge de totais dos botões "Meu carrinho"
  atualizarBadgeTotal: () => {
    var total = 0;

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd;
    });

    if (total > 0) {
      $('.botao-carrinho').removeClass('hidden');
      $('.container-total-carrinho').removeClass('hidden');
    } else {
      $('.botao-carrinho').addClass('hidden');
      $('.container-total-carrinho').addClass('hidden');
    }

    $('.badge-total-carrinho').html(total);
  },

  //abrir a modal carrinho
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $('#modalCarrinho').removeClass('hidden');
    } else {
      $('#modalCarrinho').addClass('hidden');
    }
  },

  //mensagens
  mensagem: (texto, cor = 'red', tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random()).toString();
    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $('#container-mensagens').append(msg);

    setTimeout(() => {
      $('#msg-' + id).removeClass('fadeInDown');
      $('#msg-' + id).addClass('fadeOutUp');
      setTimeout(() => {
        $('#msg-' + id).remove();
      }, 800);
    }, tempo);
  },
};

cardapio.templates = {
  item: `
<div class="col-3 mb-5">
  <div class="card card-item" id="\${id}">
    <div class="img-produto">
      <img src="\${img}" /> 
    </div>
    <p class="title-produto text-center mt-4">
      <b>\${name}</b>
    </p>
    <p class="price-produto text-center">
      <b>R$ \${price}</b>
    </p>
    <div class="add-carrinho">
      <button class="btn btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')">
        <i class="fas fa-minus"></i>
      </button>
      <span class="add-numero-itens" id="qntd-\${id}">0</span>
      <button class="btn btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')">
        <i class="fas fa-plus"></i>
      </button>
      <button class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
        <i class="fa fa-shopping-bag"></i>
      </button>
    </div>
  </div>
</div>
`,
};

$(document).ready(function () {
  cardapio.eventos.init();
});
