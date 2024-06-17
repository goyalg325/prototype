'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const DynamicPage = () => {
  const pathname = usePathname();
  const [page, setPage] = useState(null);
  const route = pathname.substring(1); // Remove the leading '/'

  useEffect(() => {
    if (route) {
      fetch(`/api/pages/${route}`)
        .then(res => res.json())
        .then(data => setPage(data.data));
    }
  }, [route]);

  if (!page) return <div>Loading...</div>;

  return (
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
};

export default DynamicPage;
