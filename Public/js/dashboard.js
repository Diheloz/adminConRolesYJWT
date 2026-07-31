/*
    * Cuando se trabaja con "modulos", import o export deben ir antes que cualquier codigo, y TODOS los scripts deben ser type="module" en el archivo .html.
    * Primero va el import, despues el export.
*/
import {initCommonsDOM, containerBtnGraphic, canva,usersEdit, directory,  usersTable, tableTitle, containerBtnCrearUser, containerBtnCrear, formCreate, formUser, token} from "./commons.js";

//Si el token no existe(usuario no logueado), se bloquea el ingreso al dashboard
if(!token){
    window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded",()=>{
    const contanierName = document.querySelector(".bienvenido");
    const containerNavBar = document.querySelector(".modulos");     
    const tableHidden = document.querySelector(".hidden");
    const usersInfo = document.querySelector(".users-info");   
    const alertBox = document.querySelector(".alert");
    const btnSave = document.createElement("button");    
    const btnLogout = document.querySelector(".btn-logout");
    const reportTable = document.querySelector(".report-table"); 
    let currentUserId = null; //Variable que almacenera el id del usuario que se va a editar

    //Se inicializa la funcion importada y todo su contenido
    initCommonsDOM();

    //Decodifica JWT y extrae el payload[1]
    function parseJwt(token){
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);//atob method decodes a base-64 encoded string
        return JSON.parse(payload);
    }

   /* JSON Web Tokens(JWT) consist of three parts separated by dots (.), which are:
        1.Header -> consists of two parts: the type of the token, which is JWT, and the signing algorithm being used.
        2.Payload -> contains the user information, regularly it's what backend adds inside the backend JWT part.
        3.Signature -> take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
    */
     
    const usuario = parseJwt(token);    

    //Elimina el token y cierra la sesion
    btnLogout.addEventListener("click", ()=>{        
        localStorage.removeItem("token");
        window.location.href = "/index.html";        
    });
    
    //informacion del usuario logueado
    if(usuario){
        contanierName.classList.add("nombre-usuario");
        contanierName.textContent = `Bienvenido, ${usuario.nombre.toUpperCase()} ${usuario.apellido.toUpperCase()}`;
        contanierName.style.color="#fff";
    }  

    //Lista los usuarios al hacer click en el modulo admin
    containerNavBar.addEventListener("click", async(e)=>{
        try{
            if(e.target.classList.contains("admin")){             
                
                formCreate.classList.add("hidden");
                
                if(tableHidden.classList.contains("hidden")){  
                    tableTitle.classList.remove("hidden");
                    tableTitle.textContent="Listado de Estudiantes";                                      
                    tableHidden.classList.remove("hidden");
                    containerBtnCrear.classList.remove("hidden");
                    usersEdit.classList.add("hidden");   
                    directory.classList.add("hidden");   
                    formUser.classList.add("hidden");
                    containerBtnCrearUser.classList.add("hidden"); 
                    reportTable.classList.add("hidden");    
                    containerBtnGraphic.classList.add("hidden");                 
                    canva.classList.add("hidden");                 
                } else{
                    tableHidden.classList.add("hidden");
                    tableTitle.classList.add("hidden");
                    containerBtnCrear.classList.add("hidden");
                    usersEdit.classList.add("hidden");      
                    directory.classList.add("hidden"); 
                    return;                              
                }
                //Oculta la columna "Accion" si el usuario es diferente a "admin"
                if(usuario.tipo !== 'admin'){       
                    const action = document.querySelector(".users-table-action");      
                    if (action) {                        
                        action.remove();    
                    }
                }
    
                const response = await fetch("/api/users", {
                    headers: {"Authorization": `Bearer ${token}`}
                });
                

                if(response.ok){
                    const data = await response.json();
                    //Forma de agregar Datatable 
                    // $(".users-table").DataTable({
                    //     data: data,
                    //     columns:[
                    //         {data:"nombre"},
                    //         {data:"curso"},
                    //         {data:"nota"},
                    //     ]
                    // });                    
                    const tableBody = document.getElementById("users");
                    tableBody.innerHTML = "";
                    const fragment = document.createDocumentFragment();
                    let actions ="";
                        
                    data.forEach(user => {
                        const row = document.createElement("tr");
                        //Muestra la columna si el usuario es admin
                        if(usuario.tipo === "admin"){
                            actions = `<td><button class="btn-delete" data-id="${user.id}" data-name="${user.nombre}">Eliminar</button><button class="btn-edit" data-id="${user.id}" data-name="${user.nombre}" data-curso="${user.curso}" data-nota="${user.nota}">Editar</button></td>`;
                        }                        
                            row.innerHTML = `
                                <td>${user.nombre}</td>
                                <td>${user.curso}</td>
                                <td>${user.nota}</td>
                                ${actions}`
                            fragment.appendChild(row);
                    });
                    tableBody.appendChild(fragment);                
                }                                      
            }
        }
        catch(error){
            console.log('Error: ' + error.message);
        }
    });

    //Eliminar usuario
    usersInfo.addEventListener("click", async(e)=>{
        if(e.target.classList.contains("btn-delete")){             
            try{          
                const nameStudent = e.target.getAttribute("data-name");
                const idStudent = e.target.getAttribute("data-id");
                    
                if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${nameStudent}?`)) {
                    return;
                }                
                //Dentro de la peticion http se envia el token con la data del usuario logueado
                const response = await fetch("/api/delete",{
                    method: "DELETE",
                    headers: {"Content-type": "application/json", "Authorization": `Bearer ${token}`},
                    body: JSON.stringify({id: idStudent})
                });
                const data = await response.json();

                if(data.success){
                    alertBox.classList.add("alert-success");
                    alertBox.textContent = data.message;    
                    setTimeout(()=>{
                        alertBox.remove();
                        window.location.href = "dashboard.html";
                        }, 1000);                
                } else {
                    alertBox.classList.add("alert-danger");
                    alertBox.textContent = data.message;
                    setTimeout(()=>{
                        alertBox.remove();
                        window.location.href = "dashboard.html";
                        }, 1000);
                }
            }catch(error){
                console.log('Error: ' + error.message); 
            }
        }
        tableHidden.classList.add("hidden");
    });

    //Formulario de edicion de usuario
    usersInfo.addEventListener("click", async(e)=>{
        if (e.target.classList.contains("btn-edit")) {
            try {    
                formCreate.classList.add("hidden");
                containerBtnCrear.classList.add("hidden");
                tableTitle.classList.add("hidden");
                                
                usersEdit.classList.remove("hidden");  
                tableHidden.classList.add("hidden");

                const editContainer = document.querySelector(".edit-container");
                editContainer.setAttribute("data-id", e.target.getAttribute("data-id"));

                const name = document.createElement("input");
                name.classList.add("input-name");
                const curso = document.createElement("input");
                curso.classList.add("input-curso");
                const nota = document.createElement("input");
                nota.classList.add("input-nota");
                const tr = document.createElement("tr");
                const td1 = document.createElement("td");
                const td2 = document.createElement("td");
                const td3 = document.createElement("td");
                const td4 = document.createElement("td");                

                btnSave.textContent = "Guardar";
                btnSave.classList.add("btn-save");

                name.type = "text";
                curso.type = "text";
                nota.type = "number";
                nota.step="0.01";

                name.value = e.target.getAttribute("data-name");
                curso.value = e.target.getAttribute("data-curso");
                nota.value = e.target.getAttribute("data-nota");
                
                td1.appendChild(name);
                td2.appendChild(curso);
                td3.appendChild(nota);
                td4.appendChild(btnSave);
                tr.append(td1, td2, td3, td4);                
                
                editContainer.innerHTML = "";
                editContainer.append(tr);               
            } catch (error) {
                console.log('Error: ' + error.message); 
            }            
        }
    });

    //Guardar cambios de edicion
    usersEdit.addEventListener("click", async(e)=>{
        try {
            if(e.target.closest(".btn-save")){
                //Dentro de la peticion http se envia el token con la data del usuario logueado
                const response = await fetch("/api/update",{
                    method: "PUT",
                    headers: {"Content-type": "application/json", "Authorization": `Bearer ${token}`},
                    body: JSON.stringify({
                        id: e.target.closest(".edit-container").getAttribute("data-id"),
                        nombre: document.querySelector(".input-name").value.trim(),
                        curso: document.querySelector(".input-curso").value.trim(),
                        nota: document.querySelector(".input-nota").value.trim()
                    })
                });
                
                if(!response.ok){
                    throw new Error("Error en la solicitud");
                }
                
                const data = await response.json();

                if(data.success){
                    alertBox.classList.add("alert-success");
                    alertBox.textContent = data.message;
                    setTimeout(()=>{
                        window.location.href = "dashboard.html";
                    }, 1000);
                }else{
                    alertBox.classList.add("alert-danger");
                    alertBox.textContent = data.message;
                    setTimeout(()=>{
                        alertBox.remove();
                        window.location.href = "dashboard.html";
                    }, 1000);
                }                
            }            
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        
    });

    //Mostrar formulario crear usuario
    containerBtnCrear.addEventListener("click", (e)=>{
        if(e.target.classList.contains("btn-crear")){           
            const formCreate = document.querySelector(".form-create");
            formCreate.classList.remove("hidden");   
            tableHidden.classList.add("hidden");  
            tableTitle.classList.add("hidden");  

            if(containerBtnCrear.classList.contains("hidden")){
                containerBtnCrear.classList.remove("hidden");                
           }else{
                containerBtnCrear.classList.add("hidden");
           }
        }
    });
    
    //Crear nuevo usuario
    formCreate.addEventListener("submit", async(e)=>{
        e.preventDefault();
        try {
            if(e.target.matches(".form-usuario")){
                const data = new FormData(e.target);
                //Dentro de la peticion http se envia el token con la data del usuario logueado
                const response = await fetch("/api/create",{
                    headers: {"Authorization": `Bearer ${token}`},
                    method: "POST",                    
                    body: data
                });

                if (response.ok) {                    
                    // if(!response.ok){
                    //     throw new Error("Error en la solicitud");
                    // }
                    const result = await response.json();
    
                    if(result.success){
                        alertBox.classList.add("alert-success");
                        alertBox.textContent = result.message;
                        setTimeout(()=>{
                            window.location.href = "dashboard.html";
                        }, 1000);
                    }else{
                        alertBox.classList.add("alert-danger");
                        alertBox.textContent = result.message;
                        setTimeout(()=>{
                            window.location.href = "dashboard.html";
                        }, 1000);
                    }
                }

            }
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    });

    //Lista los usuarios al hacer click en Directorio
    containerNavBar.addEventListener("click", async(e)=>{
        if(e.target.closest(".directory")){
            try {   
                //Oculta columna acciones si el usuario es diferente a admin
                if(usuario.tipo !== 'admin'){       
                    const actions = document.querySelector(".directory-action");      
                    if (actions) {                        
                        actions.remove();    
                    }
                }
                if(directory.classList.contains("hidden")){
                    tableTitle.classList.remove("hidden");
                    tableTitle.textContent="Listado de Usuarios"; 
                    directory.classList.remove("hidden");
                    usersTable.classList.add("hidden");
                    formCreate.classList.add("hidden");
                    containerBtnCrearUser.classList.remove("hidden");
                    formUser.classList.add("hidden");
                    containerBtnCrear.classList.add("hidden");
                    usersEdit.classList.add("hidden");
                    reportTable.classList.add("hidden");  
                    containerBtnGraphic.classList.add("hidden");                 
                    canva.classList.add("hidden");  
                }else{
                    tableTitle.classList.add("hidden");
                    directory.classList.add("hidden");
                    containerBtnCrear.classList.add("hidden");
                    containerBtnCrearUser.classList.add("hidden");
                    return;
                }

                const response = await fetch("/api/directory", {
                    headers: {"Authorization": `Bearer ${token}`}
                });
                
                if (response.ok) {                    
                    const data = await response.json();               
    
                    if (data) {                    
                        const tbody = document.getElementById("directory");                   
                        tbody.innerHTML = "";
                        const fragment = document.createDocumentFragment();    
                        let buttons = "";              
                      
                        data.forEach(user => {                        
                            const row = document.createElement("tr"); 
                            //Muestra los botones si el usuario es admin                       
                            if (usuario.tipo === "admin") {                                
                                buttons = `<td><button class='btn-edit-directory' data-id='${user.id}' data-name='${user.nombre}' data-surname='${user.apellido}' data-email='${user.email}' data-tipo='${user.tipo}'>Editar</td>                            
                                <td><button class='btn-delete-directory' data-id='${user.id}' data-name='${user.nombre}'>Eliminar</td>`                            
                            }                 
                            row.innerHTML = `
                                <td>${user.nombre}</td>
                                <td>${user.apellido}</td>
                                <td>${user.email}</td>                            
                                <td>${user.tipo}</td>
                                ${buttons}`                            
                            fragment.appendChild(row);
                        });
                        tbody.appendChild(fragment);
                    }else{
                        alertBox.classList.add("alert-danger");
                        alertBox.textContent = "No posee los permisos para visualizar la informacion";
                        setTimeout(()=>{
                            alertBox.textContent="";
                        },2000);
                    }
                }
            } catch (error) {
                console.log('Error: ' + error.message);
            }
        }
    });

    //Eliminar usuario modulo directorio
    directory.addEventListener("click", async(e)=>{
        if(e.target.classList.contains("btn-delete-directory")){             
            try{          
                const nameUser = e.target.getAttribute("data-name");
                const idUser = e.target.getAttribute("data-id");
                    
                if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${nameUser}?`)) {
                    return;
                }                
                //Dentro de la peticion http se envia el token con la data del usuario logueado
                const response = await fetch("/api/delete/directory",{
                    method: "DELETE",
                    headers: {"Content-type": "application/json", "Authorization": `Bearer ${token}`},
                    body: JSON.stringify({id: idUser})
                });
                const data = await response.json();

                if(data.success){
                    alertBox.classList.add("alert-success");
                    alertBox.textContent = data.message;    
                    setTimeout(()=>{
                        alertBox.remove();
                        window.location.href = "dashboard.html";
                        }, 1000);                
                } else {
                    alertBox.classList.add("alert-danger");
                    alertBox.textContent = data.message;
                    setTimeout(()=>{
                        alertBox.remove();
                        window.location.href = "dashboard.html";
                        }, 1000);
                }
            }catch(error){
                console.log('Error: ' + error.message); 
            }
        }
        tableHidden.classList.add("hidden");
    });

    //Mostrar formulario crear usuario
    containerBtnCrearUser.addEventListener("click", (e)=>{
        if(e.target.classList.contains("btn-crear-user")){  
            const formulario = document.querySelector(".form-user");   
            currentUserId = null;//Se resetea la variable para que no se almacene el id de un usuario existente
            formulario.reset();  //Se resetea el formulario para no traer informacion de usuarios existentes     
            const formCreate = document.querySelector(".form-create-user");
            formCreate.classList.remove("hidden");   
            tableHidden.classList.add("hidden");  
            containerBtnCrearUser.classList.add("hidden"); 
            tableTitle.classList.add("hidden"); 

           if(containerBtnCrearUser.classList.contains("hidden")){
                containerBtnCrear.classList.add("hidden");                
                directory.classList.add("hidden");    
                usersEdit.classList.add("hidden");           
           }else{
                containerBtnCrear.classList.add("hidden");
                directory.classList.add("hidden");
           }
        }
    });

    //Formulario de edicion de usuario Directorio
    directory.addEventListener("click", (e)=>{
        const btn = e.target.closest(".btn-edit-directory");
        if (btn) {
            try {   
                currentUserId = btn.dataset.id;           
                const containerForm = document.querySelector(".form-create-user"); 

                if (containerForm.classList.contains("hidden")) {
                    directory.classList.add("hidden");
                    containerBtnCrearUser.classList.add("hidden");
                    containerForm.classList.remove("hidden");
                    formCreate.classList.add("hidden");
                    containerBtnCrear.classList.add("hidden");
                    tableTitle.classList.add("hidden");                                    
                    usersEdit.classList.add("hidden");  
                    tableHidden.classList.add("hidden");
                }else{
                    containerForm.classList.add("hidden");
                }  
            
                const name = document.getElementById("name");
                const surname = document.getElementById("apellido");
                const email = document.getElementById("email");
                const password = document.getElementById("password");
                const select = document.getElementById("rol");
                const title = document.getElementById("title-form-directory");
                
                name.value = btn.dataset.name.trim();
                surname.value = btn.dataset.surname.trim();
                email.value = btn.dataset.email.trim();
                select.value = btn.dataset.tipo.trim();  
                password.innerHTML = "Nuevo password";         
                title.textContent = "Editar usuario";          
            } catch (error) {
                console.log('Error: ' + error.message); 
            }             
        }
    });

    //Evento que maneja Crear/Editar Usuario
    formUser.addEventListener("submit", async(e)=>{
        e.preventDefault();
        try {
            if(e.target.matches(".form-user")){
                const formulario = document.querySelector(".form-user");  
                let response;
                if (!currentUserId) {                    
                    const data = new FormData(e.target);               
                    //Dentro de la peticion http se envia el token con la data del usuario logueado
                    response = await fetch("/api/create/directory",{
                        headers: {"Authorization": `Bearer ${token}`},
                        method: "POST",                    
                        body: data
                    });
                }else{                    
                    response = await fetch("/api/update/directory",{
                        headers: {"Content-type": "application/json", "Authorization": `Bearer ${token}`},
                        method: "PUT",
                        body: JSON.stringify({
                            id: currentUserId,
                            nombre: document.getElementById("name").value.trim(),
                            apellido: document.getElementById("apellido").value.trim(),
                            email: document.getElementById("email").value.trim(),
                            password: document.getElementById("password").value.trim(),
                            tipo: document.getElementById("rol").value.trim()
                        })
                    });
                    //Se resetea el id y el form para que no haya problema al crear o editar un nuevo usuario
                    currentUserId = null;                                   
                    formulario.reset();             
                }   

                if(response.ok){                    
                    const result = await response.json();              
     
                    if(result.success){
                        alertBox.classList.add("alert-success");
                        alertBox.textContent = result.message;
                        setTimeout(()=>{
                            window.location.href = "dashboard.html";
                        }, 1000);
                    }else{
                        alertBox.classList.add("alert-danger");
                        alertBox.textContent = result.message;
                        setTimeout(()=>{
                            window.location.href = "dashboard.html";
                        }, 1000);
                    }
                }                
            }                   
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    }); 
});