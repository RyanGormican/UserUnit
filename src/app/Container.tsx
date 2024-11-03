import React from 'react';
import { Icon } from '@iconify/react';

interface ContentItem {
  id: number;
  title: string;
  text: string;
}
interface Template {
  id: number;
  containers: {
    id: number;
    title: string;
    contentId: number;
    width: number;
    height: number;
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  }[];
  name: string; 
}
interface ContainerProps {
  templateId: number;
  templateData: Template[]; 
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
  containerId: number;
  isEdit: boolean;
  onContentIdChange: (containerId: number, newContentId: number) => void;
  onUpdateUserData: (newData: any) => void; 
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

    // Calculate potential new top left position
    const newTopLeftX = container.topLeft.x + (dx / window.innerWidth) * 100;
    const newTopLeftY = container.topLeft.y + (dy / window.innerHeight) * 100;

    // Constrain top left to be non-negative
    const constrainedTopLeftX = Math.max(newTopLeftX, 0); 
    const constrainedTopLeftY = Math.max(newTopLeftY, 0); 
    const finalTopLeftX = Math.min(constrainedTopLeftX, container.bottomRight.x - minWidth);
    const finalTopLeftY = Math.min(constrainedTopLeftY, container.bottomRight.y - minHeight);

    // Calculate new width and height based on the final constrained top left position
    const newWidth = Math.max(Math.min(container.bottomRight.x - finalTopLeftX, maxWidth), minWidth);
    const newHeight = Math.max(Math.min(container.bottomRight.y - finalTopLeftY, maxHeight), minHeight);

    // Create updated container
    const updatedContainer = {
      ...container,
      topLeft: { x: finalTopLeftX, y: finalTopLeftY },
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

    // Calculate potential new bottom right position
    const newBottomRightX = container.bottomRight.x + (dx / window.innerWidth) * 100;
    const newBottomRightY = container.bottomRight.y + (dy / window.innerHeight) * 100;

    // Ensure the new bottom right is at least 6vw to the right of the top left
    const constrainedBottomRightX = Math.max(newBottomRightX, container.topLeft.x + minWidth);
    // Ensure the new bottom right is at least 6vh below the top left
    const constrainedBottomRightY = Math.max(newBottomRightY, container.topLeft.y + minHeight);

    // Calculate new width and height based on the constrained bottom right position
    const newWidth = Math.max(Math.min(constrainedBottomRightX - container.topLeft.x, maxWidth), minWidth);
    const newHeight = Math.max(Math.min(constrainedBottomRightY - container.topLeft.y, maxHeight), minHeight);

    // Create updated container
    const updatedContainer = {
      ...container,
      bottomRight: { x: constrainedBottomRightX, y: constrainedBottomRightY },
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
