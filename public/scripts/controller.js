

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


// $(document).on('click', '.listprocessos > a', function(e){

//     // $('#menu-activity').removeClass('show');

//     // $('#menu-activity').addClass('show');
//     // OpenPage(page)
// })

$(document).on('click', '.btn_sair', function(e){
    localStorage.removeItem('info_usuario_sirius_os');
    window.location.href = "/login";
    // OpenPage(page)
})

$(document).on('click', '.btn_filtros', function(e){
    var tipo = $(this).data('tipo');
    $('.btn_confirma_filtro').attr('data-tipo', tipo)
})

$(document).on('click', '.btn_filtros_financeiro', function(e){
    var tipo = $(this).data('tipo');
    $('.btn_confirma_filtro_financeiro').attr('data-tipo', tipo)
})


$(document).on('click', '.btn_confirma_filtro_financeiro_pendentes', function(e){
    var referencia = $('#filtro_referencia_financeiro_pendente').val()
    var pessoa = $('#filtro_pessoa_financeiro_pendente').val()
    var quantidade = $('#filtro_quantidade_financeiro').val()
    var tipo = $(this).attr('data-tipo');
    

    $.ajax({
        url : "/mov_financeira_pendente",
        type : 'GET',
        data : {
            tipo:tipo,
            quantidade:quantidade,
            referencia : referencia,
            pessoa : pessoa
        },
        beforeSend : function(){

        }
    })
    .done(function(data){

        $('.listprocessos').html('')
        
        data.forEach(element => {
          

            
            let dataMovimentacao = new Date(element.DataConvertido)
 
        dataMovimentacao.setDate(dataMovimentacao.getDate() + 1);
        dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 
    

        if(element.Natureza == 1){
        var icon = '<span class="icon rounded-s me-2 gradient-green shadow-bg shadow-bg-xs"><i class="bi bi-arrow-down font-24 color-white"></i></span>';
        var button_color = 'color-green-dark'

        $('.icon_tipo_movimentacao').html(icon)
        }else{
        var button_color = 'color-red-dark'
        var icon = '<span class="icon rounded-s me-2 gradient-red shadow-bg shadow-bg-xs"><i class="bi bi-arrow-up font-24 color-white"></i></span>';

        $('.icon_tipo_movimentacao').html(icon)
        }



        var propostas = `<a data-bs-toggle="offcanvas" id="${element.IdRegistro_Financeiro}" data-bs-target="#menu-activity-financeiro" href="#" class="d-flex pb-3 div_mov_financeira_new">
        <div class="align-self-center">
        ${icon}
        </div>
        <div class="align-self-center ps-1">
        <h5 class="pt-1 mb-n1">${element.Pessoa.substring(0,20)}</h5>
        <p class="mb-0 font-11 opacity-50">${element.Referencia}</p>
        </div>
        <div class="align-self-center ms-auto text-end">
        <h4 class="pt-1 mb-n1 ${button_color}">${element.Valor_Original.toLocaleString('pt-br',{style: 'currency', currency: element.Moeda})}</h4>
        <p class="mb-0 font-12 opacity-50">${dataMovimentacao}</p>
        </div>
        </a>`;

   

        $('.listprocessos').append(propostas)
        });


    })

})
$(document).on('click', '.btn_confirma_filtro_financeiro', function(e){
    var tipo = $(this).attr('data-tipo');
    var periodo = $('#filtro_periodo_financeiro').val()
    var referencia = $('#filtro_referencia_financeiro').val()
    var pessoa = $('#filtro_pessoa_financeiro').val()


    $.ajax({
        url : "/listagem_faturas",
        type : 'GET',
        data : {
            tipo:tipo,
            periodo : periodo,
            referencia : referencia,
            pessoa : pessoa
        },
        beforeSend : function(){
           
            
        }
    })
    .done(function(data){
      
        $('.listprocessos').html('')
        
        data.forEach(element => {
            console.log('data cconvertida', element.Data_Conciliacao_Convertido)

            
            let dataMovimentacao = new Date(element.Data_Conciliacao_Convertido)
 
        dataMovimentacao.setDate(dataMovimentacao.getDate() + 1);
        dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 
        console.log('data movimentao', dataMovimentacao)

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

   

        $('.listprocessos').append(propostas)
        });


    })

    // console.log(tipo, periodo, referencia, pessoa)


})

