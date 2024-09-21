// src/components/TaskList.tsx
import React from "react";
import TaskItem from "./TaskItem";
import "./TaskList.css";

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

interface Project {
  id: number;
  name: string;
}

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  deleteTask: (id: number) => void;
  toggleTaskCompletion: (id: number) => void;
  view: "list" | "tiles";
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projects,
  deleteTask,
  toggleTaskCompletion,
  view,
}) => {
  if (tasks.length === 0) {
    return <p>Немає задач, що відповідають критеріям.</p>;
  }

  if (view === "list") {
    return (
      <div className="task-list">
        <h2>Задачі</h2>
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectName={
                task.projectId
                  ? projects.find((project) => project.id === task.projectId)
                      ?.name || "Без проекту"
                  : "Без проекту"
              }
              deleteTask={deleteTask}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          ))}
        </ul>
      </div>
    );
  }

  if (view === "tiles") {
    return (
      <div className="task-tiles">
        <h2>Задачі</h2>
        <div className="tiles-container">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectName={
                task.projectId
                  ? projects.find((project) => project.id === task.projectId)
                      ?.name || "Без проекту"
                  : "Без проекту"
              }
              deleteTask={deleteTask}
              toggleTaskCompletion={toggleTaskCompletion}
              isTileView
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default TaskList;
