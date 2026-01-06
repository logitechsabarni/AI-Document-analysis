import React from 'react';
import { Goal, GoalStatus, Task } from '../types';
import Button from './Button';

interface ContextPanelProps {
  activeGoal: Goal | null;
  onUpdateGoal: (goal: Goal) => void;
  isLoading: boolean;
}

const getStatusColor = (status: GoalStatus): string => {
  switch (status) {
    case GoalStatus.COMPLETED:
      return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
    case GoalStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100';
    case GoalStatus.ON_HOLD:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100';
    case GoalStatus.NOT_STARTED:
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  }
};

const ContextPanel: React.FC<ContextPanelProps> = ({ activeGoal, onUpdateGoal, isLoading }) => {
  const handleToggleTaskStatus = (task: Task) => {
    if (!activeGoal) return;
    const updatedTasks = activeGoal.tasks?.map((t) =>
      t.id === task.id
        ? {
            ...t,
            status:
              t.status === GoalStatus.COMPLETED
                ? GoalStatus.IN_PROGRESS
                : GoalStatus.COMPLETED,
          }
        : t
    );
    onUpdateGoal({ ...activeGoal, tasks: updatedTasks });
  };

  const handleUpdateProgressSummary = () => {
    // In a real application, this would open a modal or inline editor
    const newSummary = prompt('Update your progress summary:', activeGoal?.progressSummary || '');
    if (newSummary !== null && activeGoal) {
      onUpdateGoal({ ...activeGoal, progressSummary: newSummary });
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-80 bg-gray-50 dark:bg-dark-blue-800 border-l border-gray-200 dark:border-gray-700 p-4 h-full fixed right-0 top-0">
      <h2 className="text-xl font-bold mb-6">Active Goal & Context</h2>

      {!activeGoal ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
          <p>No active goal. Start a new one with the AI!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <h3 className="text-lg font-semibold mb-2">{activeGoal.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{activeGoal.description}</p>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(activeGoal.status)}`}>
            {activeGoal.status.replace(/_/g, ' ')}
          </span>

          <div className="mt-4">
            <h4 className="font-semibold text-md mb-2">Progress Summary</h4>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100">
              {activeGoal.progressSummary || 'No summary yet.'}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpdateProgressSummary}
                disabled={isLoading}
                className="ml-2 text-xs"
              >
                (Edit)
              </Button>
            </div>
          </div>

          {activeGoal.roadmap && activeGoal.roadmap.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-md mb-2">Roadmap</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800 dark:text-gray-100">
                {activeGoal.roadmap.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {activeGoal.tasks && activeGoal.tasks.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-md mb-2">Tasks</h4>
              <ul className="space-y-2">
                {activeGoal.tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <label className="flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={task.status === GoalStatus.COMPLETED}
                        onChange={() => handleToggleTaskStatus(task)}
                        disabled={isLoading}
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-800"
                      />
                      <span className={`ml-2 ${task.status === GoalStatus.COMPLETED ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                        {task.description}
                      </span>
                    </label>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContextPanel;