'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import Link from 'next/link';

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
      <div className='w-full inline-block mx-auto px-auto my-4  '>Admin Panel</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-black mx-4 px-4'
        />
        <input
          type="text"
          placeholder="Route"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className='text-black mx-4 px-4'
        />
        <ReactQuill value={content} onChange={setContent} className='m-5 p-5' />
        {console.log(content)} 
        <button type="submit" className='bg-green-500 text-black font-bold m-4 p-4 rounded-md'>Create Page</button>
      </form>
      <ul>
        {pages.map(page => (
          <li key={page.route} className='bg-black text-white mx-4'>
           <>
            <Link href = {page.route} >{page.title} </Link>
            <button onClick={() => handleDelete(page.route)} className='bg-red-500 text-black font-bold m-4 p-4 rounded-md'>Delete</button>
          </>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
