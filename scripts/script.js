

    document.addEventListener("DOMContentLoaded", () => {
        // Define los elementos del formulario
        const inputGet1Id = document.getElementById("inputGet1Id");
        const inputPostNombre = document.getElementById("inputPostNombre");
        const inputPostApellido = document.getElementById("inputPostApellido");
        const inputPutId = document.getElementById("inputPutId");
        const inputPutNombre = document.getElementById("inputPutNombre");
        const inputPutApellido = document.getElementById("inputPutApellido");
        const inputDelete = document.getElementById("inputDelete");
        const resultsList = document.getElementById("results");

        // Define los botones del formulario
        const btnGet1 = document.getElementById("btnGet1");
        const btnPost = document.getElementById("btnPost");
        const btnPut = document.getElementById("btnPut");
        const btnDelete = document.getElementById("btnDelete");
        const btnSendChanges = document.getElementById("btnSendChanges");

        inputPostNombre.addEventListener("input", function(){
            if(inputPostNombre.value.trim() !== "" && inputPostApellido.value.trim() !== ""){
            btnPost.removeAttribute("disabled");
            } else{
                btnPost.setAttribute("disabled", "disabled");
            }
        })

        inputPostApellido.addEventListener("input", function(){
            if(inputPostNombre.value.trim() !== "" && inputPostApellido.value.trim() !== ""){
                btnPost.removeAttribute("disabled");
            } else{
                btnPost.setAttribute("disabled", "disabled");
            }
        })
        
        inputPutId.addEventListener("input", function(){
            if(inputPutId.value.trim() !== ""){
                btnPut.removeAttribute("disabled");
            } else{
                btnPut.setAttribute("disabled", "disabled")
            }
        })

        inputDelete.addEventListener("input", function(){
            if(inputDelete.value.trim() !== ""){
                btnDelete.removeAttribute("disabled");
            } else{
                btnDelete.setAttribute("disabled", "disabled");
            }
        })
          
        // Boton de buscar por id
        btnGet1.addEventListener("click", () => {
            const userId = inputGet1Id.value.trim();
        
            if (!userId) {
                // Si el campo de entrada está vacío, muestra todos los elementos de la API
                fetch("https://65423669f0b8287df1ffb52d.mockapi.io/users")
                    .then((response) => {
                        if (response.status === 404) {
                            throw new Error("Registro no encontrado");
                        }
                        return response.json();
                    })
                    .then((data) => displayUsers(data))
                    .catch((error) => displayError(error.message));
            } else {
                // Si el campo no está vacío, realiza la búsqueda por ID
                fetch(`https://65423669f0b8287df1ffb52d.mockapi.io/users/${userId}`)
                    .then((response) => {
                        if (response.status === 404) {
                            throw new Error("Registro no encontrado");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.id) {
                            displayResult(data);
                        } else {
                            alert("El ID no se ha encontrado.");
                        }
                    })
                    .catch((error) => displayError(error.message));
            }
        });
        


        // Boton para agregar
        btnPost.addEventListener("click", () => {

            
            //Obtengo los inputs
            const nombre = inputPostNombre.value; 
            const apellido = inputPostApellido.value;
            const data = { name: nombre, lastname: apellido }; //Obtener los nombres y apellidos

            fetch("https://65423669f0b8287df1ffb52d.mockapi.io/users", { //Obtener todos los users
                method: "POST", //Metodo postear
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    displayResult(data); //Llama a la funcion para mostrar los resutlados
                    //Limpia los inputs
                    inputPostNombre.value = "";
                    inputPostApellido.value = "";
                })
                .catch((error) =>  alert("Algo salió mal...")); //Atrapa el error
        });

        // Boton para modificar
        btnPut.addEventListener("click", () => { 
            const modal = document.getElementById("dataModal");
            const dataModal = new bootstrap.Modal(modal);
            dataModal.show();

        })

        // Botón "Guardar cambios" en el modal de edición
        btnSendChanges.addEventListener("click", () => {
            // Obtengo el ID, nombre y apellido del modal
            const userId = inputPutId.value;
            const nombre = inputPutNombre.value;
            const apellido = inputPutApellido.value;
            const data = { name: nombre, lastname: apellido };

            fetch(`https://65423669f0b8287df1ffb52d.mockapi.io/users/${userId}`, { 
                method: "PUT", //Metodo put
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(data), 
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.id) {
                        displayResult(data);
                    } else {
                        alert("El ID no se ha encontrado.");
                    }
                })
                .catch((error) => displayError(error.message));
        });


        // Boton eliminar
        btnDelete.addEventListener("click", () => {
            const userId = inputDelete.value;
            fetch(`https://65423669f0b8287df1ffb52d.mockapi.io/users/${userId}`, {
                method: "DELETE",
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    resultsList.innerHTML = `Registro eliminado`;
                    inputDelete.value = "";
                } else {
                    alert("El ID no se ha encontrado.");
                }
            })
          
                
                .catch((error) => displayError(error.message));
            })


        function displayResult(result) { //Metodo para mostrar cosas 
            resultsList.innerHTML = `<li>ID: ${result.id}, Nombre: ${result.name}, Apellido: ${result.lastname}</li>`;
        }

       function displayUsers(result) {
        // Limpia la lista antes de agregar nuevos elementos
         resultsList.innerHTML = "";
    
        for (const user of result) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `ID: ${user.id} <br> Nombre: ${user.name} <br> Apellido: ${user.lastname} <br> <br>`;
            resultsList.appendChild(listItem);
         }
}


        function displayError(message) { //Mostrar el error 
            resultsList.innerHTML = `<li>Error: ${message}</li>`;
        }

        // Habilita/deshabilita el botón "Guardar cambios" según los campos de edición del modal
        inputPutNombre.addEventListener("input", enableSaveChangesButton);
        inputPutApellido.addEventListener("input", enableSaveChangesButton);

        //Boton de guardar cambios
        function enableSaveChangesButton() {
            const nombre = inputPutNombre.value;
            const apellido = inputPutApellido.value;
            btnSendChanges.disabled = !nombre || !apellido;
        }


    });
