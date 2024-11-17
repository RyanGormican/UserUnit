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

interface ContentItem {
  id: number;
  title: string;
  text: string;
  type: string;  
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
  contentItems: ContentItem[]; 
}

const TemplateDetail: React.FC<TemplateProps> = ({
  templateItems,
  onUpdateUserData,
  setCurrentTemplateId,
  templateId,
  contentItems
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
          <div style={{ display: 'table', width: '100%' }}>
            <div style={{ display: 'table-row', fontWeight: 'bold' }}>
              <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>Content of Container</div>
              <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>Content Type</div> {/* New column header */}
              <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>Relative Template Positioning</div>
              <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>Color</div>
            </div>
            {currentTemplate.containers.map(container => {
              // Find the matching contentItem by contentId
              const matchingContent = contentItems.find(content => content.id === container.contentId);
              return (
                <div key={container.id} style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>
                    {matchingContent ? (
                      <span style={{ color: 'black' }}>
                        {matchingContent.title.trim() === '' ? 'Content Without a Title' : matchingContent.title}
                      </span>
                    ) : (
                      <span style={{ color: 'red' }}>No Content Selected</span>
                    )}
                  </div>
                  <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>
               {matchingContent ? matchingContent.type.charAt(0).toUpperCase() + matchingContent.type.slice(1) : 'No Content Selected'}
                  </div>
                  <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>
                    Top Left: ({container.topLeft.x.toFixed(2) }, {(container.topLeft.y.toFixed(2) * (100/87)).toFixed(2)}) | 
                    Bottom Right: ({container.bottomRight.x.toFixed(2)}, { (container.bottomRight.y *(100/87)).toFixed(2)})
                  </div>
                  <div style={{ display: 'table-cell', padding: '8px', border: '1px solid #ccc' }}>
                    <input
                      type="color"
                      value={container.color || '#f0f0f0'}
                      onChange={(e) => handleColorChange(container.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No containers found for this template.</p>
        )}
      </div>
    </div>
  );
};

export default TemplateDetail;
