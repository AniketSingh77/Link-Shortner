import React, { useEffect, useRef } from 'react';

const AdBanner = ({ id, format, height, width, rawCode }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current) {
        // If raw code is provided (e.g., from Adsterra script tag)
        if (rawCode) {
            adRef.current.innerHTML = ''; // Clear for re-render
            const container = document.createElement('div');
            container.innerHTML = rawCode;
            
            // Extract and execute scripts manually
            const scripts = Array.from(container.getElementsByTagName('script'));
            container.innerHTML = ''; // Temporarily remove content to isolate scripts
            
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copy all attributes
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                // Copy content
                newScript.innerHTML = oldScript.innerHTML;
                
                // For banners, we sometimes need to keep them in the LOCAL container
                // Adsterra invoke.js often uses the current script's location or global vars
                adRef.current.appendChild(newScript);
            });
            
            // Append the rest of the HTML
            const remainingHtml = document.createElement('div');
            remainingHtml.innerHTML = rawCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
            adRef.current.appendChild(remainingHtml);

        } else if (id && !adRef.current.firstChild) {
            // Standard Adsterra invocation logic (if only ID is provided)
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
    }
  }, [id, format, height, width, rawCode]);

  return (
    <div 
      ref={adRef} 
      className="ad-container"
      style={{ 
        width: width ? `${width}px` : '100%', 
        minHeight: height ? `${height}px` : 'auto', 
        background: 'rgba(0,0,0,0.01)', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: '12px'
      }} 
    />
  );
};

export default AdBanner;
