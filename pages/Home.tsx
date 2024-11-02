import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import Container from '../src/app/Container';
import Content from '../src/app/Content';
import '/src/app/globals.css';

interface ContainerData {
  id: number;
  title: string;
  contentId: number;
  width: number;
  height: number;
}

interface Template {
  id: number;
  containers: ContainerData[];
}

interface ContentData {
  id: number;
  title: string;
  text: string;
}

interface UserData {
  template: Template[];
  content: ContentData[];
}

const MIN_WIDTH = 6;
const MAX_WIDTH = 99;
const MIN_HEIGHT = 6;
const MAX_HEIGHT = 87;

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    template: [],
    content: [],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string>('Container');
  const [isDraggingWidth, setIsDraggingWidth] = useState<boolean>(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState<boolean>(false);

  useEffect(() => {
    const storedData = localStorage.getItem('Userunitdata');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      const initialData: UserData = {
        template: [
          {
            id: 1,
            containers: [
              { id: 1, title: 'Sample', contentId: 1, width: 50, height: 87 },
            ],
          },
        ],
        content: [
          { id: 1, title: 'A', text: 'Sample Text 1' },
          { id: 2, title: 'B', text: 'Sample Text 2' },
          { id: 3, title: 'C', text: 'Sample Text 3' },
        ],
      };
      setUserData(initialData);
      localStorage.setItem('Userunitdata', JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('Userunitdata', JSON.stringify(userData));
  }, [userData]);

  const handleMouseDownWidth = () => {
    if (isEdit) setIsDraggingWidth(true);
  };

  const handleMouseDownHeight = () => {
    if (isEdit) setIsDraggingHeight(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const container = userData.template[0]?.containers[0];
    if (!container) return; // Prevents potential null reference

    let newWidth = container.width;
    let newHeight = container.height;

    if (isDraggingWidth) {
      newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setUserData(prevState => ({
          ...prevState,
          template: prevState.template.map(template =>
            template.id === 1
              ? {
                  ...template,
                  containers: template.containers.map(container =>
                    container.id === 1 ? { ...container, width: newWidth } : container
                  ),
                }
              : template
          ),
        }));
      }
    }

    if (isDraggingHeight) {
      newHeight = (e.clientY / window.innerHeight) * 100;
      if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
        setUserData(prevState => ({
          ...prevState,
          template: prevState.template.map(template =>
            template.id === 1
              ? {
                  ...template,
                  containers: template.containers.map(container =>
                    container.id === 1 ? { ...container, height: newHeight } : container
                  ),
                }
              : template
          ),
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
    setIsEdit(prev => !prev);
  };

  const toggleMode = (mode: string) => {
    setCurrentMode(mode);
  };

  const handleContentIdChange = (containerId: number, newContentId: number) => {
    setUserData(prevState => ({
      ...prevState,
      template: prevState.template.map(template => ({
        ...template,
        containers: template.containers.map(container =>
          container.id === containerId ? { ...container, contentId: newContentId } : container
        ),
      })),
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
          <Icon icon="icon-park-outline:page" width="40" onClick={() => toggleMode('Container')} />
          <Icon icon="subway:write" width="40" onClick={() => toggleMode('Content')} />
          <Icon icon={isEdit ? 'ri:pencil-fill' : 'ri:pencil-line'} width="40" onClick={toggleEditMode} />
        </div>
        <hr className="divider" />

        {currentMode === 'Container' && (
          <div style={{ display: 'flex', height: '87vh', flexDirection: 'column' }}>
            {userData.template.map(template => (
              <Container
                key={template.id}
                templateId={template.id}
                container={template.containers[0]}
                contentItems={userData.content}
                isEdit={isEdit}
                onContentIdChange={handleContentIdChange}
                onMouseDownWidth={handleMouseDownWidth}
                onMouseDownHeight={handleMouseDownHeight}
              />
            ))}
          </div>
        )}

        {currentMode === 'Content' && (
          <Content
            contentItems={userData.content}
            onUpdateUserData={(newData) => setUserData(prevState => ({ ...prevState, ...newData }))}
          />
        )}
      </div>
    </main>
  );
}
