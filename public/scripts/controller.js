

if(!localStorage.getItem('info_usuario_sirius_os')){
    window.location.href = "/login";
}

var infos_users_app = JSON.parse(localStorage.getItem('info_usuario_sirius_os'))[0];

if(infos_users_app['adm'] == 1){
    consultas_adm()
    OpenPage('home-adm.html')

    $('.btn_inicio').attr('onclick', 'OpenPage("home-adm.html")');
    

}else{
    OpenPage('metas-geral.html')
    $('.btn_inicio').attr('onclick', 'OpenPage("metas-geral.html")');
}



function consultas_adm(){




}

$(document).on('click', '.menubar > a', function(e){

    $('.menubar a').removeClass('color-red-dark')
    $(this).addClass('color-red-dark')
    // OpenPage(page)
})


$(document).on('click', '.listprocessos > a', function(e){

    $('#menu-activity').removeClass('show');

    $('#menu-activity').addClass('show');
    // OpenPage(page)
})

$(document).on('click', '.btn_sair', function(e){
    localStorage.removeItem('info_usuario_sirius_os');
    window.location.href = "/login";
    // OpenPage(page)
})

$(document).on('click', '.btn_filtros', function(e){
    var tipo = $(this).data('tipo');
    $('.btn_confirma_filtro').attr('data-tipo', tipo)
})


$(document).on('click', '.btn_confirma_filtro', function(e){
console.log(e)
    var tipo = $(this).attr('data-tipo');
    console.log(tipo)

    var periodo = $('#filtro_periodo').val()
    var vendedor = $('#filtro_vendedor').val()
    var cliente = $('#filtro_cliente').val()
    var proposta = $('#filtro_proposta').val()




  

    $.ajax({
        url : "/filtro_propostas",
        type : 'GET',
        data : {
            tipo:tipo,
            periodo : periodo,
            vendedor : vendedor,
            cliente : cliente,
            proposta : proposta
        },
        beforeSend : function(){
           
            
        }
    })
    .done(function(data){
        $('.listprocessos').html('')

        data.forEach(element => {

            let data = new Date(element.Data_abertura_convertido)
            data = data.toLocaleDateString("pt-US") 

            if(element.Tipo_Operacao == 1){
                var icon = '<span class="icon rounded-s me-2 gradient-magenta shadow-bg shadow-bg-xs"><i class="bi bi-arrow-up font-24 color-white"></i></span>';
            }else{
                var icon = '<span class="icon rounded-s me-2 gradient-green shadow-bg shadow-bg-xs"><i class="bi bi-arrow-down font-24 color-white"></i></span>';
            }
        
        var processos = `<a data-bs-toggle="offcanvas" id="${element.IdOferta_Frete}" data-bs-target="#menu-activity" href="#" class="d-flex pb-3 div_propostas">
            <div class="align-self-center">
            ${icon}
            </div>
            <div class="align-self-center ps-1">
                <h5 class="pt-1 mb-n1">${element.Cliente.substring(0,20)}</h5>
                <p class="mb-0 font-11 opacity-50">${element.Vendedor}</p>
            </div>
            <div class="align-self-center ms-auto text-end">
                <h4 class="pt-1 mb-n1 color-mint-dark">${element.Numero_Proposta}</h4>
                <h6 class="pt-1 mb-n1 color-mint-dark">${element.Tipo_Carga}</h6>
                <p class="mb-0 font-12 opacity-50">${data}</p>
            </div>
            </a>`;
        
            
            
                $('.listprocessos').append(processos)
            
                        });

   })
    .fail(function(jqXHR, textStatus, msg){
    
    });


})



