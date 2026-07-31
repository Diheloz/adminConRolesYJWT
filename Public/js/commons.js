export let containerBtnGraphic, canva, usersEdit, directory,  usersTable, tableTitle, containerBtnCrearUser, containerBtnCrear, formCreate, formUser, token;
/**
 * Las variables exportadas mantienen su valor actualizado porque los módulos comparten el mismo 
   binding, y la función exportada solo se encarga de inicializarlas cuando el DOM ya está listo.

 * Se crean funciones exportables con variables dentro NO para exportarlas, sino para controlar el
   momento exacto en que se inicializan(cuando la funcion es invocada en el archivo que la importa), especialmente cuando dependen del DOM.

 * Las funciones exportables no existen para exportar variables, existen para controlar el momento en que esas variables se inicializan.

 * Las variables dentro de la funcion export tambien deben ser exportadas, ya que sino se exportan, la funcion no las exporta, deben ser
   exportadas explicitamente para que sean reconocidas en los modulos.
   
 * ESTA ES LA MEJOR MANERA DE TRABAJAR MODULOS JS, CREANDO FUNCIONEX EXPORTABLES CON LAS VARIABLES A EXPORTAR DENTRO.
 */
export function initCommonsDOM(){
    containerBtnGraphic = document.querySelector(".container-btn-graphic");
    canva = document.querySelector(".canva");  
    usersEdit = document.querySelector(".users-edit");
    containerBtnCrear = document.querySelector(".container-btn-crear");
    containerBtnCrearUser = document.querySelector(".container-btn-crear-user");
    formCreate = document.querySelector(".form-create");
    formUser = document.querySelector(".form-create-user");
    directory = document.querySelector(".directory-table"); 
    usersTable = document.querySelector(".users-table");
    tableTitle = document.querySelector(".table-title");
  }
token = localStorage.getItem("token"); 