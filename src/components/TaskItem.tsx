// src/components/TaskItem.tsx
import React from "react";
import "./TaskItem.css";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  description: string;
  tags: string[];
  priority: "Low" | "Medium" | "High";
  projectId?: number;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  projectName: string;
  deleteTask: (id: number) => void;
  toggleTaskCompletion: (id: number) => void;
  isTileView?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  projectName,
  deleteTask,
  toggleTaskCompletion,
  isTileView = false,
}) => {
  if (isTileView) {
    return (
      <div className={`task-tile ${task.completed ? "completed-task" : ""}`}>
        <h3>{task.title}</h3>
        <p>
          <strong>Дата/час:</strong> {new Date(task.dueDate).toLocaleString()}
        </p>
        <p>
          <strong>Опис:</strong> {task.description}
        </p>
        <p>
          <strong>Теги:</strong> {task.tags.join(", ")}
        </p>
        <p>
          <strong>Пріоритет:</strong> {task.priority}
        </p>
        <p>
          <strong>Проект:</strong> {projectName}
        </p>
        <div className="task-actions">
          <button
            className="complete-button"
            onClick={() => toggleTaskCompletion(task.id)}
          >
            Виконати
          </button>
          <button className="delete-button" onClick={() => deleteTask(task.id)}>
            Видалити
          </button>
        </div>
      </div>
    );
  }

  // Відображення у вигляді списку з кнопками праворуч
  return (
    <li className={task.completed ? "completed-task" : ""}>
      <div className="task-content">
        <div className="task-info">
          <h3>{task.title}</h3>
          <p>
            <strong>Дата/час:</strong> {new Date(task.dueDate).toLocaleString()}
          </p>
          <p>
            <strong>Опис:</strong> {task.description}
          </p>
          <p>
            <strong>Теги:</strong> {task.tags.join(", ")}
          </p>
          <p>
            <strong>Пріоритет:</strong> {task.priority}
          </p>
          <p>
            <strong>Проект:</strong> {projectName}
          </p>
        </div>
        <div className="task-actions">
          <button
            className="complete-button"
            onClick={() => toggleTaskCompletion(task.id)}
          >
            Виконати
          </button>
          <button className="delete-button" onClick={() => deleteTask(task.id)}>
            Видалити
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
