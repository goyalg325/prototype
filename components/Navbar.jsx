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
    <nav className='mx-auto'>
      <ul className='flex w-full mx-auto '>
        {pages.map(page => (
          <li key={page.route} className='mx-3 text-orange-400 '>
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
