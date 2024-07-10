import React from 'react';

const PageManager = ({ pages, onEditPage, onDeletePage }) => {
  return (
    <div>
      <h2>Existing Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.route}>
            <span>{page.title} - {page.route}</span>
            <button onClick={() => onEditPage(page)}>Edit</button>
            <button onClick={() => onDeletePage(page.route)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageManager;