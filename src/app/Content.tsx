import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
interface ContentItem {
  id: number;
  title: string;
  text: string;
}

interface ContentProps {
  contentItems: ContentItem[];
  onUpdateUserData: (newData: Partial<{ content: ContentItem[] }>) => void;
}

const ITEMS_PER_PAGE = 10; // Number of items to display per page

const Content: React.FC<ContentProps> = ({ contentItems, onUpdateUserData }) => {
  const [localContentItems, setLocalContentItems] = useState<ContentItem[]>(Array.isArray(contentItems) ? contentItems : []);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState<number>(1); 

  useEffect(() => {
    setLocalContentItems(Array.isArray(contentItems) ? contentItems : []);
    setCurrentPage(totalPages);
  }, [contentItems]);

  const addContentItem = () => {
    const newId = localContentItems.length + 1;
    const newContentItem = { id: newId, title: '', text: '' };
    const updatedContentItems = [...localContentItems, newContentItem];
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, field: 'title' | 'text') => {
    const updatedContentItems = localContentItems.map(item => 
      item.id === id ? { ...item, [field]: e.target.value } : item
    );
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
  };

  const filteredContentItems = localContentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredContentItems.length / ITEMS_PER_PAGE);

  // Slice the array for the current page
  const paginatedItems = filteredContentItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }
}, [filteredContentItems, totalPages, currentPage]);
  return (
    <div style={{ height: '100%', backgroundColor: '#e0e0e0', padding: '20px' }}>
      <h2 style={{ fontSize: '2vh' }}>Edit Container Text</h2>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search by title"
          style={{ width: '10%', padding: '10px', marginBottom: '10px' }}
        />
        {searchTerm.length === 0 && (
          <button onClick={addContentItem} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'lightblue' }}>
            Add New Content Item
          </button>
        )}
      </div>

      {paginatedItems.map(contentItem => (
        <div key={contentItem.id} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={contentItem.title}
            onChange={(e) => handleInputChange(e, contentItem.id, 'title')}
            style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
            placeholder="Title"
          />
          <input
            type="text"
            value={contentItem.text}
            onChange={(e) => handleInputChange(e, contentItem.id, 'text')}
            style={{ width: '100%', padding: '10px' }}
            placeholder="Content"
          />
        </div>
      ))}

      {/* Pagination controls */}
        {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            <Icon icon="mdi:arrow-left" color={currentPage === 1 ? 'gray' : 'black'} width="20" />
          </button>
          <span style={{ margin: '0 10px' }}>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            <Icon icon="mdi:arrow-right" color={currentPage === totalPages ? 'gray' : 'black'} width="20" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;
