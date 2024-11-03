import React from 'react';
import { Icon } from '@iconify/react';

interface ContentItem {
  id: number;
  title: string;
  text: string;
}
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
    // Function to check if a new button can fit in the space
  const canFitInRegion = (newTopLeft: { x: number; y: number }, width: number, height: number): boolean => {
    // Find the template by templateId
    const template = templateData.find(t => t.id === templateId);
    
    if (!template) return true; // If no template found, allow placement

    // Check against all containers in that template
    for (const cont of template.containers) {
      const { topLeft, bottomRight } = cont;

      // Check if the new button overlaps with existing containers
      const isOverlapping = (
        newTopLeft.x < bottomRight.x &&
        newTopLeft.x + width > topLeft.x &&
        newTopLeft.y < bottomRight.y &&
        newTopLeft.y + height > topLeft.y
      );

      if (isOverlapping) {
        return false; // Collision detected, cannot fit
      }
    }

    return true; // No collisions detected
  };
 // Define the dimensions for the buttons
const buttonWidth = container.width; // Full width of the container
const buttonHeight = 6; // 6vh height

  // Define button positions with their respective conditions
  const isTopMiddleFit = container.topLeft.y >= buttonHeight && canFitInRegion(
    { x: container.topLeft.x, y: container.topLeft.y - 6 }, // Position above the container
    buttonWidth, 6 // Check against full width of the container
  );

  const isBottomMiddleFit = container.bottomRight.y <= 81 && canFitInRegion(
    { x: container.topLeft.x, y: container.bottomRight.y }, // Centered below the container
    buttonWidth, 6 // Check against full width of the container
  );

  const isLeftMiddleFit = container.topLeft.x >= 6 && canFitInRegion(
    { x: container.topLeft.x-6, y: container.topLeft.y }, // Centered on the left side
    6, container.height // Check against full height of the button
  );

  const isRightMiddleFit = container.bottomRight.x <= 94 && canFitInRegion(
    { x: container.bottomRight.x, y: container.topLeft.y }, // Centered on the right side
    6, container.height // Check against full height of the button
  );
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

    // Check for conflicts with other containers
    const isConflicting = (newContainer: typeof updatedContainer) => {
      return templateData.some(t => 
        t.id === templateId && 
        t.containers.some(c => {
          if (c.id === container.id) return false; // Skip itself
          const { topLeft, bottomRight } = c;
          return (
            newContainer.topLeft.x +0.01 <= bottomRight.x &&
            newContainer.bottomRight.x -0.01 >= topLeft.x &&
            newContainer.topLeft.y+0.01 <= bottomRight.y &&
            newContainer.bottomRight.y-0.01 >= topLeft.y
          );
        })
      );
    };

    if (!isConflicting(updatedContainer)) {
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
    }
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

    // Ensure the new bottom right is at least minWidth to the right of the top left
    const constrainedBottomRightX = Math.max(newBottomRightX, container.topLeft.x + minWidth);
    // Ensure the new bottom right is at least minHeight below the top left
    const constrainedBottomRightY = Math.max(newBottomRightY, container.topLeft.y + minHeight);

    // Constrain the bottom right position to the maximum allowed limits
    const finalBottomRightX = Math.min(constrainedBottomRightX, 100); // Ensure x does not exceed 100
    const finalBottomRightY = Math.min(constrainedBottomRightY, 87); // Ensure y does not exceed 87

    // Calculate new width and height based on the constrained bottom right position
    const newWidth = Math.max(Math.min(finalBottomRightX - container.topLeft.x, maxWidth), minWidth);
    const newHeight = Math.max(Math.min(finalBottomRightY - container.topLeft.y, maxHeight), minHeight);

    // Create updated container
    const updatedContainer = {
      ...container,
      bottomRight: { x: finalBottomRightX, y: finalBottomRightY },
      width: newWidth,
      height: newHeight,
    };

    // Check for conflicts with other containers
    const isConflicting = (newContainer: typeof updatedContainer) => {
      return templateData.some(t => 
        t.id === templateId && 
        t.containers.some(c => {
          if (c.id === container.id) return false; // Skip itself
          const { topLeft, bottomRight } = c;
          return (
            newContainer.topLeft.x+0.01 <= bottomRight.x &&
            newContainer.bottomRight.x-0.01 >= topLeft.x &&
            newContainer.topLeft.y+0.01 <= bottomRight.y &&
            newContainer.bottomRight.y-0.01 >= topLeft.y
          );
        })
      );
    };

    if (!isConflicting(updatedContainer)) {
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
    }
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
const containerOffsets = {
  top: { x: 0, y: -6, width: container.width, height: 6 },
  bottom: { x: 0, y: container.height, width: container.width, height: 6 },
  left: { x: -6, y: 0, width: 6, height: container.height },
  right: { x: container.width, y: 0, width: 6, height: container.height },
};

const generateContainer = (position: 'top' | 'bottom' | 'left' | 'right') => {
  const offset = containerOffsets[position];

  const newContainer: ContainerData = {
    id: Date.now(),
    title: 'New Container',
    contentId: 1,
    width: offset.width,
    height: offset.height,
    topLeft: {
      x: container.topLeft.x + offset.x,
      y: container.topLeft.y + offset.y,
    },
    bottomRight: {
      x: container.topLeft.x + offset.x + offset.width,
      y: container.topLeft.y + offset.y + offset.height,
    },
  };

  const updatedTemplate = templateData.map(t =>
    t.id === templateId
      ? {
          ...t,
          containers: [...t.containers, newContainer],
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
      {isEdit && (
  <>
    {/* Top middle button */}
{isTopMiddleFit  && (
  <button
    onClick={() => generateContainer('top')}
    style={{
      position: 'fixed',
      left: `${container.topLeft.x + container.width / 2}vw`,
      top: `${container.topLeft.y + 10}vh`,
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      padding: '5px 10px',
      backgroundColor: 'lightblue',
    }}
  >
    +
  </button>
)}

    {/* Bottom middle button */}
    {isBottomMiddleFit  && (
    <button
      onClick={() => generateContainer('bottom')}
      style={{
        position: 'fixed',
        left: `${container.topLeft.x + container.width / 2}vw`,
        top: `${container.bottomRight.y + 13}vh`,
        transform: 'translate(-50%, 50%)',
        zIndex: 10,
        padding: '5px 10px',
        backgroundColor: 'lightblue',
      }}
    >
      +
    </button>
    )}
    {/* Left middle button */}
    {isLeftMiddleFit  && (
    <button
       onClick={() => generateContainer('left')}
      style={{
        position: 'fixed',
        left: `${container.topLeft.x-2}vw`,
        top: `${container.topLeft.y + 13 + container.height / 2}vh`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        padding: '5px 10px',
        backgroundColor: 'lightblue',
      }}
    >
      +
    </button>
    )}
    {/* Right middle button */}
    {isRightMiddleFit && (
    <button
  onClick={() => generateContainer('right')}
      style={{
        position: 'fixed',
        left: `${container.bottomRight.x }vw`,
        top: `${container.topLeft.y + 13 + container.height / 2}vh`,
        transform: 'translate(50%, -50%)',
        zIndex: 10,
        padding: '5px 10px',
        backgroundColor: 'lightblue',
      }}
    >
      +
    </button>
    )}
  </>
)}
    </div>
  );
};

export default Container;