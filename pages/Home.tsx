import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import '/src/app/globals.css';

export default function Home() {
  const [containerWidth, setContainerWidth] = useState(50);
  const [containerHeight, setContainerHeight] = useState(87); 
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [currentMode, setCurrentMode] = useState('Container'); 
  const [content, setContent] = useState('Resizable Container');

  const handleMouseDownWidth = () => {
    setIsDraggingWidth(true);
  };

  const handleMouseDownHeight = () => {
    setIsDraggingHeight(true);
  };

  const handleMouseMove = (e) => {
    // Resize Width
    if (isDraggingWidth) {
      const newWidth = (e.clientX / window.innerWidth) * 100; 
      if (newWidth >= 6 && newWidth <= 99) {
        setContainerWidth(newWidth);
      }
    }

    // Resize Height
    if (isDraggingHeight) {
      const newHeight = (e.clientY / window.innerHeight) * 100; 
      if (newHeight >= 6 && newHeight <= 87) { 
        setContainerHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingWidth(false);
    setIsDraggingHeight(false);
  };

  useEffect(() => {
    if (isDraggingWidth || isDraggingHeight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWidth, isDraggingHeight]);

  // Function to set current mode
  const toggleMode = (mode) => {
    setCurrentMode(mode);
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <main>
      <div>
        <span className='links'>
          <a href="https://www.linkedin.com/in/ryangormican/">
            <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
          </a>
          <a href="https://github.com/RyanGormican/UserUnit">
            <Icon icon="mdi:github" color="#e8eaea" width="60" />
          </a>
          <a href="https://ryangormicanportfoliohub.vercel.app/">
            <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
          </a>
        </span>
        <div className="title">
          UserUnit
        </div>
        <hr className="divider" />
        <div className="buttons flex">
          <Icon 
            icon="icon-park-outline:page" 
            width="40" 
            onClick={() => toggleMode('Container')} 
          />
          {/*
          <Icon 
            icon="fluent-mdl2:page-list" 
            width="40" 
            onClick={() => toggleMode('Modules')} 
          />
          */}
          <Icon 
            icon="subway:write" 
            width="40" 
            onClick={() => toggleMode('Content')} 
          />
        </div>
        <hr className="divider" />
        
        {/* Container Mode */}
        {currentMode === 'Container' && (
          <div style={{ display: 'flex', height: '87vh' }}>
            <div
              style={{
                width: `${containerWidth}vw`,
                height: `${containerHeight}vh`,
                backgroundColor: '#f0f0f0',
                position: 'relative',
              }}
            >
              {content}
              <div
                style={{
                  width: '2px', 
                  height: '100%',
                  backgroundColor: '#000', 
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  cursor: 'ew-resize',
                }}
                onMouseDown={handleMouseDownWidth}
              />
              <div
                style={{
                  width: '100%',
                  height: '2px', 
                  backgroundColor: '#000', 
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  cursor: 'ns-resize',
                }}
                onMouseDown={handleMouseDownHeight}
              />
            </div>
          </div>
        )}

        {/* Modules Mode */}
        {currentMode === 'Modules' && (
          <div style={{ height: '87vh', backgroundColor: '#e0e0e0', padding: '20px' }}>
            <h2>Modules</h2>
      
          </div>
        )}

        {/* Content Mode */}
        {currentMode === 'Content' && (
          <div style={{ height: '87vh', backgroundColor: '#e0e0e0', padding: '20px' }}>
            <h2>Edit Container Text</h2>
            <input 
              type="text" 
              value={content} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '10px' }} 
            />
          </div>
        )}
      </div>
    </main>
  );
}
