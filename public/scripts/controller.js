OpenPage('metas-geral.html')

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
        
    })
    .fail(function(jqXHR, textStatus, msg){
        
    });
}

    
   

    
  
    
