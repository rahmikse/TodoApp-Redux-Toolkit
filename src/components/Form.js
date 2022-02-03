import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodoAsync } from "../redux/todo/todoSlice";
import Loading from "./Loading";
import Error from "./Error";
function Form() {

  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.todos.addNewTodoLoading);
  const error = useSelector((state) => state.todos.addTodoError);

  const handleSubmit = async (e) => {
    if (!title) return;
    e.preventDefault();
    await dispatch(addTodoAsync({ title }));
    setTitle("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          disabled={isLoading}
          value={title}
          className="new-todo"
          placeholder="What needs to be done?"
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        {isLoading && <Loading />}
        {error && <Error message={error} />}
      </form>
    </div>
  );
}

export default Form;
