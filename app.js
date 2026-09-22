// ========================================
// BITÁCORA
// ========================================


// ========================================
// ELEMENTOS
// ========================================

const addButton =
    document.getElementById("addButton");

const taskModal =
    document.getElementById("taskModal");

const cancelButton =
    document.getElementById("cancelButton");

const saveButton =
    document.getElementById("saveButton");

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

const currentDate =
    document.getElementById("currentDate");

const modalTitle =
    document.querySelector(
        "#taskModal h2"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const dateFilter =
    document.getElementById(
        "dateFilter"
    );

const clearDateButton =
    document.getElementById(
        "clearDateButton"
    );

const taskDate =
    document.getElementById(
        "taskDate"
    );

const customDateContainer =
    document.getElementById(
        "customDateContainer"
    );

const customTaskDate =
    document.getElementById(
        "customTaskDate"
    );


// ========================================
// DATOS
// ========================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            "bitacoraTasks"
        )
    ) || [];


let editingTaskId = null;


// ========================================
// FECHA ACTUAL
// ========================================

const today =
    new Date();


currentDate.textContent =
    today.toLocaleDateString(
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

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// SUMAR / RESTAR DÍAS
// ========================================

function addDays(date, days) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;
}


// ========================================
// CONVERTIR FECHA DE TAREA
// ========================================

function getTaskDate(task) {

    if (task.dateKey) {

        return task.dateKey;
    }


    if (task.date) {

        const date =
            new Date(task.date);

        return getLocalDateKey(
            date
        );
    }


    return getLocalDateKey(
        new Date()
    );
}


// ========================================
// FORMATEAR FECHA
// ========================================

function formatDate(dateKey) {

    const [
        year,
        month,
        day
    ] =
        dateKey
            .split("-")
            .map(Number);


    const date =
        new Date(
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
// VERIFICAR HOY
// ========================================

function isToday(dateKey) {

    return (
        dateKey ===
        getLocalDateKey(
            new Date()
        )
    );
}


// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizeText(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


// ========================================
// OBTENER TAREAS FILTRADAS
// ========================================

function getFilteredTasks() {

    const searchText =
        normalizeText(
            searchInput.value.trim()
        );


    const selectedStatus =
        statusFilter.value;


    const selectedDate =
        dateFilter.value;


    return tasks.filter(
        task => {


            // ----------------------------
            // BÚSQUEDA
            // ----------------------------

            const matchesSearch =

                searchText === "" ||

                normalizeText(
                    task.text
                ).includes(
                    searchText
                );


            // ----------------------------
            // ESTADO
            // ----------------------------

            let matchesStatus =
                true;


            if (
                selectedStatus ===
                "pending"
            ) {

                matchesStatus =
                    task.completed === false;
            }


            if (
                selectedStatus ===
                "completed"
            ) {

                matchesStatus =
                    task.completed === true;
            }


            // ----------------------------
            // FECHA
            // ----------------------------

            let matchesDate =
                true;


            if (
                selectedDate !== ""
            ) {

                matchesDate =
                    getTaskDate(task) ===
                    selectedDate;
            }


            // ----------------------------
            // RESULTADO
            // ----------------------------

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        }
    );
}


// ========================================
// MOSTRAR TAREAS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    // ====================================
    // SIN RESULTADOS
    // ====================================

    if (
        filteredTasks.length === 0
    ) {

        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.classList.add(
            "empty-message"
        );


        if (
            tasks.length === 0
        ) {

            emptyMessage.textContent =
                "No tienes pendientes registrados.";

        } else {

            emptyMessage.textContent =
                "No encontramos tareas con estos filtros.";
        }


        taskList.appendChild(
            emptyMessage
        );

        return;
    }


    // ====================================
    // AGRUPAR POR FECHA
    // ====================================

    const groupedTasks = {};


    filteredTasks.forEach(
        task => {

            const dateKey =
                getTaskDate(task);


            if (
                !groupedTasks[dateKey]
            ) {

                groupedTasks[dateKey] =
                    [];
            }


            groupedTasks[
                dateKey
            ].push(task);

        }
    );


    // ====================================
    // ORDENAR FECHAS
    // ====================================

    const dates =
        Object.keys(
            groupedTasks
        ).sort(
            (a, b) =>
                b.localeCompare(a)
        );


    // ====================================
    // CREAR GRUPOS
    // ====================================

    dates.forEach(
        dateKey => {

            const dayContainer =
                document.createElement(
                    "section"
                );


            dayContainer.classList.add(
                "day-group"
            );


            // ----------------------------
            // TÍTULO DEL DÍA
            // ----------------------------

            const dayTitle =
                document.createElement(
                    "h2"
                );


            dayTitle.classList.add(
                "day-title"
            );


            if (
                isToday(dateKey)
            ) {

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


            // ----------------------------
            // LISTA DEL DÍA
            // ----------------------------

            const dayTaskList =
                document.createElement(
                    "div"
                );


            dayTaskList.classList.add(
                "task-list"
            );


            groupedTasks[
                dateKey
            ].forEach(
                task => {

                    const taskElement =
                        createTaskElement(
                            task
                        );


                    dayTaskList.appendChild(
                        taskElement
                    );

                }
            );


            dayContainer.appendChild(
                dayTaskList
            );


            taskList.appendChild(
                dayContainer
            );

        }
    );
}


// ========================================
// CREAR ELEMENTO DE TAREA
// ========================================

function createTaskElement(task) {

    const taskElement =
        document.createElement(
            "div"
        );


    taskElement.classList.add(
        "task"
    );


    // ====================================
    // CHECKBOX
    // ====================================

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


    // ====================================
    // TEXTO
    // ====================================

    const text =
        document.createElement(
            "span"
        );


    text.classList.add(
        "task-text"
    );


    /*
        textContent mantiene el texto
        seguro y white-space: pre-wrap
        respeta los saltos de línea.
    */

    text.textContent =
        task.text;


    if (
        task.completed
    ) {

        text.classList.add(
            "completed"
        );
    }


    // ====================================
    // ACCIONES
    // ====================================

    const actions =
        document.createElement(
            "div"
        );


    actions.classList.add(
        "task-actions"
    );


    // ====================================
    // EDITAR
    // ====================================

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


    // ====================================
    // ELIMINAR
    // ====================================

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

            <path
                d="M19 6l-1 14H6L5 6"
            />

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


    // ====================================
    // CAMBIAR ESTADO
    // ====================================

    checkbox.addEventListener(
        "change",
        () => {

            task.completed =
                checkbox.checked;


            saveTasks();

            renderTasks();

        }
    );


    // ====================================
    // ARMAR ELEMENTO
    // ====================================

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
// BUSCADOR
// ========================================

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();

    }
);


// ========================================
// FILTRO DE ESTADO
// ========================================

statusFilter.addEventListener(
    "change",
    () => {

        renderTasks();

    }
);


// ========================================
// FILTRO DE FECHA
// ========================================

dateFilter.addEventListener(
    "change",
    () => {

        if (
            dateFilter.value !== ""
        ) {

            clearDateButton.classList.remove(
                "hidden"
            );

        } else {

            clearDateButton.classList.add(
                "hidden"
            );
        }


        renderTasks();

    }
);


// ========================================
// LIMPIAR FILTRO DE FECHA
// ========================================

clearDateButton.addEventListener(
    "click",
    () => {

        dateFilter.value = "";

        clearDateButton.classList.add(
            "hidden"
        );

        renderTasks();

    }
);


// ========================================
// MOSTRAR / OCULTAR FECHA PERSONALIZADA
// ========================================

taskDate.addEventListener(
    "change",
    () => {

        if (
            taskDate.value ===
            "custom"
        ) {

            customDateContainer.classList.remove(
                "hidden"
            );


            if (
                customTaskDate.value === ""
            ) {

                customTaskDate.value =
                    getLocalDateKey(
                        new Date()
                    );
            }

        } else {

            customDateContainer.classList.add(
                "hidden"
            );

        }

    }
);


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


        taskDate.value =
            "today";


        customTaskDate.value =
            "";


        customDateContainer.classList.add(
            "hidden"
        );


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
                task.id ===
                taskId
        );


    if (!task) return;


    editingTaskId =
        taskId;


    modalTitle.textContent =
        "Editar pendiente";


    taskInput.value =
        task.text;


    /*
        Al editar mostramos directamente
        la fecha actual de la tarea.
    */

    taskDate.value =
        "custom";


    customTaskDate.value =
        getTaskDate(task);


    customDateContainer.classList.remove(
        "hidden"
    );


    taskModal.classList.remove(
        "hidden"
    );


    taskInput.focus();

}


