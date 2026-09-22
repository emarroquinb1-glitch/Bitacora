// ========================================
// BITÁCORA
// ========================================


// ========================================
// ELEMENTOS DE LA PÁGINA
// ========================================

const addButton = document.getElementById("addButton");
const taskModal = document.getElementById("taskModal");
const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const currentDate = document.getElementById("currentDate");

const modalTitle = document.querySelector("#taskModal h2");


// ========================================
// DATOS
// ========================================

let tasks = JSON.parse(
    localStorage.getItem("bitacoraTasks")
) || [];

let editingTaskId = null;


// ========================================
// FECHA ACTUAL
// ========================================

const today = new Date();

currentDate.textContent = today.toLocaleDateString(
    "es-GT",
    {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
);


// ========================================
// OBTENER FECHA LOCAL
// ========================================

function getLocalDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// CONVERTIR FECHA DE TAREA
// ========================================

function getTaskDate(task) {

    if (task.dateKey) {
        return task.dateKey;
    }

    if (task.date) {

        const date = new Date(
            task.date
        );

        return getLocalDateKey(
            date
        );

    }

    return getLocalDateKey(
        new Date()
    );
}


// ========================================
// FORMATEAR FECHA PARA MOSTRAR
// ========================================

function formatDate(dateKey) {

    const [
        year,
        month,
        day
    ] = dateKey
        .split("-")
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day
    );

    return date.toLocaleDateString(
        "es-GT",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );
}


// ========================================
// VERIFICAR SI ES HOY
// ========================================

function isToday(dateKey) {

    return dateKey === getLocalDateKey(
        new Date()
    );
}


// ========================================
// MOSTRAR TAREAS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.classList.add(
            "empty-message"
        );

        emptyMessage.textContent =
            "No tienes pendientes registrados.";

        taskList.appendChild(
            emptyMessage
        );

        return;
    }


    // ========================================
    // AGRUPAR TAREAS POR FECHA
    // ========================================

    const groupedTasks = {};

    tasks.forEach(task => {

        const dateKey =
            getTaskDate(task);

        if (!groupedTasks[dateKey]) {

            groupedTasks[dateKey] = [];

        }

        groupedTasks[dateKey].push(
            task
        );

    });


    // ========================================
    // ORDENAR FECHAS
    // ========================================

    const dates = Object.keys(
        groupedTasks
    ).sort(
        (a, b) =>
            b.localeCompare(a)
    );


    // ========================================
    // CREAR GRUPOS
    // ========================================

    dates.forEach(dateKey => {

        const dayContainer =
            document.createElement(
                "section"
            );

        dayContainer.classList.add(
            "day-group"
        );


        // ========================================
        // TÍTULO DEL DÍA
        // ========================================

        const dayTitle =
            document.createElement(
                "h2"
            );

        dayTitle.classList.add(
            "day-title"
        );

        if (isToday(dateKey)) {

            dayTitle.textContent =
                "Hoy";

        } else {

            dayTitle.textContent =
                formatDate(
                    dateKey
                );

        }

        dayContainer.appendChild(
            dayTitle
        );


        // ========================================
        // LISTA DEL DÍA
        // ========================================

        const dayTaskList =
            document.createElement(
                "div"
            );

        dayTaskList.classList.add(
            "task-list"
        );


        groupedTasks[
            dateKey
        ].forEach(task => {

            const taskElement =
                createTaskElement(
                    task
                );

            dayTaskList.appendChild(
                taskElement
            );

        });


        dayContainer.appendChild(
            dayTaskList
        );

        taskList.appendChild(
            dayContainer
        );

    });

}


// ========================================
// CREAR ELEMENTO DE UNA TAREA
// ========================================

