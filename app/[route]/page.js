// Page component
'use client';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import '@/styles/section.css';

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
  const sections = pageData.content.split('<hr>').map((content, index) => (
    <div key={index} className={`section-${index + 1}`}>
      {parse(content)}
    </div>
  ));

  return (
    <div>
      <h1>{pageData.title}</h1>
      {sections}
    </div>
  );
};

export default Page;
