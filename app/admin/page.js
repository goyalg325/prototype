'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/section.css';

const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false });

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [route, setRoute] = useState('');
  const [content, setContent] = useState('');
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/pages');
        const data = await response.json();
        if (data.success) {
          setPages(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      }
    };

    fetchPages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, route, content })
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/page/${route}`;
      } else {
        alert('Failed to create page. Route might already exist.');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page. Please try again.');
    }
  };

  const handleDelete = async (route) => {
    try {
      const response = await fetch(`/api/pages/${route}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setPages(pages.filter((page) => page.route !== route));
      } else {
        alert('Failed to delete page.');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Route</label>
          <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} required />
        </div>
        <div>
          <label>Content</label>
          <QuillEditor value={content} onChange={setContent} />
        </div>
        <button type="submit">Create Page</button>
      </form>
      <h2>Existing Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.route}>
            <span>{page.title} - {page.route}</span>
            <button onClick={() => handleDelete(page.route)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
