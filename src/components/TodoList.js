import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredTodos,
  getTodoAsync,
  toggleTodoAsync,
  removeTodoAsync,
} from "../redux/todo/todoSlice";
import Loading from "./Loading";
import Error from "./Error";

function TodoList() {

  const dispatch = useDispatch();

  const filteredTodos = useSelector(selectFilteredTodos);
  const isLoading = useSelector((state) => state.todos.isLoading);
  const error = useSelector((state) => state.todos.error);
  useEffect(() => {
    dispatch(getTodoAsync());
  }, [dispatch]);

  const handleToggle = async (id, completed) => {
    await dispatch(toggleTodoAsync({ id, data: { completed } }));
  };

  const handleDestroy = (id) => {
    if (window.confirm("Are u sure")) {
      dispatch(removeTodoAsync(id));
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} />;
  }

  return (
    <div>
      <ul className="todo-list">
        {filteredTodos.map((item) => (
          <li key={item.id} className={item.completed ? "completed" : ""}>
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item.id, !item.completed)}
              />
              <label>{item.title}</label>
              <button
                onClick={() => handleDestroy(item.id)}
                className="destroy"
              ></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
