$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;
var CELULAR_EMPRESA = `5531985789844`;

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio(); // Inicie com a categoria 'burgers'
    cardapio.metodos.carregarBotãoLigar();
    cardapio.metodos.carregarBotãoReserva();
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
      cardapio.metodos.carregarCarrinho();
    } else {
      $('#modalCarrinho').addClass('hidden');
    }
  },

  //altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {
    if (etapa == 1) {
      $('#lblTituloEtapa').text('Seu carrinho:');
      $('#itensCarrinho').removeClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');

      $('#btnEtapaPedido').removeClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnEtapaVoltar').addClass('hidden');
    }

    if (etapa == 2) {
      $('#lblTituloEtapa').text('Endereço de entrega:');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').removeClass('hidden');
      $('#resumoCarrinho').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').removeClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnEtapaVoltar').removeClass('hidden');
    }

    if (etapa == 3) {
      $('#lblTituloEtapa').text('Endereço do pedido:');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').removeClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');
      $('.etapa3').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaResumo').removeClass('hidden');
      $('#btnEtapaVoltar').removeClass('hidden');
    }
  },

  // botão de voltar etapa
  voltarEtapa: () => {
    let etapa = $('.etapa.active').length;
    cardapio.metodos.carregarEtapa(etapa - 1);
  },

  // carrega a lista de itens do carrinho
  carregarCarrinho: () => {
    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {
      $('#itensCarrinho').html('');

      $.each(MEU_CARRINHO, (i, e) => {
        let temp = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img)
          .replace(/\${name}/g, e.name)
          .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
          .replace(/\${id}/g, e.id)
          .replace(/\${qntd}/g, e.qntd);

        $('#itensCarrinho').append(temp);

        // Verifica se é o último item
        if (i + 1 === MEU_CARRINHO.length) {
          cardapio.metodos.carregarValores();
        }
      });
    } else {
      $('#itensCarrinho').html(
        '<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>',
      );
      cardapio.metodos.carregarValores();
    }
  },

  //diminuir a quantidade do item no carrinho
  diminuirQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-carrinho' + id).text());

    if (qntdAtual > 1) {
      // Atualiza a quantidade exibida no carrinho
      $('#qntd-carrinho' + id).text(qntdAtual - 1);
      // Atualiza a quantidade no carrinho
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1); // Aqui estava o erro
    } else {
      cardapio.metodos.removerItemCarrinho(id);
    }
  },

  //aumentar a quantidade do item no carrinho
  aumentarQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-carrinho' + id).text());
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1); // Atualiza a quantidade no carrinho primeiro
    $('#qntd-carrinho' + id).text(qntdAtual + 1); // Atualiza a quantidade exibida no elemento HTML
  },
  //botão remover item do carrinho
  removerItemCarrinho: (id) => {
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {
      return e.id != id;
    });
    cardapio.metodos.carregarCarrinho(); // Corrigido para chamar a função através de cardapio.metodos

    // Atualiza o botão carrinho com a quantidade atualizada
    cardapio.metodos.atualizarBadgeTotal();
  },

  //atualiza o carrinho com a quantidade atual
  atualizarCarrinho: (id, qntd) => {
    let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
    MEU_CARRINHO[objIndex].qntd = qntd;

    // atualiza o botão carrinho com a quantidade atualizada
    cardapio.metodos.atualizarBadgeTotal();

    // atualiza os valores (R$) totais do carrinho
    cardapio.metodos.carregarValores();
  },

  //carrega os valores de subTotal, Entrega e total
  carregarValores: () => {
    let subTotal = 0; // Declare a variável subTotal aqui

    $('#lblSubTotal').text('R$ 0,00');
    $('#lblValorEntrega').text('+ R$ 0,00');
    $('#lblValorTotal').text('R$ 0,00');

    $.each(MEU_CARRINHO, (i, e) => {
      subTotal += parseFloat(e.price * e.qntd); // Corrigido para parseFloat

      if (i + 1 === MEU_CARRINHO.length) {
        $('#lblSubTotal').text(`R$ ${subTotal.toFixed(2).replace('.', ',')}`);
        $('#lblValorEntrega').text(
          `+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`,
        );
        $('#lblValorTotal').text(
          `R$ ${(subTotal + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`,
        );
      }
    });

    return subTotal; // Retorne subTotal aqui
  },

  //carregar a etapa endereço
  carregarEndereco: () => {
    if (MEU_CARRINHO.length <= 0) {
      cardapio.metodos.mensagem('Seu carrinho está vazio.');
      return;
    }
    cardapio.metodos.carregarEtapa(2);
  },

  //API ViaCEP
  buscarCep: () => {
    // cria a variavel com o valor do cep
    var cep = $('#txtCEP').val().trim().replace(/\D/g, '');

    //verifica se o cep possui valor informado
    if (cep != '') {
      //Expressão regular para validar o CEP
      var validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        $.getJSON(
          'https://viacep.com.br/ws/' + cep + '/json/?callback=?',
          function (dados) {
            if (!('erro' in dados)) {
              //Atualizar os campos com os valores retornados
              $('#txtEndereco').val(dados.logradouro);
              $('#txtBairro').val(dados.bairro);
              $('#txtCidade').val(dados.localidade);
              $('#ddlUF').val(dados.uf);
              $('#txtNumero').focus();
            } else {
              cardapio.metodos.mensagem(
                'CEP não encontrado, Preencha as informações manualmente.',
              );
              $('#txtEndereco').focus();
            }
          },
        );
      } else {
        cardapio.metodos.mensagem('Formato do CEP invalido.');
        $('#txtCEP').focus();
      }
    } else {
      cardapio.metodos.mensagem('Informe o CEP, por favor.');
      $('#txtCEP').focus();
    }
  },

  //validação antes de prosseguir para a etapa 3
  resumoPedido: () => {
    let cep = $('#txtCEP').val().trim();
    let endereco = $('#txtEndereco').val().trim();
    let bairro = $('#txtBairro').val().trim();
    let cidade = $('#txtCidade').val().trim();
    let uf = $('#ddlUF').val().trim();
    let numero = $('#txtNumero').val().trim();
    let complemento = $('#txtComplemento').val().trim();

    if (cep.length <= 0) {
      cardapio.metodos.mensagem('Informe o CEP, por favor.');
      $('#txtCEP').focus();
      return;
    }

    if (endereco.length <= 0) {
      cardapio.metodos.mensagem('Informe o Endereço, por favor.');
      $('#txtEndereco').focus();
      return;
    }

    if (bairro.length <= 0) {
      cardapio.metodos.mensagem('Informe o Bairro, por favor.');
      $('#txtBairro').focus();
      return;
    }

    if (cidade.length <= 0) {
      cardapio.metodos.mensagem('Informe a Cidade, por favor.');
      $('#txtCidade').focus();
      return;
    }
    if (uf == '-1') {
      cardapio.metodos.mensagem('Informe o UF, por favor.');
      $('#ddlUf').focus();
      return;
    }
    if (numero.length <= 0) {
      cardapio.metodos.mensagem('Informe o Numero, por favor.');
      $('#txtNumero').focus();
      return;
    }

    MEU_ENDERECO = {
      cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      numero: numero,
      complemento: complemento,
    };

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();
  },

  // carrega a etapa de resumo do pedido
  carregarResumo: () => {
    $('#listaItensResumo').html('');

    $.each(MEU_CARRINHO, (i, e) => {
      let temp = cardapio.templates.itemResumo
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${qntd}/g, e.qntd);

      $('#listaItensResumo').append(temp);
    });

    $('#resumoEndereco').html(
      `${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`,
    );
    $('#cidadeEndereco').html(
      `${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`,
    );

    cardapio.metodos.finalizarPedido();
  },

  // Atualiza o link do botão do whatsApp
  finalizarPedido: () => {
    if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
      var texto = 'Ola gostaria de fazer um pedido:';
      var itens = ''; // Inicialize a variável itens aqui

      // Obtenha o subtotal aqui
      let subTotal = cardapio.metodos.carregarValores();

      $.each(MEU_CARRINHO, (i, e) => {
        itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price
          .toFixed(2)
          .replace('.', ',')} \n`;

        // Último item
        if (i + 1 == MEU_CARRINHO.length) {
          texto += `\n*Itens do pedido:*\n\n${itens}`; // Substitua diretamente aqui
          texto += `\n*Endereço de Entrega:*`;
          texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
          texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
          texto += `\n\n*Total (com entrega): R$ ${(subTotal + VALOR_ENTREGA)
            .toFixed(2)
            .replace('.', ',')}*`;

          console.log(texto);

          //converte a url
          let encodedTexto = encodeURI(texto); // Correção aqui
          let URL = `http://wa.me/${CELULAR_EMPRESA}?text=${encodedTexto}`; // Correção aqui

          $('#btnEtapaResumo').attr('href', URL);
        }
      });
    }
  },

  //carrega o link do botão reserva
  carregarBotãoReserva: () => {
    var texto = 'Olá! gostaria de fazer uma *reserva*';

    let encodedTexto = encodeURI(texto);
    let URL = `http://wa.me/${CELULAR_EMPRESA}?text=${encodedTexto}`;

    $('#btnReserva').attr('href', URL);
  },

  //carrega o botão de ligar
  carregarBotãoLigar: () => {
    $('#btnLigar').attr('href', `tel:${CELULAR_EMPRESA}`);
  },

  //abre o depoimento
  abrirDepoimento: (depoimento) => {
    $('#depoimento-1').addClass('hidden');
    $('#depoimento-2').addClass('hidden');
    $('#depoimento-3').addClass('hidden');

    $('#btnDepoimento-1').removeClass('active');
    $('#btnDepoimento-2').removeClass('active');
    $('#btnDepoimento-3').removeClass('active');

    $('#depoimento-' + depoimento).removeClass('hidden');
    $('#btnDepoimento-' + depoimento).addClass('active');
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
<div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
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
      <button class=" btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')">
        <i class="fas fa-minus"></i>
      </button>
      <span class="add-numero-itens" id="qntd-\${id}">0</span>
      <button class=" btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')">
        <i class="fas fa-plus"></i>
      </button>
      <button class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
        <i class="fa fa-shopping-bag"></i>
      </button>
    </div>
  </div>
</div>
`,

  itemCarrinho: `
<div class="col-12 item-carrinho">
  <div class="img-produto">
    <img src="\${img}">
  </div>
  <div class="dados-produto">
    <p class="title-produto"><b>\${name}</b></p>
    <p class="price-produto"><b>R$ \${price}</b></p>
  </div>
  <div class="add-carrinho">
    <button class="btn btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')">
      <i class="fas fa-minus"></i>
    </button>
    <span class="add-numero-itens" id="qntd-carrinho\${id}">\${qntd}</span>
    <button class="btn btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')">
      <i class="fas fa-plus"></i>
    </button>
    <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
  </div>
</div>
`,

  itemResumo: `<div class="col-12">
<div class="row" id="listaItensResumo">

  <div class="col-12 item-carrinho resumo">
    <div class="img-produto-resumo">
      <img src="\${img}">
    </div>
    <div class="dados-produto">
      <p class="title-produto-resumo">
        <b>\${name}</b>
      </p>

      <p class="price-produto-resumo">
        <b>R$ \${price}</b>
      </p>
    </div>
    <p class="quantidade-produto-resumo">
      x <b>\${qntd}</b>
    </p>
  </div>
`,
};

$(document).ready(function () {
  cardapio.eventos.init();
});
