OpenPage('home-geral.html')

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




function OpenPage(page){

    if(!page){
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
        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });
}

    
   

    
  
    
