/*
    * Cuando se trabaja con "modulos", import o export deben ir antes que cualquier codigo, y TODOS los scripts deben ser type="module" en el archivo .html.
    * Primero va el import, despues el export.
    * Lo variables importadas son referencias vivas, no copias
*/
import {token, directory, usersTable, usersEdit, tableTitle, containerBtnCrear, containerBtnCrearUser, formCreate, formUser} from "./commons.js";
import {initCommonsDOM, containerBtnGraphic, canva} from "./commons.js";

//Si el token no existe(usuario no logueado), se bloquea el ingreso al dashboard
if(!token){
    window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", ()=>{
    const report = document.querySelector(".report");
    const reportTable = document.querySelector(".report-table");  
    

    /*Se llama la funcion importada cuando el DOM ya se ha inicializado(controla el momento en que esas variables importadas dentro de la funcion
    se inicializan), al ser llamada la funcion se inicializan las variables importadas*/     
    initCommonsDOM();        

    //Lista la data al dar click en el modulo reportes
    report.addEventListener("click", async(e)=>{
        if (e.target.closest(".report")) {
            if (reportTable.classList.contains("hidden")) {
                tableTitle.classList.remove("hidden");
                tableTitle.textContent="Reporte";  
                directory.classList.add("hidden");
                usersTable.classList.add("hidden");
                usersEdit.classList.add("hidden");     
                reportTable.classList.remove("hidden");
                containerBtnCrearUser.classList.add("hidden");                         
                containerBtnCrear.classList.add("hidden");
                formCreate.classList.add("hidden");
                formUser.classList.add("hidden");
                containerBtnGraphic.classList.remove("hidden");
                                       
            }else{
                reportTable.classList.add("hidden");  
                tableTitle.classList.add("hidden"); 
                containerBtnGraphic.classList.add("hidden");                                             
                return;
            }
            const response = await fetch("/api/report",{
                headers: {"Authorization": `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {                    
                //     $("#report-table").DataTable({
                //        data: data.users,
                //        columns:[
                //            {data:"nombre"},
                //            {data:"apellido"},
                //            {data:"email"},
                //            {data:"tipo"}
                //        ]
                //    }); 
                    const table = document.querySelector(".report-info");
                    table.innerHTML = "";
                    const fragment = document.createDocumentFragment();
                    
                    data.users.forEach(user => {
                        const tr = document.createElement("tr");
                        tr.innerHTML =`
                            <td>${user.nombre}</td>
                            <td>${user.apellido}</td>
                            <td>${user.email}</td>
                            <td>${user.tipo}</td>
                        `;         
                        fragment.appendChild(tr);               
                    });   
                    table.appendChild(fragment);
                }                
            }
        }
    });   

    //Evento que detecta click de boton "ver grafico" y muestra el grafico de la data
    containerBtnGraphic.addEventListener("click", async(e)=>{
        if (e.target.closest(".btn-graphic")) { 

            if (canva.classList.contains("hidden")) {
                canva.classList.remove("hidden");
            } else{
                canva.classList.add("hidden");                  
                return;
            } 

            const response = await fetch("/api/report",{
                headers: {"Authorization": `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();                
                let labels = [];
                let conteo = {};
                
                for (let i = 0; i < data.users.length; i++) {
                    labels.push(data.users[i].tipo);              
                }    

                //Contar las veces que se repite un mismo valor 
                labels.forEach(el =>{
                    conteo[el] = (conteo[el] || 0) + 1;
                });     

                //Obtener los valores del objeto
                const claves = Object.values(conteo);
                const valores = Object.keys(conteo);
                const canvaBox = document.getElementById("usersChart");

                //Para mostrar graficos se utiliza la libreria chart js
                new Chart(canvaBox, {                      
                    type: 'pie',
                    data: {                        
                        labels: valores,
                        datasets: [
                            {
                                //label: "Grafico Directorio",
                                backgroundColor: ["#3e95cd", "#bfa", "#fda"],
                                borderColor: "#ddd",
                                //hoverBackgroundColor: "#dce",    
                                hoverOffset: 10,                                                                                                          
                                data: claves
                            }
                        ]
                    }
                });                                                                                
            }
        }
    });
});