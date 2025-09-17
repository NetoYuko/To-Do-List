//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
const toggleBtn = document.querySelector("#toggle-theme");
const html = document.documentElement;

let oldInputValue; // armazena o texto antigo da tarefa que está sendo editada

//Funções

// ===============================
// cria uma nova tarefa
// ===============================

const saveTodo = (text, done = 0, save = 1) => {

    // cria a div que representa a tarefa
    const todo = document.createElement("div");
    todo.classList.add("todo");

    // título da tarefa
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text
    todo.appendChild(todoTitle);

    // botão de concluir
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    // botão de editar
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    // botão de remover
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    //utilizando dados da localStorage

    // se já estava concluída, adiciona a classe "done"
    if(done) {
        todo.classList.add("done");
    };

    // se for nova tarefa (save = 1), salva no localStorage
    if(save) {
        saveTodoLocalStorage({ text, done });
    };

     // adiciona a tarefa na lista
    todoList.appendChild(todo);

    todoInput.value = ""; //limpa input depois de adicioando
    todoInput.focus();
};

// ===============================
// alterna entre formulários
// ===============================

const toggleForms = () =>{ 
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// ===============================
// atualiza o texto de uma tarefa
// ===============================

const updateTodo = (text) =>{ 
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3");

        // procura a tarefa com o texto antigo
        if(todoTitle.innerText === oldInputValue){
            // troca pelo novo texto
            todoTitle.innerText = text;

            // atualiza também no localStorage
            updateTodoLocalStorage(oldInputValue, text);
        };
    });
};

// ===============================
// busca tarefas pelo texto
// ===============================

const getSearchTodos = (search) =>{ 

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex"; // mostra por padrão

        // se não bate com a busca, esconde
        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none";
        };
    });
};

// ===============================
// filtra tarefas (todos, feitos, a fazer)
// ===============================

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue){
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;
        
        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;
        
        default:
            break;
    };
};

//eventos

// ==================
// Adicionar Tarefa
// ==================

todoForm.addEventListener("submit", (e) =>{
    e.preventDefault(); // evita recarregar a página

    const inputValue = todoInput.value; //obtém o valor do input

    if(inputValue) {
        saveTodo(inputValue);
    };
});

// ==================
// Clique nos botões dentro da lista
// ==================

document.addEventListener("click", (e) =>{
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    };

    // concluir tarefa
    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);
    };

     // remover tarefa
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
    };

    // editar tarefa
    if(targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    };
});

// ==================
// Cancelar Edição
// ==================

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    editInput.value = "";
    toggleForms();
});

// ==================
// Confirmar Edição
// ==================

editForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    const editInputValue = editInput.value;
    
    if(editInputValue){
        updateTodo(editInputValue);
    };

    editInput.value = "";
    toggleForms();
});

// ==================
// Buscar tarefas
// ==================

searchInput.addEventListener("keyup", (e) =>{
    const search = e.target.value;

    getSearchTodos(search);
});

// ==================
// Limpar Campo de busca
// ==================

eraseBtn.addEventListener("click", (e) =>{
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup")); // força atualizar a lista
});

// ==================
// Alterar Filtro
// ==================

filterBtn.addEventListener("change", (e) =>{

    const filterValue = e.target.value;

    filterTodos(filterValue);
});

// Mudança de tema 

// Verifica se já existe tema salvo
    if (localStorage.getItem("theme") === "dark") {
      html.setAttribute("data-theme", "dark");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
      }
    });

// Local Storage

const getTodosLocalStorage = () =>{
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;
};


// carrega as tarefas salvas quando abre a página
const loadTodos = () => {
        const todos = getTodosLocalStorage();

        todos.forEach((todo) => {
            saveTodo(todo.text, todo.done, 0); // 0 = não salvar de novo
        });
};


// salva uma nova tarefa
const saveTodoLocalStorage = (todo) => {

    // Todos os to-dos da ls
    const todos = getTodosLocalStorage();

    // add o novo todo no arr
    todos.push(todo);

    // salvar tudo na ls
    localStorage.setItem("todos", JSON.stringify(todos));
};

// remove uma tarefa pelo texto
const removeTodoLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();

    const filteredTodos= todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

// alterna o status de concluída/não concluída
const updateTodoStatusLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

// atualiza o texto de uma tarefa
const updateTodoLocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos(); // carrega as tarefas logo que a página abre