import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <h1 className="heading">React Practical Assignment</h1>
      <div className="grid">
        <ToDoApp />
        <PostList />
      </div>
      <div className="form-section">
        <SignUpForm />
      </div>
    </div>
  );
}

function ToDoApp() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [task, setTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleTask = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = index => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="card">
      <h2 className="card-title">To-Do List</h2>
      <div className="todo-container">
        <input value={task} onChange={e => setTask(e.target.value)} placeholder="Add a task" className="todo-input" />
        <button onClick={addTask} className="todo-button add-button">Add</button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={index} className="todo-item">
            <span className={t.completed ? 'completed' : ''}>
              {t.text}
            </span>
            <div className="todo-buttons">
              <button onClick={() => toggleTask(index)} className="todo-button complete-button">{t.completed ? 'Undo' : 'Mark as Completed'}</button>
              <button onClick={() => deleteTask(index)} className="todo-button delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data));
  }, []);

  const filteredPosts = posts.filter(post => post.title.includes(search));

  return (
    <div className="card">
      <h2 className="card-title">Posts</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts" className="search-bar" />
      <ul>
        {filteredPosts.map(post => (
          <li key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = data => {
    alert(JSON.stringify(data));
    window.location.reload();
  };

  return (
    <div className="card">
      <h2 className="card-title">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <input {...register('name')} placeholder="Name" className="form-input" />
        <p className="error-message">{errors.name?.message}</p>
        
        <input {...register('email')} placeholder="Email" className="form-input" />
        <p className="error-message">{errors.email?.message}</p>

        <input {...register('password')} type="password" placeholder="Password" className="form-input" />
        <p className="error-message">{errors.password?.message}</p>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}