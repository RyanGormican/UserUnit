import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import Container from '../src/app/Container';
import Content from '../src/app/Content';
import Template from '../src/app/Template';
import '/src/app/globals.css';

interface ContainerData {
  id: number;
  title: string;
  contentId: number;
  width: number;
  height: number;
  topLeft: { x: number; y: number }; // Store top-left position
  bottomRight: { x: number; y: number }; // Store bottom-right position
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
const MIN_HEIGHT = 6;
const MAX_WIDTH = 100;
const MAX_HEIGHT = 87;

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    template: [],
    content: [],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string>('Container');
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(null); // State for current template
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
            name:'Sample Template 1',
            containers: [
              { id: 1, title: 'Sample', contentId: 1, width: 50, height: 87, topLeft: { x: 0, y: 0 }, bottomRight: { x: 50, y: 87 } },
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

  // Add a new empty container
  const addContainer = () => {
    if (currentTemplateId !== null) {
      const newContainer: ContainerData = {
        id: Date.now(), 
        title: 'New Container',
        contentId: 1, 
        width: 50,
        height: 87,
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: 50, y: 87 },
      };

      setUserData(prevState => ({
        ...prevState,
        template: prevState.template.map(template => 
          template.id === currentTemplateId
            ? {
                ...template,
                containers: [...template.containers, newContainer], // Add the new container
              }
            : template
        ),
      }));
    }
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
          <Icon icon="lucide:book-template" width="40" onClick={() => toggleMode('Template')} />
          <Icon icon={isEdit ? 'ri:pencil-fill' : 'ri:pencil-line'} width="40" onClick={toggleEditMode} />
            {/* Template Selector */}

  <select
    id="template-selector"
    value={currentTemplateId !== null ? currentTemplateId : ''}
    onChange={(e) => setCurrentTemplateId(Number(e.target.value))}
    style={{width:'10%'}}
  >
    <option value="" disabled>Select a Template</option>
    {userData.template.map(template => (
      <option key={template.id} value={template.id}>
        {template.name}
      </option>
    ))}
  </select>
        </div>
        <hr className="divider" />


{currentMode === 'Container' && (
  <div style={{ display: 'flex', height: '87vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    {currentTemplateId !== null && userData.template
      .filter(template => template.id === currentTemplateId) // Filter to get only the current template
      .map(template => (
        template.containers.map(container => (
          <Container
            key={container.id}
            templateData={userData.template}
            templateId={template.id}
            container={container}
            containerId={container.id}
            contentItems={userData.content}
            isEdit={isEdit}
            onContentIdChange={handleContentIdChange}
            onUpdateUserData={(newData) => setUserData(prevState => ({ ...prevState, ...newData }))}
          />
        ))
      ))
    }
    {currentTemplateId !== null && userData.template.find(template => template.id === currentTemplateId)?.containers.length === 0 && (
      <button onClick={addContainer} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'lightblue' }}>
        ADD CONTAINER
      </button>
    )}
  </div>
)}


        {currentMode === 'Content' && (
          <Content
            contentItems={userData.content}
            onUpdateUserData={(newData) => setUserData(prevState => ({ ...prevState, ...newData }))}
          />
        )}
         {currentMode === 'Template' && (
          <Template
            templateItems={userData.template}
            onUpdateUserData={(newData) => setUserData(prevState => ({ ...prevState, ...newData }))}
          />
        )}
      </div>
    </main>
  );
}