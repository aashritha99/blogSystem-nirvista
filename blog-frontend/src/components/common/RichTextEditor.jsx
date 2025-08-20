import React from 'react';
import ReactQuill from 'react-quill';
import '../../styles/quill.css'; // Temporarily disabled due to PostCSS issues

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...', className = '' }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        style={{
          '--quill-bg': 'var(--tw-bg-opacity, 1)',
          '--quill-color': 'var(--tw-text-opacity, 1)'
        }}
      />
      <style jsx global>{`
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          background: white;
        }
        
        .dark .ql-toolbar {
          border-color: #374151;
          background: #1f2937;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          background: white;
          color: #111827;
        }
        
        .dark .ql-container {
          border-color: #374151;
          background: #1f2937;
          color: #f9fafb;
        }
        
        .ql-editor {
          min-height: 200px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        
        .ql-toolbar .ql-stroke {
          fill: none;
          stroke: #374151;
        }
        
        .dark .ql-toolbar .ql-stroke {
          stroke: #d1d5db;
        }
        
        .ql-toolbar .ql-fill {
          fill: #374151;
          stroke: none;
        }
        
        .dark .ql-toolbar .ql-fill {
          fill: #d1d5db;
        }
        
        .ql-toolbar .ql-picker-label {
          color: #374151;
        }
        
        .dark .ql-toolbar .ql-picker-label {
          color: #d1d5db;
        }
        
        .ql-toolbar button:hover,
        .ql-toolbar button:focus {
          color: #3b82f6;
        }
        
        .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        
        .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid #e5e7eb;
        }
        
        .dark .ql-toolbar .ql-picker-options {
          background: #1f2937;
          border-color: #374151;
        }
        
        .ql-toolbar .ql-picker-item {
          color: #374151;
        }
        
        .dark .ql-toolbar .ql-picker-item {
          color: #d1d5db;
        }
        
        .ql-toolbar .ql-picker-item:hover {
          background: #f3f4f6;
        }
        
        .dark .ql-toolbar .ql-picker-item:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;