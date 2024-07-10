// Page component
'use client';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import '@/styles/section.css';
import "react-quill/dist/quill.core.css";

const Page = ({ params }) => {
  const { route } = params;
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages/${route}`);
        const data = await response.json();
        if (data.success) {
          setPageData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch page data:', error);
      }
    };

    fetchPageData();
  }, [route]);

  if (!pageData) {
    return <div>Loading...</div>;
  }

  // Parse content with <hr> tags and dynamically assign section classes
  const sections = pageData.content.split('<hr>').map((content, index) => {
    // Calculate section index as 1, 2, or 3
    const sectionIndex = (index % 3) + 1;
    // Use a unique key format combining "section-" and sectionIndex
    const sectionKey = `section-${index}-${sectionIndex}`;
    return (
      <div key={sectionKey} className={`section-${sectionIndex} view ql-editor`}>
        {parse(content)}
      </div>
    );
  });
  

  return (
    // here adding design that should be evenly applied to complete page in outer div /*make sure to remove it*/
    <div className='bg-black'> 
      {/* <h1>{pageData.title}</h1> */}
     <div className='story-route-wrapper'> {sections}  </div>
    </div>
  );
};

export default Page;
