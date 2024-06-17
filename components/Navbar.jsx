'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => setPages(data.data));
  }, []);

  return (
    <nav>
      <ul className='flex w-full m-auto p-auto '>
        {pages.map(page => (
          <li key={page.route}>
            <Link href={`/${page.route}`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
