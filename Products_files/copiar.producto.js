/**
 * Created by victor on 15/07/16.
 */
//select Tienda
var selectTienda = document.querySelector(".testSelect");
var selectOption = selectTienda.options[selectTienda.selectedIndex];
var lastSelected = localStorage.getItem('testSelect');

if (lastSelected) {
    selectTienda.value = lastSelected;
}

selectTienda.onchange = function () {
    lastSelected = selectTienda.options[selectTienda.selectedIndex].value;
    console.log(lastSelected);
    localStorage.setItem('testSelect', lastSelected);
}
// select Catalogo
var select = document.querySelector(".SelectCatalogo");
var selectOption = select.options[select.selectedIndex];
var lastSelected = localStorage.getItem('SelectCatalogo');

if (lastSelected) {
    select.value = lastSelected;
}

select.onchange = function () {
    lastSelected = select.options[select.selectedIndex].value;
    console.log(lastSelected);
    localStorage.setItem('SelectCatalogo', lastSelected);
}
//http://stackoverflow.com/questions/23905358/how-to-use-localstorage-on-last-html-select-value
