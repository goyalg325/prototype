import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import ImageDrop from 'quill-image-drop-and-paste';
import SectionBreak from './CustomSectionBreak'; // Import the custom blot

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/imageDrop', ImageDrop);

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const icons = Quill.import('ui/icons');
    icons['sectionBreak'] = '<svg viewBox="0 0 18 18"><path d="M2,4 L16,4 M2,9 L16,9 M2,14 L16,14" stroke="currentColor" fill="none" stroke-width="2"/></svg>';

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.getModule('toolbar');
      toolbar.addHandler('sectionBreak', () => {
        const range = editor.getSelection();
        if (range) {
          editor.insertEmbed(range.index, 'sectionBreak', true);
          editor.setSelection(range.index + 1);
        }
      });
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        ['sectionBreak'] // Add the section break button to the toolbar
      ],
    },
    blotFormatter: {
      modules: ['Resize', 'DisplaySize'],
    },
    imageDrop: true,
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
    />
  );
};

export default QuillEditor;
