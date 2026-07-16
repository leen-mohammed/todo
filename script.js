// مصفوفة تخزين المهام وقاموس اللغات
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentLang = localStorage.getItem('lang') || 'ar';
let currentTheme = localStorage.getItem('theme') || 'light';

const translations = {
    ar: {
        title: "قائمة المهام",
        placeholder: "أضف مهمة جديدة...",
        add: "إضافة",
        all: "الكل",
        pending: "قيد التنفيذ",
        completed: "المكتملة",
        remaining: "مهام متبقية"
    },
    en: {
        title: "Task Manager",
        placeholder: "Add a new task...",
        add: "Add",
        all: "All",
        pending: "Pending",
        completed: "Completed",
        remaining: "tasks left"
    }
};

// عناصر واجهة المستخدم
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

// التجهيز المبدئي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    setTheme(currentTheme);
    setLanguage(currentLang);
    renderTasks();
});

// ميزة تغيير المظهر (Dark / Light)
themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(theme);
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ميزة تغيير اللغة (AR / EN)
langToggle.addEventListener('click', () => {
    const lang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(lang);
});

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // تغيير الاتجاه واللغة في ترويسة HTML
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث النصوص
    document.getElementById('app-title').textContent = translations[lang].title;
    taskInput.placeholder = translations[lang].placeholder;
    document.getElementById('add-btn-text').textContent = translations[lang].add;
    document.getElementById('filter-all').textContent = translations[lang].all;
    document.getElementById('filter-pending').textContent = translations[lang].pending;
    document.getElementById('filter-completed').textContent = translations[lang].completed;
    document.getElementById('footer-text').textContent = translations[lang].remaining;
    
    langToggle.textContent = lang === 'ar' ? 'EN' : 'العربية';
    updatePendingCount();
}

// إضافة مهمة جديدة
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = '';
}

// حذف مهمة
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// تغيير حالة المهمة (مكتملة / غير مكتملة)
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

// فلترة المهام
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// حفظ البيانات في LocalStorage وعرضها
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content" onclick="toggleTask(${task.id})">
                <i class="${task.completed ? 'fas fa-check-circle' : 'far fa-circle'} task-checkbox"></i>
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        taskList.appendChild(li);
    });

    updatePendingCount();
}

function updatePendingCount() {
    const pending = tasks.filter(task => !task.completed).length;
    document.getElementById('pending-count').textContent = pending;
}