import React from 'react';
import { Icon } from '@iconify/react';

interface ContentItem {
  id: number;
  title: string;
  text: string;
}

interface ContainerProps {
  templateId: number;
  container: {
    id: number;
    title: string;
    contentId: number;
    width: number;
    height: number;
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  contentItems: ContentItem[];
  isEdit: boolean;
  onContentIdChange: (containerId: number, newContentId: number) => void;
  onUpdateUserData: (newData: any) => void; // For updating the user data
}

const Container: React.FC<ContainerProps> = ({
  templateId,
  templateData,
  container,
  containerId,
  contentItems,
  isEdit,
  onContentIdChange,
  onUpdateUserData,
}) => {
  const contentItem = Array.isArray(contentItems)
    ? contentItems.find(content => content.id === container.contentId)
    : null;

  const minWidth = 6; // minimum width in vw
  const minHeight = 6; // minimum height in vh
  const maxWidth = 100; // maximum width in vw
  const maxHeight = 87; // maximum height in vh

const handleDragTopLeft = (e: React.MouseEvent) => {
  e.preventDefault();
  const startX = e.clientX;
  const startY = e.clientY;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;

    // Calculate new top left position and width/height
    const newTopLeft = {
      x: Math.max(container.topLeft.x + (dx / window.innerWidth) * 100, 0), // Prevent negative X
      y: Math.max(container.topLeft.y + (dy / window.innerHeight) * 100, 0), // Prevent negative Y
    };

    const newWidth = Math.max(Math.min(container.width - (dx / window.innerWidth) * 100, maxWidth), minWidth); // Decrease width
    const newHeight = Math.max(Math.min(container.height - (dy / window.innerHeight) * 100, maxHeight), minHeight); // Decrease height

    // Create updated container
    const updatedContainer = {
      ...container,
      topLeft: newTopLeft,
      width: newWidth,
      height: newHeight,
    };

    // Pass the updated container to the parent for updating
    const updatedTemplate = templateData.map(t =>
      t.id === templateId
        ? {
            ...t,
            containers: t.containers.map(c =>
              c.id === container.id ? updatedContainer : c // Update only the modified container
            ),
          }
        : t
    );

 

    // Call onUpdateUserData with the new template structure
    onUpdateUserData({ template: updatedTemplate });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const handleDragBottomRight = (e: React.MouseEvent) => {
  e.preventDefault();
  const startX = e.clientX;
  const startY = e.clientY;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;

    // Calculate new bottom right position and width/height
    const newBottomRight = {
      x: Math.min(container.bottomRight.x + (dx / window.innerWidth) * 100, maxWidth), // Prevent exceeding max width
      y: Math.min(container.bottomRight.y + (dy / window.innerHeight) * 100, maxHeight), // Prevent exceeding max height
    };

    const newWidth = Math.max(Math.min(newBottomRight.x - container.topLeft.x, maxWidth), minWidth); // Update width
    const newHeight = Math.max(Math.min(newBottomRight.y - container.topLeft.y, maxHeight), minHeight); // Update height

    // Create updated container
    const updatedContainer = {
      ...container,
      bottomRight: newBottomRight,
      width: newWidth,
      height: newHeight,
    };

    // Pass the updated container to the parent for updating
    const updatedTemplate = templateData.map(t =>
      t.id === templateId
        ? {
            ...t,
            containers: t.containers.map(c =>
              c.id === container.id ? updatedContainer : c // Update only the modified container
            ),
          }
        : t
    );


    // Call onUpdateUserData with the new template structure
    onUpdateUserData({ template: updatedTemplate });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};


const handleDeleteContainer = () => {

  const updatedTemplate = templateData.map(t =>
    t.id === templateId
      ? {
          ...t,
          containers: t.containers.filter(c => c.id !== container.id), 
        }
      : t
  );

  onUpdateUserData({ template: updatedTemplate });
};




  return (
    <div
      style={{
        position: 'absolute',
        left: `${container.topLeft.x}vw`,
        top: `${container.topLeft.y + 13}vh`,
        width: `${container.width}vw`,
        height: `${container.height}vh`,
        backgroundColor: '#f0f0f0',
        opacity: isEdit ? 1 : 0.6,
        overflowY: 'auto',
        margin: 0,
      }}
    >
      {isEdit && (
        <select
          value={container.contentId}
          onChange={(e) => onContentIdChange(container.id, Number(e.target.value))} // Correctly update contentId
          style={{
            width: '25%',
            marginTop: '5px',
            position: 'absolute',
            zIndex: 11,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Array.isArray(contentItems) && contentItems.map(content => (
            <option key={content.id} value={content.id}>
              {content.title || 'Untitled'}
            </option>
          ))}
        </select>
      )}

      <p>{contentItem ? contentItem.text : 'No content available'}</p>

      {isEdit && (
        <>
          <button
            onMouseDown={handleDragTopLeft}
            style={{
              position: 'fixed',
              left: `${container.topLeft.x}vw`,
              top: `${container.topLeft.y + 13}vh`,
              zIndex: 10,
              padding: '5px 10px',
              backgroundColor: 'lightblue',
            }}
          >
            <Icon icon="mdi:arrow-top-left" width="20" />
          </button>

          <button
            onMouseDown={handleDragBottomRight}
            style={{
              position: 'fixed',
              left: `${container.bottomRight.x - 2}vw`,
              top: `${container.bottomRight.y + 10}vh`,
              zIndex: 10,
              padding: '5px 10px',
              backgroundColor: 'lightblue',
            }}
          >
            <Icon icon="mdi:arrow-bottom-right" width="20" />
          </button>
          
          <button
            onClick={handleDeleteContainer}
            style={{
              position: 'fixed',
              left: `${container.bottomRight.x - 1 - container.width / 2}vw`,
              top: `${container.bottomRight.y + 10}vh`,
              zIndex: 10,
              padding: '5px 10px',
              backgroundColor: 'lightblue',
            }}
          >
            <Icon icon="mdi:trash-can" width="20" />
          </button>
        </>
      )}
    </div>
  );
};

export default Container;
