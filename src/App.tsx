/* eslint-disable max-len */
import React, { useCallback, useEffect, useMemo } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';
// import { User } from './types/User';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalActive, setIsModalActive] = React.useState(false);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = React.useState<Todo>();
  const [currentTodos, setCurrentTodos] = React.useState<Todo[]>([]);
  const [query, setQuery] = React.useState('');

  useEffect(() => {
    getTodos().then(fetchedTodos => {
      setIsLoading(false);
      setTodos(fetchedTodos);
      setCurrentTodos(fetchedTodos);
    });
  }, []);

  const normalizedQuery = query.toLowerCase();

  // do this in one function abd delete current todos useMemo
  const filteredTodos = useMemo(() => {
    return currentTodos.filter(todo =>
      todo.title.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, currentTodos]);

  const filterActive = useCallback(
    (typeOfFilter: string) => {
      if (typeOfFilter === 'active') {
        setCurrentTodos(todos.filter(todo => !todo.completed)); // Show active todos
      } else if (typeOfFilter === 'completed') {
        setCurrentTodos(todos.filter(todo => todo.completed)); // Show completed todos
      } else {
        setCurrentTodos(todos); // Reset to all todos
      }
    },
    [todos],
  );
  // end

  const handleInput = (e: string) => {
    setQuery(e);
  };

  const handleEyeButtonClick = useCallback(
    (todoId: number | null) => {
      if (!isModalActive) {
        setSelectedTodo(undefined);
      }

      if (typeof todoId === 'number') {
        setIsModalActive(true);
        setSelectedTodo(currentTodos.find(todo => todo.id === todoId));
      }
    },
    [currentTodos, isModalActive],
  );

  const closeModal = () => {
    setIsModalActive(false);
    setSelectedTodo(undefined);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onFilterActive={filterActive}
                onHandleInput={handleInput}
              />
            </div>

            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  onEyeButtonClick={handleEyeButtonClick}
                  todoWatched={selectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onCloseModal={closeModal} />
      )}
    </>
  );
};
