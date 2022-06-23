

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
    data = data.toLocaleDateString("pt-US") 


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


    if(msg['infos'].Tipo_Operacacao == 1){
        
        var icon = `<span class="icon icon-l gradient-red shadow-bg shadow-bg-xs me-3">
                        <i class="bi bi-arrow-up color-white"></i>
                    </span>`;
        $('.icon_tipo').html(icon)

    }else{

        var icon = `<span class="icon icon-l gradient-mint shadow-bg shadow-bg-xs me-3">
                        <i class="bi bi-arrow-down color-white"></i>
                    </span>`;
        $('.icon_tipo').html(icon)
    }

    $('#menu-activity .nome_empresa').text(msg['infos'].Cliente.substring(0,15));
    $('#menu-activity .nome_vendedor').text(msg['infos'].Vendedor);
    $('#menu-activity .ref_proposta').text(msg['infos'].Numero_Proposta);
    $('#menu-activity .data_abertura').text(data);
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


    msg['valores'].forEach(element => {

        $('.valores_proposta').html('')
        if(element.Natureza == 'Recebimento'){
            var valores = `<strong class="col-5 color-green-dark">${element.Natureza}</strong>
                            <strong class="col-7 text-end color-green-dark">${element.Moeda} ${element.Valor}</strong>
                            <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
        }else{
            var valores = `<strong class="col-5 color-red-dark">${element.Natureza}</strong>
                            <strong class="col-7 text-end color-red-dark">- ${element.Moeda} ${element.Valor}</strong>
                            <div class="col-12 mt-2 mb-2"><div class="divider my-0"></div></div>`;
        }
        

        $('.valores_proposta').append(valores)
    });



    
 

    
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
     console.log('aqui')
    
        $('.page-content').html(msg)
        $('#preloader').addClass('preloader-hide');
        $('.img_perfil').attr('src', JSON.parse(localStorage.getItem('info_usuario_sirius_os'))[0]['img_sistema'])
        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });
}

    
   

    
  
    
