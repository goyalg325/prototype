'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import parse from 'html-react-parser';
import '../../styles/customStyles.css';

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

  const renderContent = () => {
    const content = page.content;
  
    const parserOptions = {
      replace: (domNode) => {
        if (domNode.type === 'tag') {
          if (domNode.name === 'p' && domNode.children && domNode.children.length > 0) {
            const className = `paragraph-style-${(Math.floor(Math.random() * 7)) + 1}`;
            return (
              <p className={className}>
                {domNode.children.map(child => typeof child.data === 'string' ? parse(child.data) : child.data)}
              </p>
            );
          } else if (domNode.name === 'div' || domNode.name === 'span') {
            return <div>{domNode.children.map(child => parse(child.data))}</div>;
          }
        }
        // Return the original node for other types or empty paragraphs
        return domNode;
      }
    };
  
    return parse(content, parserOptions);
  };
  

  return (
    <div>
      {/* <h1>{page.title}</h1> */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default DynamicPage;
