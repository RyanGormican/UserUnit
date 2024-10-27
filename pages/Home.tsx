import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import '/src/app/globals.css';

export default function Home() {
  const [containerWidth, setContainerWidth] = useState(50);
  const [containerHeight, setContainerHeight] = useState(87);
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [currentMode, setCurrentMode] = useState('Container');
  const [isEdit, setIsEdit] = useState(false);
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
        template: [
          {
            id: 1,
            containers: [
              { id: 1, title: 'Sample', contentId: 1, width: containerWidth, height: containerHeight },
            ]
          },
        ],
        content: [
          { id: 1, title: 'A', text: 'Sample Text 1' },
          { id: 2, title: 'B', text: 'Sample Text 2' },
          { id: 3, title: 'C', text: 'Sample Text 3' }
        ]
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
    if (isEdit) {
      setIsDraggingWidth(true);
    }
  };

  const handleMouseDownHeight = () => {
    if (isEdit) {
      setIsDraggingHeight(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Resize Width
    if (isDraggingWidth) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 6 && newWidth <= 99) {
        setContainerWidth(newWidth);
        // Update the template in userData for a specific template ID (e.g., 1)
        setUserData(prevState => ({
          ...prevState,
          template: prevState.template.map(template =>
            template.id === 1 ? { ...template, width: newWidth } : template
          )
        }));
      }
    }

    // Resize Height
    if (isDraggingHeight) {
      const newHeight = (e.clientY / window.innerHeight) * 100;
      if (newHeight >= 6 && newHeight <= 87) {
        setContainerHeight(newHeight);
        // Update the template in userData for a specific template ID (e.g., 1)
        setUserData(prevState => ({
          ...prevState,
          template: prevState.template.map(template =>
            template.id === 1 ? { ...template, height: newHeight } : template
          )
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

  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  const toggleMode = (mode: string) => {
    setCurrentMode(mode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, contentId: number, field: 'text' | 'title') => {
    const newValue = e.target.value;

    // Update content in userData
    setUserData(prevState => ({
      ...prevState,
      content: prevState.content.map(contentItem =>
        contentItem.id === contentId ? { ...contentItem, [field]: newValue } : contentItem
      )
    }));
  };

  const handleContentIdChange = (containerId: number, newContentId: number) => {
    setUserData(prevState => ({
      ...prevState,
      template: prevState.template.map(template => ({
        ...template,
        containers: template.containers.map(container =>
          container.id === containerId ? { ...container, contentId: newContentId } : container
        )
      }))
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
            icon={isEdit ? 'ph:arrow-fat-up-fill' : 'ph:arrow-fat-up-light'}
            width="40"
            onClick={toggleEditMode}
          />
        </div>
        <hr className="divider" />

    {/* Container Mode */}
{currentMode === 'Container' && (
  <div style={{ display: 'flex', height: '87vh', flexDirection: 'column' }}>
    {userData.template.map(template => (
      <div
        key={template.id}
        style={{
          width: `${template.width}vw`,
          height: `${template.height}vh`,
          backgroundColor: '#f0f0f0',
          position: 'relative',
          opacity: isEdit ? 1 : 0.6,
          overflowY: 'auto',
          margin: 0 
        }}
      >
        {/* Drag Handles */}
        {isEdit && (
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
                zIndex: 10 
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
                zIndex: 10 
              }}
              onMouseDown={handleMouseDownHeight}
            />
          </>
        )}

        {/* Content Display */}
        {template.containers?.map(container => {
          const contentItem = userData.content.find(content => content.id === container.contentId);

          return (
            <div key={container.id} style={{ padding: '10px' }}>
              {/* Dropdown to select content */}
              {isEdit && (
                <select
                  value={container.contentId}
                  onChange={(e) => handleContentIdChange(container.id, Number(e.target.value))}
                  style={{
                    width: '25%',
                    marginTop: '5px',
                    position: 'absolute', 
                    zIndex: 10, 
                       top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', 
                  }}
                >
                  {userData.content.map(content => (
                    <option key={content.id} value={content.id}>
                      {content.title || 'Untitled'}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Show content text or a placeholder */}
              <p>{contentItem ? contentItem.text : 'No content available'}</p>
            </div>
          );
        })}
      </div>
    ))}
  </div>
)}


        {/* Content Mode */}
        {currentMode === 'Content' && (
          <div style={{ height: '87vh', backgroundColor: '#e0e0e0', padding: '20px' }}>
            <h2>Edit Container Text</h2>
            {userData.content.map(contentItem => (
              <div key={contentItem.id} style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={contentItem.title}
                  onChange={(e) => handleInputChange(e, contentItem.id, 'title')}
                  style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={contentItem.text}
                  onChange={(e) => handleInputChange(e, contentItem.id, 'text')}
                  style={{ width: '100%', padding: '10px' }}
                  placeholder="Content"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
