// src/components/Filters.tsx
import React from "react";
import "./Filters.css";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  filterDateRange: "day" | "week" | "month" | "";
  setFilterDateRange: (range: "day" | "week" | "month" | "") => void;
  filterCompleted: boolean | null;
  setFilterCompleted: (completed: boolean | null) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterPriority,
  setFilterPriority,
  filterTags,
  setFilterTags,
  filterDateRange,
  setFilterDateRange,
  filterCompleted,
  setFilterCompleted,
}) => {
  return (
    <div className="filters">
      <h2>Пошук та фільтри</h2>
      <input
        type="text"
        placeholder="Пошук за назвою чи описом"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option value="">Всі пріоритети</option>
        <option value="Low">Низький</option>
        <option value="Medium">Середній</option>
        <option value="High">Високий</option>
      </select>
      <input
        type="text"
        placeholder="Фільтр за тегами (через кому)"
        value={filterTags.join(",")}
        onChange={(e) =>
          setFilterTags(
            e.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          )
        }
      />
      <div className="date-filter">
        <select
          value={filterDateRange}
          onChange={(e) => setFilterDateRange(e.target.value as any)}
        >
          <option value="">Всі дати</option>
          <option value="day">На день</option>
          <option value="week">На тиждень</option>
          <option value="month">На місяць</option>
        </select>
      </div>
      <select
        value={
          filterCompleted === null
            ? ""
            : filterCompleted
            ? "completed"
            : "incomplete"
        }
        onChange={(e) => {
          const value = e.target.value;
          if (value === "completed") {
            setFilterCompleted(true);
          } else if (value === "incomplete") {
            setFilterCompleted(false);
          } else {
            setFilterCompleted(null);
          }
        }}
      >
        <option value="">Всі задачі</option>
        <option value="completed">Виконані</option>
        <option value="incomplete">Не виконані</option>
      </select>
    </div>
  );
};

export default Filters;
