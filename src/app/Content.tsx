// Content.tsx
import React from 'react';

interface ContentProps {
  contentItems: Array<{
    id: number;
    title: string;
    text: string;
  }>;
  onInputChange: (id: number, field: 'title' | 'text', value: string) => void;
}

const Content: React.FC<ContentProps> = ({ contentItems, onInputChange }) => {
  return (
    <div style={{ height: '87vh', backgroundColor: '#e0e0e0', padding: '20px' }}>
      <h2>Edit Container Text</h2>
      {contentItems.map(content => (
        <div key={content.id} style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={content.title}
            onChange={(e) => onInputChange(content.id, 'title', e.target.value)}
            placeholder="Title"
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <textarea
            value={content.text}
            onChange={(e) => onInputChange(content.id, 'text', e.target.value)}
            placeholder="Text"
            rows={4}
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default Content;