$(document).on('click', '.btn_confirma_filtro', function(e){

    var tipo = $(this).attr('data-tipo');


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
        console.log(data)
     
        $('.listprocessos').html('')

        data.forEach(element => {

            let data = new Date(element.Data_abertura_convertido)
            data.setDate(data.getDate() + 1);
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


$(document).on('click', '.div_mov_financeira_new', function(e){
    var id = $(this).attr('id');
    $('#menu-activity-financeiro .pessoa').text('');
    $('#menu-activity-financeiro .ResponsavelConciliacao').text('');
    $('#menu-activity-financeiro .Referencia').text('');
    $('#menu-activity-financeiro .data').text('');
    $('#menu-activity-financeiro .tipoTransacao').text('');
    $('#menu-activity-financeiro .contaCorrente').text('');


    $.ajax({
        url : "/info_mov_financeira_new",
        type : 'GET',
        data : {
            referencia : id
        },
        beforeSend : function(){
           
            
        }
    })
    .done(function(msg){
        console.log(msg)
 
        $('.valores_movimentacao').html('')
        let dataMovimentacao = new Date(msg.DataConvertido)
 
        dataMovimentacao.setDate(dataMovimentacao.getDate() + 1);
        dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 

        if(msg.Natureza == 0){
   
        
            var icon = `<span class="icon rounded-s me-2 gradient-red shadow-bg shadow-bg-xs">
            <i class="bi bi-arrow-up font-24 color-white"></i>
            </span>`;
            $('.icon_tipo_movimentacao').html(icon)
    
        }else{
            
            var icon = `<span class="icon icon-l gradient-green shadow-bg shadow-bg-xs me-3">
                            <i class="bi bi-arrow-down color-white"></i>
                        </span>`;
                        
            $('.icon_tipo_movimentacao').html(icon)
        }


        $('#menu-activity-financeiro .pessoa').text(msg.Pessoa.substring(0,20));
        $('#menu-activity-financeiro .Referencia').text(msg.Referencia);
        $('#menu-activity-financeiro .data').text(dataMovimentacao);
        $('#menu-activity-financeiro .tipoTransacao').text(msg.tipoTransacao);
        $('#menu-activity-financeiro .contaCorrente').text(msg.ContaCorrente);

             if(msg.Natureza == 1){
                var valores = `<strong class="col-5 color-green-dark">Recebimento</strong>
                                <strong class="col-7 text-end color-green-dark">${msg.Valor_Original.toLocaleString('pt-br',{style: 'currency', currency: msg.Moeda})}</strong>
                                <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
            }else{
                var valores = `<strong class="col-5 color-red-dark">Pagamento</strong>
                                <strong class="col-7 text-end color-red-dark">${msg.Valor_Original.toLocaleString('pt-br',{style: 'currency', currency: msg.Moeda})}</strong>
                                <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
                      
            }

            $('.valores_movimentacao').append(valores)
        

    
    })
    
    



})






$(document).on('click', '.div_mov_financeira', function(e){
    var id = $(this).attr('id');
    $('#menu-activity-financeiro .pessoa').text('');
    $('#menu-activity-financeiro .ResponsavelConciliacao').text('');
    $('#menu-activity-financeiro .Referencia').text('');
    $('#menu-activity-financeiro .data').text('');
    $('#menu-activity-financeiro .tipoTransacao').text('');
    $('#menu-activity-financeiro .contaCorrente').text('');


    $.ajax({
        url : "/info_mov_financeira",
        type : 'GET',
        data : {
            referencia : id
        },
        beforeSend : function(){
           
            
        }
    })
    .done(function(msg){
 

        let dataMovimentacao = new Date(msg['infos'].Data_Conciliacao_Convertido)
 
        dataMovimentacao.setDate(dataMovimentacao.getDate() + 1);
        dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 


        $('#menu-activity-financeiro .pessoa').text(msg['infos'].Pessoa.substring(0,20));
        $('#menu-activity-financeiro .ResponsavelConciliacao').text(msg['infos'].ResponsavelConciliacao);
        $('#menu-activity-financeiro .Referencia').text(msg['infos'].Referencia);
        $('#menu-activity-financeiro .data').text(dataMovimentacao);
        $('#menu-activity-financeiro .tipoTransacao').text(msg['infos'].TipoTransacao);
        $('#menu-activity-financeiro .contaCorrente').text(msg['infos'].ContaCorrente);
        

        $('.valores_movimentacao').html('')
        profit = [];
        profit['total'] = [];
        msg['faturas'].forEach(element => {
            
    
            
            if(element.Natureza == 1){
                var valores = `<strong class="col-5 color-green-dark">${element.Referencia_Fatura}</strong>
                                <strong class="col-7 text-end color-green-dark">${element.Valor_Convertido.toLocaleString('pt-br',{style: 'currency', currency: element.Moeda})}</strong>
                                <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
            }else{
                var valores = `<strong class="col-5 color-red-dark">${element.Referencia_Fatura}</strong>
                                <strong class="col-7 text-end color-red-dark">${element.Valor_Convertido.toLocaleString('pt-br',{style: 'currency', currency: element.Moeda})}</strong>
                                <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
    
            
                                
            }
    
            if(profit['total'][element.Moeda]){
                profit['total'][element.Moeda] = profit['total'][element.Moeda] + element.Valor_Convertido;
            }else{
                profit['total'][element.Moeda] = element.Valor_Convertido;
            }
            
    
            $('.valores_movimentacao').append(valores)
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
    
        $('.valores_movimentacao').append(valores)
        }
            // console.log(profit['total'][natureza])
        }
    })
    
    



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
 
    let dataProposta = new Date(msg['infos'].Data_abertura_convertido)
                // var dataProposta = new Date();
                dataProposta.setDate(dataProposta.getDate() + 1);
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

                // let data = new Date(element.Data_abertura_convertido)
                // var dataProposta = new Date();
                // dataProposta.setDate(data.getDate() + 1);
                // dataProposta = dataProposta.toLocaleDateString("pt-US") 




                let data = new Date(element.Data_abertura_convertido)
                // var dataProposta = new Date();
                data.setDate(data.getDate() +1 );
                dataProposta = data.toLocaleDateString('pt-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
                

         
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

                let dataMovimentacao = new Date(element.Data_Conciliacao_Convertido)
          
                dataMovimentacao.setDate(dataMovimentacao.getDate() + 1);
                dataMovimentacao = dataMovimentacao.toLocaleDateString("pt-US") 


   

         
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

    


    $('.ultima_mov_financeira').append(propostas)
  
});      


        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });

    

   
}




    
   

    
  
    
