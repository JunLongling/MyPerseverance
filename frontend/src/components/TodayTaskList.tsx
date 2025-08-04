import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { HiCheckCircle, HiOutlineCheckCircle } from "react-icons/hi";
import { Button } from "@/components/ui/wdwd"; 

export interface TaskDto {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

interface TodayTaskListProps {
  onTaskStatusChange?: () => void;
}

interface TaskWithMeta extends TaskDto {
  isDirty: boolean;
  isSaving: boolean;
  error?: string;
}

export default function TodayTaskList({ onTaskStatusChange }: TodayTaskListProps) {
  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axiosClient.get<TaskDto[]>(`/progress/tasks?date=${today}`);
        setTasks(res.data.map(t => ({ ...t, isDirty: false, isSaving: false, error: undefined })));
        setGlobalError(null);
      } catch {
        setGlobalError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    const newTask: TaskWithMeta = {
      title: "",
      description: "",
      completed: false,
      date: new Date().toISOString().split("T")[0],
      isDirty: true,
      isSaving: false,
      error: undefined,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleChange = (index: number, field: keyof TaskDto, value: any) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value, isDirty: true, error: undefined };
      return updated;
    });
  };

  const handleSave = async (index: number) => {
    const task = tasks[index];
    if (!task.title.trim()) {
      setTasks(prev => {
        const updated = [...prev];
        updated[index].error = "Title cannot be empty";
        return updated;
      });
      return;
    }
    setTasks(prev => {
      const updated = [...prev];
      updated[index].isSaving = true;
      updated[index].error = undefined;
      return updated;
    });
    try {
      if (task.id) {
        await axiosClient.put(`/progress/tasks/${task.id}`, task);
      } else {
        const res = await axiosClient.post("/progress/tasks", task);
        setTasks(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], id: res.data.id };
          return updated;
        });
      }
      setTasks(prev => {
        const updated = [...prev];
        updated[index].isDirty = false;
        updated[index].isSaving = false;
        updated[index].error = undefined;
        return updated;
      });
      if (onTaskStatusChange) onTaskStatusChange();
    } catch {
      setTasks(prev => {
        const updated = [...prev];
        updated[index].isSaving = false;
        updated[index].error = "Failed to save task";
        return updated;
      });
    }
  };

  const handleCancel = (index: number) => {
    const task = tasks[index];
    if (!task.id) {
      setTasks(prev => prev.filter((_, i) => i !== index));
    } else {
      axiosClient.get<TaskDto>(`/progress/tasks/${task.id}`).then(res => {
        setTasks(prev => {
          const updated = [...prev];
          updated[index] = { ...res.data, isDirty: false, isSaving: false, error: undefined };
          return updated;
        });
      }).catch(() => {
        setTasks(prev => {
          const updated = [...prev];
          updated[index].isDirty = false;
          updated[index].isSaving = false;
          updated[index].error = undefined;
          return updated;
        });
      });
    }
  };

  const handleToggleCompleted = async (index: number) => {
    const task = tasks[index];
    if (!task.id) return;

    const newCompleted = !task.completed;
    setTasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: newCompleted, isSaving: true, error: undefined };
      return updated;
    });

    try {
      await axiosClient.put(`/progress/tasks/${task.id}`, { ...task, completed: newCompleted });
      setTasks(prev => {
        const updated = [...prev];
        if (updated[index] && updated[index].id === task.id) {
          updated[index] = {
            ...updated[index],
            isSaving: false,
            isDirty: false,
            error: undefined,
            completed: newCompleted,
          };
        }
        return updated;
      });
      if (onTaskStatusChange) onTaskStatusChange();
    } catch {
      setTasks(prev => {
        const updated = [...prev];
        if (updated[index] && updated[index].id === task.id) {
          updated[index] = {
            ...updated[index],
            isSaving: false,
            error: "Failed to update completed status",
          };
        }
        return updated;
      });
    }
  };

  const handleDelete = async (index: number) => {
    const task = tasks[index];
    if (!task.id) return;

    try {
      await axiosClient.delete(`/progress/tasks/${task.id}`);
      setTasks(prev => prev.filter((_, i) => i !== index));
      if (onTaskStatusChange) onTaskStatusChange();
    } catch {
      setTasks(prev => {
        const updated = [...prev];
        updated[index].error = "Failed to delete task";
        return updated;
      });
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-500">Loading tasks...</p>;
  if (globalError) return <p className="text-center py-12 text-red-600 font-semibold">{globalError}</p>;

  if (tasks.length === 0)
    return (
      <div className="text-center py-16 text-gray-500">
        No tasks for today.{" "}
        <Button
          onClick={handleAddTask}
          variant="primary"
          size="md"
          rounded="md"
          className="ml-2"
          aria-label="Add new task"
        >
          + Add Task
        </Button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {tasks.map((task, index) => (
        <div
          key={task.id ?? index}
          className="rounded-lg shadow-md border border-gray-200 p-6 bg-white flex flex-col md:flex-row md:items-center md:gap-6 relative transition-shadow duration-200 hover:shadow-lg"
        >
          {/* Replace checkbox with icon buttons */}
          {task.id ? (
            <button
              onClick={() => handleToggleCompleted(index)}
              aria-label={task.completed ? `Mark task "${task.title || "untitled"}" as not done` : `Mark task "${task.title || "untitled"}" as done`}
              disabled={task.isSaving}
              className="flex-shrink-0 cursor-pointer text-2xl transition-colors duration-200 bg-transparent border-none p-0"
              type="button"
            >
              {task.completed ? (
                <HiCheckCircle className="text-green-500 hover:text-green-600" />
              ) : (
                <HiOutlineCheckCircle className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}

          <div className="flex-1 mt-3 md:mt-0">
            <input
              type="text"
              value={task.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              placeholder="Task title"
              className={`w-full text-lg font-semibold border-b pb-1 focus:outline-purple-500 focus:ring-1 focus:ring-purple-500 ${
                task.error ? "border-red-500" : "border-gray-300"
              }`}
              spellCheck={false}
              disabled={task.isSaving}
            />
            <textarea
              value={task.description || ""}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="w-full mt-2 resize-none text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-purple-500 focus:ring-1 focus:ring-purple-500"
              disabled={task.isSaving}
            />
            {task.error && (
              <p className="mt-1 text-sm text-red-600" aria-live="assertive">
                {task.error}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 mt-3 md:mt-0 min-w-[110px]">
            {task.isDirty && !task.isSaving && (
              <>
                <Button
                  onClick={() => handleSave(index)}
                  variant="primary"
                  size="md"
                  rounded="md"
                  className=""
                  aria-label="Save task"
                >
                  Save
                </Button>
                <Button
                  onClick={() => handleCancel(index)}
                  variant="danger"
                  size="md"
                  rounded="md"
                  className=""
                  aria-label="Cancel changes"
                >
                  Cancel
                </Button>
              </>
            )}
            {task.isSaving && (
              <p className="text-sm text-gray-500 select-none">Saving...</p>
            )}
            {!task.isDirty && task.id && (
              <Button
                onClick={() => handleDelete(index)}
                variant="outline"
                size="md"
                rounded="md"
                className="mt-2"
                aria-label="Delete task"
                disabled={task.isSaving}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          onClick={handleAddTask}
          variant="primary"
          size="md"
          rounded="md"
          className="mt-4 max-w-sm w-full"
          aria-label="Add new task"
        >
          + Add Task
        </Button>
      </div>
    </div>
  );
}
