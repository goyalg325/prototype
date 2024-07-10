'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import PageManager from '../../components/PageManager';

const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false });

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [route, setRoute] = useState('');
  const [content, setContent] = useState('');
  const [pages, setPages] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cookies = parseCookies();
        let token = cookies.token || localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        destroyCookie(null, 'token');
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/pages');
      setPages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authorized. Redirecting...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = parseCookies().token || localStorage.getItem('token');
      const method = editMode ? 'put' : 'post';
      const url = editMode ? `/api/pages/${route}` : '/api/pages';
      
      const response = await axios[method](url, { title, route, content }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setTitle('');
        setRoute('');
        setContent('');
        setEditMode(false);
        fetchPages();
        alert(editMode ? 'Page updated successfully' : 'Page created successfully');
      } else {
        alert(editMode ? 'Failed to update page' : 'Failed to create page. Route might already exist.');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page. Please try again.');
    }
  };

  const handleDelete = async (route) => {
    try {
      const token = parseCookies().token || localStorage.getItem('token');
      const response = await axios.delete(`/api/pages/${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        fetchPages();
      } else {
        alert('Failed to delete page.');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = parseCookies().token || localStorage.getItem('token');
      const response = await axios.post('/api/user', {
        username: newUsername,
        password: newPassword,
        role: newRole,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.message) {
        alert('User created successfully');
        setNewUsername('');
        setNewPassword('');
      } else {
        alert(response.data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', null, { withCredentials: true });
      destroyCookie(null, 'token');
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleEditPage = (page) => {
    setTitle(page.title);
    setRoute(page.route);
    setContent(page.content);
    setEditMode(true);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input className='text-black'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Route</label>
          <input className='text-black'
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <QuillEditor value={content} onChange={setContent} />
        </div>
        <button type="submit">{editMode ? 'Update Page' : 'Create Page'}</button>
        {editMode && <button onClick={() => setEditMode(false)}>Cancel Edit</button>}
      </form>
      <PageManager pages={pages} onEditPage={handleEditPage} onDeletePage={handleDelete} />
      {user?.role === 'admin' && (
        <div>
          <h2>Create New User</h2>
          <form onSubmit={handleCreateUser}>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit">Create User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;