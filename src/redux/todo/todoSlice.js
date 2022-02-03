import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getTodoAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
    return res.data;
  }
);
export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (data) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`,
      data
    );
    return res.data;
  }
);
export const toggleTodoAsync = createAsyncThunk(
  "todos/toggleTodoAsync",
  async ({ id, data }) => {
    const res = await axios.patch(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`,
      data
    );
    return res.data;
  }
);

export const removeTodoAsync = createAsyncThunk(
  "todos/removeTodoAsync",
  async (id) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`
    );
    return id;
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    activeFilter: "all",
    addNewTodoLoading: false,
    addTodoError: null,
  },
  reducers: {
    removeTodo: (state, action) => {
      const filtered = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      state.items = filtered;
    },
    changeActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    clearCompleted: (state) => {
      const filter = state.items.filter((item) => item.completed === false);
      state.items = filter;
    },
  },
  extraReducers: {
    //getTodo
    [getTodoAsync.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getTodoAsync.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    [getTodoAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    },
    // addTodo
    [addTodoAsync.pending]: (state, action) => {
      state.addNewTodoLoading = true;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.addNewTodoLoading = false;
    },
    [addTodoAsync.rejected]: (state, action) => {
      state.addNewTodoLoading = false;
      state.addTodoError = action.error.message;
    },
    [toggleTodoAsync.fulfilled]: (state, action) => {
      const { id, completed } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      state.items[index].completed = completed;
    },
    //removeTodo
    [removeTodoAsync.fulfilled]: (state, action) => {
      const id = action.payload;
      const filtered = state.items.filter((item) => item.id !== id);
      state.items = filtered;
    },
  },
});
export const selectFilteredTodos = (state) => {
  if (state.todos.activeFilter === " all ") {
    return state.todos.items;
  }
  return state.todos.items.filter((todo) =>
    state.todos.activeFilter === " active "
      ? todo.completed === false
      : todo.completed === true
  );
};
export const selectTodos = (state) => state.todos.items;
export const { toggleTodo, removeTodo, changeActiveFilter, clearCompleted } =
  todoSlice.actions;
export default todoSlice.reducer;