$(document).on('click', '.div_propostas', function(e){

    var id = $(this).attr('id')
  

   $.ajax({
    url : "/info_proposta",
    type : 'GET',
    data : {
        referencia : id
    },
    beforeSend : function(){
       
        
    }
})
.done(function(msg){
    console.log(msg)
    let data = new Date(msg['infos'].Data_abertura_convertido)
                var dataProposta = new Date();
                dataProposta.setDate(data.getDate() + 1);
                dataProposta = dataProposta.toLocaleDateString("pt-US") 


    $('#menu-activity .nome_empresa').text('');
    $('#menu-activity .nome_vendedor').text('');
    $('#menu-activity .ref_proposta').text('');
    $('#menu-activity .data_abertura').text('');
    $('#menu-activity .nome_importador').text('');
    $('#menu-activity .tipo_equipamento').text('');
    $('#menu-activity .nome_exportador').text('');
    $('#menu-activity .nome_cia').text('');
    $('#menu-activity .nome_origem').text('');
    $('#menu-activity .nome_destino').text('');
    $('#menu-activity .nome_mercadoria').text('');


    if(msg['infos'].Tipo_Operacao == 1){
   
        
        var icon = `<span class="icon icon-l gradient-magenta shadow-bg shadow-bg-xs me-3">
                        <i class="bi bi-arrow-up color-white"></i>
                    </span>`;
        $('.icon_tipo').html(icon)

    }else{
        
        var icon = `<span class="icon icon-l gradient-green shadow-bg shadow-bg-xs me-3">
                        <i class="bi bi-arrow-down color-white"></i>
                    </span>`;
                    
        $('.icon_tipo').html(icon)
    }

    $('#menu-activity .nome_empresa').text(msg['infos'].Cliente.substring(0,15));
    $('#menu-activity .nome_vendedor').text(msg['infos'].Vendedor);
    $('#menu-activity .ref_proposta').text(msg['infos'].Numero_Proposta);
    $('#menu-activity .data_abertura').text(dataProposta);
    $('#menu-activity .nome_importador').text(msg['infos'].Importador);
    $('#menu-activity .tipo_equipamento').text(msg['infos'].Tipo_carga);
    $('#menu-activity .nome_exportador').text(msg['infos'].Exportador);
    $('#menu-activity .nome_cia').text(msg['infos'].Cia_Transporte);
    $('#menu-activity .nome_origem').text(msg['infos'].Origem);
    $('#menu-activity .nome_destino').text(msg['infos'].Destino);
    $('#menu-activity .nome_mercadoria').text(msg['infos'].Mercadoria);

    $('.listagem_equipamentos').html('')
  
    msg['equipamentos'].forEach(element => {


        if(element.Quantidade < 10){
            element.Quantidade = '0'+element.Quantidade
        }


        var eqquipamento = `<strong class="col-5 color-theme">${element.Quantidade}</strong>
        <strong class="col-7 text-end">${element.Equipamento}</strong>
        <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;

        $('.listagem_equipamentos').append(eqquipamento)
    });

    $('.valores_proposta').html('')
    profit = [];
    profit['total'] = [];
    msg['valores'].forEach(element => {
        

        
        if(element.Natureza == 'Recebimento'){
            var valores = `<strong class="col-5 color-green-dark">${element.Natureza}</strong>
                            <strong class="col-7 text-end color-green-dark">${element.Valor.toLocaleString('pt-br',{style: 'currency', currency: element.Moeda})}</strong>
                            <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
        }else{
            var valores = `<strong class="col-5 color-red-dark">${element.Natureza}</strong>
                            <strong class="col-7 text-end color-red-dark">${element.Valor.toLocaleString('pt-br',{style: 'currency', currency: element.Moeda})}</strong>
                            <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;

        
                            
        }

        if(profit['total'][element.Moeda]){
            profit['total'][element.Moeda] = profit['total'][element.Moeda] + element.Valor;
        }else{
            profit['total'][element.Moeda] = element.Valor;
        }
        

        $('.valores_proposta').append(valores)
    });



    for(var natureza in profit['total']) {

        if(profit['total'][natureza] < 0){
            color = 'color-red-dark'
        }else{
            color = 'color-white'
        }

    
        

    if(profit['total'][natureza] != 0){
        var valores = `<strong class="col-5 color-white">TOTAL</strong>
                    <strong class="col-7 text-end color-white">${profit['total'][natureza].toLocaleString('pt-br',{style: 'currency', currency: natureza})}</strong>
                    <div class="col-12 mt-2 mb-2"></div>`;

    $('.valores_proposta').append(valores)
    }
        // console.log(profit['total'][natureza])
    }


    

    // var valores = `<strong class="col-5 color-red-dark">${element.Natureza}</strong>
    // <strong class="col-7 text-end color-red-dark">${element.Moeda} ${element.Valor}</strong>
    // <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;

    // $('.valores_proposta').append(valores)



    
 

    
})
.fail(function(jqXHR, textStatus, msg){
    
});
 
   


})






function OpenPage(page){
   

var status_geral = localStorage.getItem('status_geral');

console.log(localStorage.getItem('status_geral'))

    if(!page || status_geral == '0'){
        document['getElementsByClassName']('offline-message')[0]['classList']['add']('offline-message-active');
                    setTimeout(function() {
                        document['getElementsByClassName']('offline-message')[0]['classList']['remove']('offline-message-active')
       }, 1500)
        return false;
    }

    $.ajax({
        url : "/page",
        type : 'GET',
        data : {
             page : page
        },
        beforeSend : function(){
            $('#preloader').removeClass('preloader-hide');
            
        }
    })
    .done(function(msg){
   
    
        $('.page-content').html(msg)
        $('#preloader').addClass('preloader-hide');
        $('.img_perfil').attr('src', JSON.parse(localStorage.getItem('info_usuario_sirius_os'))[0]['img_sistema'])
        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });
}



setInterval(() => {

    if($('.mov_propostas').length > 0){
        atualizar_new_propostas()
    }

    if($('.ultima_mov_financeira').length > 0){
        atualizar_new_mov_financeira()
    }
    
}, 5000);

function atualizar_new_propostas(ultimoid){

    $.ajax({
        url : "/ultimas_propostas",
        type : 'GET',
        beforeSend : function(){
 
        }
    })
    .done(function(msg){


        $('.mov_propostas').html('')
            msg.forEach(element => {

                let data = new Date(element.Data_abertura_convertido)
                var dataProposta = new Date();
                dataProposta.setDate(data.getDate() + 1);
                dataProposta = dataProposta.toLocaleDateString("pt-US") 
                

         
if(element.Tipo_Operacao == 1){
        var icon = '<span class="icon rounded-s me-2 gradient-magenta shadow-bg shadow-bg-xs"><i class="bi bi-arrow-up font-24 color-white"></i></span>';
    }else{
        var icon = '<span class="icon rounded-s me-2 gradient-green shadow-bg shadow-bg-xs"><i class="bi bi-arrow-down font-24 color-white"></i></span>';
    }

var propostas = `<a data-bs-toggle="offcanvas" id="${element.IdOferta_Frete}" data-bs-target="#menu-activity" href="#" class="d-flex pb-3 div_propostas">
    <div class="align-self-center">
    ${icon}
    </div>
    <div class="align-self-center ps-1">
        <h5 class="pt-1 mb-n1">${element.Cliente.substring(0,20)}</h5>
        <p class="mb-0 font-11 opacity-50">${element.Vendedor}</p>
    </div>
    <div class="align-self-center ms-auto text-end">
        <h4 class="pt-1 mb-n1 color-mint-dark">${element.Numero_Proposta}</h4>
        <h6 class="pt-1 mb-n1 color-mint-dark">${element.Tipo_Carga}</h6>
        <p class="mb-0 font-12 opacity-50">${dataProposta}</p>
    </div>
    </a>`;

            $('.mov_propostas').append(propostas)

          
            });      


        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });

   
}



function atualizar_new_mov_financeira(ultimoid){

    $.ajax({
        url : "/ultimas_mov_financeiras",
        type : 'GET',
        beforeSend : function(){
 
        }
    })
    .done(function(msg){
        $('.ultima_mov_financeira').html('')
            msg.forEach(element => {

                let data = new Date(element.Data_Conciliacao_Convertido)
                var dataMovimentacao = new Date();
                dataMovimentacao.setDate(data.getDate() + 1);
                dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 


    $('#menu-activity-financeiro .pessoa').text('');
    $('#menu-activity-financeiro .ResponsavelConciliacao').text('');
    $('#menu-activity-financeiro .Referencia').text('');
    $('#menu-activity-financeiro .data').text('');
    $('#menu-activity-financeiro .tipoTransacao').text('');
    $('#menu-activity-financeiro .contaCorrente').text('');
    $('#menu-activity-financeiro .moeda').text('');
    $('#menu-activity-financeiro .valor').text('');

         
if(element.Natureza == 1){
        var icon = '<span class="icon rounded-s me-2 gradient-green shadow-bg shadow-bg-xs"><i class="bi bi-arrow-down font-24 color-white"></i></span>';
        var button_color = 'color-green-dark'

        $('.icon_tipo_movimentacao').html(icon)
    }else{
        var button_color = 'color-red-dark'
        var icon = '<span class="icon rounded-s me-2 gradient-red shadow-bg shadow-bg-xs"><i class="bi bi-arrow-up font-24 color-white"></i></span>';

        $('.icon_tipo_movimentacao').html(icon)
    }

    

var propostas = `<a data-bs-toggle="offcanvas" id="${element.IdMovimentacao_Financeira}" data-bs-target="#menu-activity-financeiro" href="#" class="d-flex pb-3 div_mov_financeira">
    <div class="align-self-center">
    ${icon}
    </div>
    <div class="align-self-center ps-1">
        <h5 class="pt-1 mb-n1">${element.Pessoa.substring(0,20)}</h5>
        <p class="mb-0 font-11 opacity-50">${element.Referencia}</p>
    </div>
    <div class="align-self-center ms-auto text-end">
        <h4 class="pt-1 mb-n1 ${button_color}">${element.Valor_Original.toLocaleString('pt-br',{style: 'currency', currency: element.Sigla})}</h4>
        <p class="mb-0 font-12 opacity-50">${dataMovimentacao}</p>
    </div>
    </a>`;

    $('#menu-activity-financeiro .pessoa').text(element.Pessoa.substring(0,20));
    $('#menu-activity-financeiro .ResponsavelConciliacao').text(element.ResponsavelConciliacao);
    $('#menu-activity-financeiro .Referencia').text(element.Referencia);
    $('#menu-activity-financeiro .data').text(dataMovimentacao);
    $('#menu-activity-financeiro .tipoTransacao').text(element.TipoTransacao);
    $('#menu-activity-financeiro .contaCorrente').text(element.ContaCorrente);
    $('#menu-activity-financeiro .moeda').text(element.Sigla);
    $('#menu-activity-financeiro .valor').text(element.Valor_Original);


    $('.ultima_mov_financeira').append(propostas)
  
});      


        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });

   
}




    
   

    
  
    
