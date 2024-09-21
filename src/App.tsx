// src/App.tsx
import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./components/Modal";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import UserModal from "./components/UserModal"; // Новий компонент

// Інтерфейси для типізації
interface Task {
  id: number;
  title: string;
  dueDate: string; // ISO формат дати
  description: string;
  tags: string[];
  priority: "Low" | "Medium" | "High";
  projectId?: number;
  completed: boolean; // Додане поле для позначення виконання
}

interface Project {
  id: number;
  name: string;
}

interface UserInfo {
  fullName: string;
  position: string;
  photo: string; // URL або base64 рядок для фотографії
  background: string; // URL або base64 рядок для фонового зображення
}

// Головний компонент App
const App: React.FC = () => {
  // Стан задач та проектів
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Стан для форми додавання задачі
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    dueDate: "",
    description: "",
    tags: [],
    priority: "Medium",
    projectId: undefined,
  });

  // Стан для форми додавання проекту
  const [newProject, setNewProject] = useState<string>("");

  // Стан для пошуку та фільтрації
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<
    "day" | "week" | "month" | ""
  >("");
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null); // Новий фільтр

  // Стан для модального вікна додавання задачі та проекту
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Стан для фільтрів (показати/приховати)
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false);

  // Стан для виду списку задач
  const [taskView, setTaskView] = useState<"list" | "tiles">("list");

  // Стан для модального вікна користувача
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);

  // Стан для інформації про користувача
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "Володимир Федоренко",
    position: "Керівник технічної підтримки",
    photo: "", // Початкова фотографія порожня
    background: "", // Початковий фон порожній
  });

  // Завантаження даних з localStorage при ініціалізації
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedProjects = localStorage.getItem("projects");
    const storedUserInfo = localStorage.getItem("userInfo");

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Збереження задач у localStorage щоразу, коли tasks змінюється
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Збереження проектів у localStorage щоразу, коли projects змінюється
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Збереження інформації про користувача
  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  // Додавання нової задачі
  const addTask = () => {
    if (newTask.title.trim() === "") {
      alert("Назва задачі не може бути порожньою");
      return;
    }
    const task: Task = {
      id: Date.now(),
      ...newTask,
      completed: false, // Початково не виконано
    };
    setTasks([...tasks, task]);
    // Очистити форму
    setNewTask({
      title: "",
      dueDate: "",
      description: "",
      tags: [],
      priority: "Medium",
      projectId: undefined,
    });
    // Закрити модальне вікно
    setIsModalOpen(false);
  };

  // Видалення задачі
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Позначення задачі як виконаної
  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Додавання нового проекту
  const addProject = () => {
    if (newProject.trim() === "") {
      alert("Назва проекту не може бути порожньою");
      return;
    }
    // Перевірка унікальності назви проекту
    if (
      projects.some(
        (project) => project.name.toLowerCase() === newProject.toLowerCase()
      )
    ) {
      alert("Проект з такою назвою вже існує");
      return;
    }
    const project: Project = {
      id: Date.now(),
      name: newProject,
    };
    setProjects([...projects, project]);
    setNewProject("");
  };

  // Фільтрація та пошук задач
  const filteredTasks = tasks.filter((task) => {
    // Фільтр за пошуковим запитом
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Фільтр за пріоритетом
    const matchesPriority = filterPriority
      ? task.priority === filterPriority
      : true;

    // Фільтр за тегами
    const matchesTags =
      filterTags.length > 0
        ? filterTags.every((tag) => task.tags.includes(tag))
        : true;

    // Фільтр за датою
    let matchesDate = true;
    if (filterDateRange) {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      switch (filterDateRange) {
        case "day":
          matchesDate = taskDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekFromNow = new Date();
          weekFromNow.setDate(today.getDate() + 7);
          matchesDate = taskDate >= today && taskDate <= weekFromNow;
          break;
        case "month":
          const monthFromNow = new Date();
          monthFromNow.setMonth(today.getMonth() + 1);
          matchesDate = taskDate >= today && taskDate <= monthFromNow;
          break;
        default:
          matchesDate = true;
      }
    }

    // Фільтр за виконаними задачами
    const matchesCompleted =
      filterCompleted === null ? true : task.completed === filterCompleted;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesTags &&
      matchesDate &&
      matchesCompleted
    );
  });

  return (
    <div
      className="App"
      style={{
        backgroundImage: userInfo.background
          ? `url(${userInfo.background})`
          : "none",
      }}
    >
      <h1>Список справ</h1>

      {/* Верхній правий блок для кнопки користувача */}
      <div className="user-button-container">
        <button
          className="user-button"
          onClick={() => setIsUserModalOpen(true)}
        >
          {userInfo.photo ? (
            <img src={userInfo.photo} alt="User" className="user-photo" />
          ) : (
            <div className="user-placeholder">U</div>
          )}
          <span className="user-name">{userInfo.fullName}</span>
        </button>
      </div>

      {/* Контейнер для кнопок та перемикача */}
      <div className="top-controls">
        {/* Кнопка для відкриття фільтрів */}
        <button
          className="toggle-filters-button specific-button"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          {isFiltersVisible ? "Приховати фільтри" : "Показати фільтри"}
        </button>

        {/* Кнопка для відкриття модального вікна */}
        <button
          className="create-task-button specific-button"
          onClick={() => setIsModalOpen(true)}
        >
          Створити завдання
        </button>

        {/* Перемикач для виду задач */}
        <div className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={taskView === "tiles"}
              onChange={() =>
                setTaskView(taskView === "list" ? "tiles" : "list")
              }
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">
            {taskView === "list" ? "Список" : "Плитки"}
          </span>
        </div>
      </div>

      {/* Фільтри та пошук */}
      {isFiltersVisible && (
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterDateRange={filterDateRange}
          setFilterDateRange={setFilterDateRange}
          filterCompleted={filterCompleted}
          setFilterCompleted={setFilterCompleted}
        />
      )}

      {/* Список задач */}
      <TaskList
        tasks={filteredTasks}
        projects={projects}
        deleteTask={deleteTask}
        toggleTaskCompletion={toggleTaskCompletion}
        view={taskView}
      />

      {/* Модальне вікно для додавання задачі та проекту */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="add-task">
          <h2>Додати задачу</h2>
          <input
            type="text"
            placeholder="Назва задачі"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <div className="date-picker">
            <input
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>
          <textarea
            placeholder="Опис задачі"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            placeholder="Теги (через кому)"
            value={newTask.tags.join(",")}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                tags: e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== ""),
              })
            }
          />
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value as Task["priority"],
              })
            }
          >
            <option value="Low">Низький</option>
            <option value="Medium">Середній</option>
            <option value="High">Високий</option>
          </select>
          <select
            value={newTask.projectId || ""}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                projectId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">Без проекту</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button className="add-task-button" onClick={addTask}>
            Додати задачу
          </button>

          {/* Розділ для створення проекту */}
          <div className="add-project-in-modal">
            <h2>Додати проект</h2>
            <input
              type="text"
              placeholder="Назва проекту"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
            />
            <button className="add-project-button" onClick={addProject}>
              Додати проект
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальне вікно для користувача */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    </div>
  );
};

export default App;
