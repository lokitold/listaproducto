(function() {

    var copy = {
        init : function (selectName) {
            var selectTienda = document.querySelector(selectName);
            var selectOption = selectTienda.options[selectTienda.selectedIndex];
            var lastSelected = localStorage.getItem(selectName);

            if (lastSelected) {
                selectTienda.value = lastSelected;
            }

            selectTienda.onchange = function () {
                lastSelected = selectTienda.options[selectTienda.selectedIndex].value;
                //console.log(lastSelected);
                localStorage.setItem(selectName, lastSelected);
            }
        },
        getEnviroment : function (){

            if($hostname.indexOf("dev.catalogo.ecincubator.net") != -1){
                return 'dev.3.';
            }
            else if($hostname.indexOf("localhost")!= -1){
                return 'dev.3.';
            }
            else if($hostname.indexOf("pre.catalogo.ecincubator.net")!= -1){
                return 'pre.3.';
            }
            else{
                return '';
            }

        },
        getJsonP: function (urlService,callback){
            $.ajax({
                url: urlService,
                jsonp: "callback",
                dataType: 'jsonp',
                type: 'GET',
                error: function(error) {
                    console.log(error);
                }
            }).done(function(response) {
                if (response.success) {
                    var dataCatalogo = response.data;
                    callback(dataCatalogo);
                }
            });
        }
    }


    var $hostname = window.location.host;
    var selectNameTienda = '.testSelect';
    var selectNameCatalogo = '.SelectCatalogo';
    var urlServiceCatalogo = 'http://'+copy.getEnviroment()+'elcomercio.pe/catalogo/api/catalogo';
    var urlServiceTienda = 'http://'+copy.getEnviroment()+'elcomercio.pe/catalogo/api/tienda';

    console.log(urlServiceCatalogo);

    copy.getJsonP(urlServiceCatalogo,function(dataCatalogo){
        var $select = $(selectNameCatalogo);
        $.each(dataCatalogo, function(i, val){
            $select.append($('<option />', { value: (val.catalogo_id), text: val.nombre }));
        });
        copy.init(selectNameCatalogo);
    });

    copy.getJsonP(urlServiceTienda,function(dataTienda){
        var $select = $(selectNameTienda);
        //console.log(dataTienda);
        $.each(dataTienda, function(i, val){
            $select.append($('<option />', { value: (val.empresa_id), text: val.razonsocial }));
        });
        copy.init(selectNameTienda);

    });

    $(selectNameTienda).on('change', function(){
        var selectTienda = $(selectNameTienda);
        var tiendaId = selectTienda.val();
        copy.getJsonP(urlServiceCatalogo+'?empresa_id='+tiendaId,function(dataCatalogo){
            var $select = $(selectNameCatalogo);
            $select.empty();
            $.each(dataCatalogo, function(i, val){
                $select.append($('<option />', { value: (val.catalogo_id), text: val.nombre }));
            });
            copy.init(selectNameCatalogo);
        });
    });


}());