// ========================================
// ELIMINAR
// ========================================

function deleteTask(taskId) {

    const task =
        tasks.find(
            task =>
                task.id ===
                taskId
        );


    if (!task) return;


    const confirmed =
        confirm(
            `¿Quieres eliminar "${task.text}"?`
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task =>
                task.id !==
                taskId
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


    taskDate.value =
        "today";


    customTaskDate.value =
        "";


    customDateContainer.classList.add(
        "hidden"
    );


    editingTaskId =
        null;

}


// ========================================
// OBTENER FECHA SELECCIONADA
// ========================================

function getSelectedTaskDate() {

    const now =
        new Date();


    // FECHA PERSONALIZADA

    if (
        taskDate.value ===
        "custom"
    ) {

        return customTaskDate.value;
    }


    // MAÑANA

    if (
        taskDate.value ===
        "tomorrow"
    ) {

        return getLocalDateKey(
            addDays(
                now,
                1
            )
        );
    }


    // AYER

    if (
        taskDate.value ===
        "yesterday"
    ) {

        return getLocalDateKey(
            addDays(
                now,
                -1
            )
        );
    }


    // HOY

    return getLocalDateKey(
        now
    );
}


// ========================================
// GUARDAR / EDITAR
// ========================================

saveButton.addEventListener(
    "click",
    () => {

        const text =
            taskInput.value.trim();


        if (
            text === ""
        ) {

            taskInput.focus();

            return;
        }


        // ==================================
        // EDITAR
        // ==================================

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


                if (
                    customTaskDate.value !== ""
                ) {

                    task.dateKey =
                        customTaskDate.value;
                }

            }

        }


        // ==================================
        // CREAR
        // ==================================

        else {

            const selectedDate =
                getSelectedTaskDate();


            if (
                taskDate.value ===
                "custom" &&
                selectedDate === ""
            ) {

                customTaskDate.focus();

                return;
            }


            const newTask = {

                id:
                    Date.now(),

                text:
                    text,

                completed:
                    false,

                dateKey:
                    selectedDate

            };


            tasks.push(
                newTask
            );

        }


        saveTasks();

        renderTasks();

        closeModal();

    }
);


// ========================================
// IMPORTANTE:
//
// NO HAY EVENTO "ENTER = GUARDAR"
//
// Enter queda completamente libre
// para crear saltos de línea dentro
// del textarea.
// ========================================


// ========================================
// ESC
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
// INICIAR
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

                .then(
                    () => {

                        console.log(
                            "Service Worker registrado correctamente."
                        );

                    }
                )

                .catch(
                    error => {

                        console.error(
                            "Error al registrar el Service Worker:",
                            error
                        );

                    }
                );

        }
    );
}