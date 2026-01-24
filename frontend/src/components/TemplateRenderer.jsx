import React from 'react';

export default function TemplateRenderer({ templateId, iframeRef, src }) {
  const iframeSrc = src || (templateId ? `/templates/${templateId}/index.html` : null);
  
  if (!iframeSrc) {
    return <div className="p-8 text-center text-red-600">Error: Template not found</div>;
  }
  
  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      title={`Resume Template: ${templateId}`}
      style={{ 
        width: '100%', 
        height: '1123px',
        border: 'none', 
        background: 'white',
        display: 'block'
      }}
      allow="clipboard-read; clipboard-write"
    />
  );
}
