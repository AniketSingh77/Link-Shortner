import React, { useEffect, useRef } from 'react';

const AdBanner = ({ id, format, height, width }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      const conf = document.createElement('script');
      
      conf.innerHTML = `
        atOptions = {
          'key' : '${id}',
          'format' : '${format}',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      script.src = `//www.highperformanceformat.com/${id}/invoke.js`;
      script.async = true;

      adRef.current.appendChild(conf);
      adRef.current.appendChild(script);
    }
  }, [id, format, height, width]);

  return (
    <div 
      ref={adRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        background: 'rgba(255,255,255,0.02)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '0 auto'
      }} 
    />
  );
};

export default AdBanner;
