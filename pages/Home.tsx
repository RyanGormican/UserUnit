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
  const [isCompact, setIsCompact] = useState(false);
  const [userData, setUserData] = useState({
    template: [],
    content: []
  });

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('Userunitdata');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      // Initialize with default values
      const initialData = {
        template: [{ width: containerWidth, height: containerHeight }], // Default template
        content: [content] // Default content list
      };
      setUserData(initialData);
      localStorage.setItem('Userunitdata', JSON.stringify(initialData));
    }
  }, []);

  // Update local storage whenever userData changes
  useEffect(() => {
    localStorage.setItem('Userunitdata', JSON.stringify(userData));
  }, [userData]);

  const handleMouseDownWidth = () => {
    if (isCompact) {
      setIsDraggingWidth(true);
    }
  };

  const handleMouseDownHeight = () => {
    if (isCompact) {
      setIsDraggingHeight(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Resize Width
    if (isDraggingWidth) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 6 && newWidth <= 99) {
        setContainerWidth(newWidth);
        // Update the template in userData
        setUserData(prevState => ({
          ...prevState,
          template: [{ width: newWidth, height: containerHeight }] // Update with new width
        }));
      }
    }

    // Resize Height
    if (isDraggingHeight) {
      const newHeight = (e.clientY / window.innerHeight) * 100;
      if (newHeight >= 6 && newHeight <= 87) {
        setContainerHeight(newHeight);
        // Update the template in userData
        setUserData(prevState => ({
          ...prevState,
          template: [{ width: containerWidth, height: newHeight }] // Update with new height
        }));
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

  const toggleCompactMode = () => {
    setIsCompact(!isCompact);
  };

  const toggleMode = (mode: string) => {
    setCurrentMode(mode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Update content in userData
    setUserData(prevState => ({
      ...prevState,
      content: [newContent] 
    }));
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
        <div className="title">UserUnit</div>
        <hr className="divider" />
        <div className="buttons flex">
          <Icon
            icon="icon-park-outline:page"
            width="40"
            onClick={() => toggleMode('Container')}
          />
          <Icon
            icon="subway:write"
            width="40"
            onClick={() => toggleMode('Content')}
          />
          <Icon
            icon={isCompact ? 'ph:arrow-fat-up-fill' : 'ph:arrow-fat-up-light'}
            width="40"
            onClick={toggleCompactMode}
          />
        </div>
        <hr className="divider" />

        {/* Container Mode */}
        {currentMode === 'Container' && (
          <div style={{ display: 'flex', height: '87vh' }}>
            <div
              style={{
                 width: `${userData.template[0]?.width}vw`, 
                height: `${userData.template[0]?.height}vh`,
                backgroundColor: '#f0f0f0',
                position: 'relative',
                opacity: isCompact ? 1 : 0.6,
              }}
            >
              {userData.content[0]} 

              {/* Drag Handles */}
              {isCompact ? (
                <>
                  <div
                    style={{
                      width: '2px',
                      height: '100%',
                      backgroundColor: '#000',
                      position: 'absolute',
                      right: '50%',
                      top: '0',
                      cursor: 'ew-resize',
                      transform: 'translateX(50%)',
                    }}
                    onMouseDown={handleMouseDownWidth}
                  />
                  <div
                    style={{
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#000',
                      position: 'absolute',
                      bottom: '50%',
                      left: '0',
                      cursor: 'ns-resize',
                      transform: 'translateY(50%)',
                    }}
                    onMouseDown={handleMouseDownHeight}
                  />
                </>
              ) : null}
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
