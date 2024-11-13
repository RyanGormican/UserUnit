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
  color?: string; 
}

interface TemplateItem {
  id: number;
  name: string;
  containers: ContainerData[];
}

interface TemplateProps {
  templateItems: TemplateItem[];
  onUpdateUserData: (newData: Partial<{ template: TemplateItem[] }>) => void;
  setCurrentTemplateId: (id: number) => void;
  templateId: number;
}

const TemplateDetail: React.FC<TemplateProps> = ({
  templateItems,
  onUpdateUserData,
  setCurrentTemplateId,
  templateId
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateItem | null>(null);

  useEffect(() => {
    const selectedTemplate = templateItems.find(item => item.id === templateId);
    setCurrentTemplate(selectedTemplate || null);
  }, [templateId, templateItems]);

  if (!currentTemplate) {
    return <div>Template not found.</div>;
  }

  // Handle color change for a container
  const handleColorChange = (containerId: number, color: string) => {
    const updatedTemplate = { ...currentTemplate };
    const updatedContainers = updatedTemplate.containers.map(container => 
      container.id === containerId ? { ...container, color } : container
    );
    updatedTemplate.containers = updatedContainers;
    onUpdateUserData({ template: [updatedTemplate] });
  };

  return (
    <div style={{ height: '100%', backgroundColor: '#e0e0e0', padding: '20px' }}>
      <h2 style={{ fontSize: '2vh' }}>Edit Template Details</h2>
      
      {/* Render container details */}
      <div>
        <h3>Containers</h3>
        {currentTemplate.containers.length > 0 ? (
          currentTemplate.containers.map(container => (
            <div key={container.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <strong>{container.title}</strong>
                <p>
                  Top Left: ({container.topLeft.x}, {container.topLeft.y}) | 
                  Bottom Right: ({container.bottomRight.x}, {container.bottomRight.y})
                </p>
              </div>
              <div style={{ marginLeft: '10px' }}>
                {/* Color Picker */}
                <input
                  type="color"
                  value={container.color || '#f0f0f0'}
                  onChange={(e) => handleColorChange(container.id, e.target.value)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No containers found for this template.</p>
        )}
      </div>
    </div>
  );
};

export default TemplateDetail;