function createTaskElement(task) {

    const taskElement =
        document.createElement(
            "div"
        );

    taskElement.classList.add(
        "task"
    );


    // ========================================
    // CHECKBOX
    // ========================================

    const checkbox =
        document.createElement(
            "input"
        );

    checkbox.type =
        "checkbox";

    checkbox.classList.add(
        "task-checkbox"
    );

    checkbox.checked =
        task.completed;


    // ========================================
    // TEXTO
    // ========================================

    const text =
        document.createElement(
            "span"
        );

    text.classList.add(
        "task-text"
    );

    text.textContent =
        task.text;

    if (task.completed) {

        text.classList.add(
            "completed"
        );

    }


    // ========================================
    // BOTONES
    // ========================================

    const actions =
        document.createElement(
            "div"
        );

    actions.classList.add(
        "task-actions"
    );


    // ========================================
    // BOTÓN EDITAR
    // ========================================

    const editButton =
        document.createElement(
            "button"
        );

    editButton.classList.add(
        "edit-button"
    );

    editButton.title =
        "Editar pendiente";

    editButton.setAttribute(
        "aria-label",
        "Editar pendiente"
    );

    editButton.innerHTML = `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 20h9"/>
            <path
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
            />
        </svg>
    `;

    editButton.addEventListener(
        "click",
        () => {

            openEditModal(
                task.id
            );

        }
    );


    // ========================================
    // BOTÓN ELIMINAR
    // ========================================

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.classList.add(
        "delete-button"
    );

    deleteButton.title =
        "Eliminar pendiente";

    deleteButton.setAttribute(
        "aria-label",
        "Eliminar pendiente"
    );

    deleteButton.innerHTML = `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M3 6h18"/>
            <path d="M8 6V4h8v2"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v5"/>
            <path d="M14 11v5"/>
        </svg>
    `;

    deleteButton.addEventListener(
        "click",
        () => {

            deleteTask(
                task.id
            );

        }
    );


    // ========================================
    // CAMBIAR ESTADO
    // ========================================

    checkbox.addEventListener(
        "change",
        () => {

            task.completed =
                checkbox.checked;

            saveTasks();

            renderTasks();

        }
    );


    // ========================================
    // ARMAR ELEMENTO
    // ========================================

    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );

    taskElement.appendChild(
        checkbox
    );

    taskElement.appendChild(
        text
    );

    taskElement.appendChild(
        actions
    );

    return taskElement;
}


// ========================================
// GUARDAR TAREAS
// ========================================

function saveTasks() {

    localStorage.setItem(
        "bitacoraTasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// ABRIR MODAL - CREAR
// ========================================

addButton.addEventListener(
    "click",
    () => {

        editingTaskId =
            null;

        modalTitle.textContent =
            "Nuevo pendiente";

        taskInput.value =
            "";

        taskModal.classList.remove(
            "hidden"
        );

        taskInput.focus();

    }
);


// ========================================
// ABRIR MODAL - EDITAR
// ========================================

function openEditModal(taskId) {

    const task =
        tasks.find(
            task =>
                task.id === taskId
        );

    if (!task) {
        return;
    }

    editingTaskId =
        taskId;

    modalTitle.textContent =
        "Editar pendiente";

    taskInput.value =
        task.text;

    taskModal.classList.remove(
        "hidden"
    );

    taskInput.focus();

}


// ========================================
// ELIMINAR TAREA
// ========================================

function deleteTask(taskId) {

    const task =
        tasks.find(
            task =>
                task.id === taskId
        );

    if (!task) {
        return;
    }

    const confirmed =
        confirm(
            `¿Quieres eliminar "${task.text}"?`
        );

    if (!confirmed) {
        return;
    }

    tasks =
        tasks.filter(
            task =>
                task.id !== taskId
        );

    saveTasks();

    renderTasks();

}


// ========================================
// CERRAR MODAL
// ========================================

cancelButton.addEventListener(
    "click",
    closeModal
);


function closeModal() {

    taskModal.classList.add(
        "hidden"
    );

    taskInput.value =
        "";

    editingTaskId =
        null;

}


// ========================================
// GUARDAR / EDITAR
// ========================================

saveButton.addEventListener(
    "click",
    () => {

        const text =
            taskInput.value.trim();


        // ========================================
        // VALIDAR
        // ========================================

        if (text === "") {

            taskInput.focus();

            return;

        }


        // ========================================
        // EDITAR
        // ========================================

        if (
            editingTaskId !== null
        ) {

            const task =
                tasks.find(
                    task =>
                        task.id ===
                        editingTaskId
                );

            if (task) {

                task.text =
                    text;

            }

        }


        // ========================================
        // CREAR
        // ========================================

        else {

            const now =
                new Date();

            const newTask = {

                id:
                    Date.now(),

                text:
                    text,

                completed:
                    false,

                dateKey:
                    getLocalDateKey(
                        now
                    )

            };

            tasks.push(
                newTask
            );

        }


        // ========================================
        // GUARDAR
        // ========================================

        saveTasks();

        renderTasks();

        closeModal();

    }
);


// ========================================
// ENTER PARA GUARDAR
// ========================================

taskInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            saveButton.click();

        }

    }
);


// ========================================
// ESC PARA CERRAR
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);


// ========================================
// INICIAR APLICACIÓN
// ========================================

renderTasks();


// ========================================
// SERVICE WORKER
// ========================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(() => {

                    console.log(
                        "Service Worker registrado correctamente."
                    );

                })
                .catch(error => {

                    console.error(
                        "Error al registrar el Service Worker:",
                        error
                    );

                });

        }
    );

}