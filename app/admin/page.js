'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Admin = () => {
  const [title, setTitle] = useState('');
  const [route, setRoute] = useState('');
  const [content, setContent] = useState('');
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => setPages(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, route, content }),
    });
    if (res.ok) {
      const newPage = await res.json();
      setPages([...pages, newPage.data]);
      setTitle('');
      setRoute('');
      setContent('');
    }
  };

  const handleDelete = async (route) => {
    const res = await fetch(`/api/pages/${route}`, { method: 'DELETE' });
    if (res.ok) {
      setPages(pages.filter(page => page.route !== route));
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Route"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        />
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">Create Page</button>
      </form>
      <ul>
        {pages.map(page => (
          <li key={page.route} className='bg-white text-stone-600 mx-4'>
            {page.title} ({page.route}) 
            <button onClick={() => handleDelete(page.route)} className='bg-red-500 text-white border-round-md'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
