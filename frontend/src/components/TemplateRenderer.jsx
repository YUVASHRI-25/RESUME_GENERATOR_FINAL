import React, { useEffect } from 'react';

export default function TemplateRenderer({ templateId, iframeRef, src }) {
  const iframeSrc = src || (templateId ? `/templates/${templateId}/index.html` : null);
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('TemplateRenderer iframe loaded:', templateId);
      console.log('iframe contentWindow:', iframe.contentWindow);
    };

    const handleError = (error) => {
      console.error('TemplateRenderer iframe error:', error);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [templateId, iframeRef]);
  
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
      onLoad={() => console.log('TemplateRenderer iframe onLoad fired:', templateId)}
      onError={(error) => console.error('TemplateRenderer iframe onError:', error)}
    />
  );
}
