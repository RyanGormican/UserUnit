import React from 'react';

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
  };
  contentItems: ContentItem[];
  isEdit: boolean;
  onContentIdChange: (containerId: number, newContentId: number) => void;
  onMouseDownWidth: () => void;
  onMouseDownHeight: () => void;
}

const Container: React.FC<ContainerProps> = ({
  templateId,
  container,
  contentItems,
  isEdit,
  onContentIdChange,
  onMouseDownWidth,
  onMouseDownHeight,
}) => {
  const contentItem = Array.isArray(contentItems) ? 
    contentItems.find(content => content.id === container.contentId) : null;

  return (
    <div
      style={{
        width: `${container.width}vw`,
        height: `${container.height}vh`,
        backgroundColor: '#f0f0f0',
        position: 'relative',
        opacity: isEdit ? 1 : 0.6,
        overflowY: 'auto',
        margin: 0,
      }}
    >
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
              zIndex: 10,
            }}
            onMouseDown={onMouseDownWidth}
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
              zIndex: 10,
            }}
            onMouseDown={onMouseDownHeight}
          />
        </>
      )}

      {isEdit && (
        <select
          value={container.contentId}
          onChange={(e) => onContentIdChange(container.id, Number(e.target.value))}
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
          {Array.isArray(contentItems) && contentItems.map(content => (
            <option key={content.id} value={content.id}>
              {content.title || 'Untitled'}
            </option>
          ))}
        </select>
      )}
      <p>{contentItem ? contentItem.text : 'No content available'}</p>
    </div>
  );
};

export default Container;
