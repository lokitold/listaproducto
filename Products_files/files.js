/**
 * @author Dimas Gustavo <amadeusc2@gmail.com>
 * @description subiendo imagen 
 * @version 1.0
 */
$(function() {    
    var files = {
        init : function(){
          files.photos();                  
        },        
        photos : function(){
            $('#uploadImg').click(function(){   
                $('#feactureImage').click();
            });
    
            $('#feactureImage').change(function(){
                var archivos = document.getElementById("feactureImage");
                var archivo = archivos.files;
               
                var archivos = new FormData();

                for(i=0; i<archivo.length; i++){            
                    archivos.append(i,archivo[i]);
                }
                
                var action = $(this).attr('data-source');
                                
                $.ajax({
                    dataType: 'json',//recibir valores json
                    url:action, //Url a donde la enviaremos
                    type:'POST', //Metodo que usaremos
                    contentType:false, //Debe estar en false para que pase el objeto sin procesar
                    data:archivos, //Le pasamos el objeto que creamos con los archivos
                    processData:false, //Debe estar en false para que JQuery no procese los datos a enviar
                    cache:false //Para que el formulario no guarde cache
                }).done(function(gData){//Escuchamos la respuesta y capturamos el mensaje msg                    
                    if(gData.resp == true){
                        console.log('resp = ok ---> donde ---->' + gData.msg);
                        
                        $.each(gData.images, function(i, img) {                            
                            var html = '<img src="' + img + '"/>';
                            $('#uploadImg').after(html);
                        });
                    }else{
                        console.log('pres = not ---> donde ---->' + gData.msg);
                    }
                });
            });
        },        
    };
    
    files.init();
    
});