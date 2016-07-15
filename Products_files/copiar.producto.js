(function() {

    var $hostname = window.location.host;
    var selectNameTienda = '.testSelect';
    var selectNameCatalogo = '.SelectCatalogo';
    var urlServiceCatalogo = 'http://dev.3.elcomercio.pe/catalogo/api/catalogo';
    var urlServiceTienda = 'http://dev.3.elcomercio.pe/catalogo/api/tienda';

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
                console.log(lastSelected);
                localStorage.setItem(selectName, lastSelected);
            }
        },
        //getEnviroment : function (){
        //
        //    var $indexOf_hostname = $hostname.indexOf("dev.catalogo.ecincubator.net");
        //
        //    if ($indexOf_hostname != -1){
        //        switch ($hostname.substr(0, $indexOf_hostname)){
        //            case "dev.3." : return 'dev.3.';
        //                break;
        //            case "pre.3." : return 'pre.3.';
        //                break;
        //            default :
        //                USERNAME = "service_hiraoka@gmail.com";
        //                PASSWORD = "Cd3v3l0per*1";
        //                return '';
        //                break;
        //        }
        //    }
        //
        //},
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

    copy.getJsonP(urlServiceCatalogo,function(dataCatalogo){
        var $select = $(selectNameCatalogo);
        $.each(dataCatalogo, function(i, val){
            $select.append($('<option />', { value: (val.catalogo_id), text: val.nombre }));
        });
        copy.init(selectNameCatalogo);
    });

    copy.getJsonP(urlServiceTienda,function(dataTienda){
        var $select = $(selectNameTienda);
        console.log(dataTienda);
        $.each(dataTienda, function(i, val){
            $select.append($('<option />', { value: (val.empresa_id), text: val.razonsocial }));
        });
        copy.init(selectNameTienda);
    });

}());