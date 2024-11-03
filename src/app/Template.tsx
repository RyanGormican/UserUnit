import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ContainerData {
  id: number;
  title: string;
  contentId: number;
  width: number;
  height: number;
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

interface TemplateItem {
  id: number;
  name: string;
  containers: ContainerData[];
}

interface TemplateProps {
  templateItems: TemplateItem[];
  onUpdateUserData: (newData: Partial<{ template: TemplateItem[] }>) => void;
}

const Template: React.FC<TemplateProps> = ({ templateItems, onUpdateUserData }) => {
  const [localTemplates, setLocalTemplates] = useState<TemplateItem[]>(templateItems);

  useEffect(() => {
    setLocalTemplates(templateItems);
  }, [templateItems]);

  const handleNameChange = (id: number, newName: string) => {
    const updatedTemplates = localTemplates.map(template => 
      template.id === id ? { ...template, name: newName } : template
    );
    setLocalTemplates(updatedTemplates);
    onUpdateUserData({ template: updatedTemplates }); 
  };

  // Generate a unique ID for containers
  const generateContainerId = () => {
    return Date.now() + Math.random(); // Combine timestamp and random number for uniqueness
  };

  const copyTemplateItem = (id: number) => {
    const templateToCopy = localTemplates.find(template => template.id === id);
    if (!templateToCopy) return; 

    const newId = Date.now(); 
    const newTemplate: TemplateItem = {
      id: newId,
      name: `Copy of ${templateToCopy.name}`, 
      containers: templateToCopy.containers.map(container => ({
        ...container,
        id: generateContainerId(), // Assign a new unique ID to each container
      })),
    };

    const updatedTemplates = [...localTemplates, newTemplate];
    setLocalTemplates(updatedTemplates);
    onUpdateUserData({ template: updatedTemplates }); 
  };

  const addTemplateItem = () => {
    const newId = Date.now(); 
    const newTemplate: TemplateItem = {
      id: newId,
      name: `New Template ${localTemplates.length + 1}`, 
      containers: [], 
    };

    const updatedTemplates = [...localTemplates, newTemplate];
    setLocalTemplates(updatedTemplates);
    onUpdateUserData({ template: updatedTemplates }); 
  };

  return (
    <div style={{ height: '100%', backgroundColor: '#e0e0e0', padding: '20px' }}>
      <h2>Edit Templates</h2>
      <button onClick={addTemplateItem} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'lightblue' }}>
        Add New Template
      </button>
      {localTemplates.map(template => (
        <div key={template.id} style={{ marginBottom: '10px' }}>
          <div className="flex">
            <Icon 
              icon="tabler:copy" 
              width="40" 
              onClick={() => copyTemplateItem(template.id)} 
              style={{ cursor: 'pointer', marginRight: '10px' }} 
            />
            <input
              type="text"
              value={template.name}
              onChange={(e) => handleNameChange(template.id, e.target.value)}
              style={{ padding: '10px', width: '95%' }}
            />
          </div> 
        </div>
      ))}
    </div>
  );
};

export default Template;
