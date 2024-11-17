import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ContentItem {
  id: number;
  title: string;
  text: string;
  type: string;
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
  const [firstIndex, setFirstIndex] = useState<number>(1); 
  const [secondIndex, setSecondIndex] = useState<number>(1);  

  useEffect(() => {
    setLocalContentItems(Array.isArray(contentItems) ? contentItems : []);
  }, [contentItems]);

  const addContentItem = () => {
    const newId = localContentItems.length + 1;
    const newContentItem = { id: newId, title: '', text: '', type: 'text' };
    const updatedContentItems = [...localContentItems, newContentItem];
    setLocalContentItems(updatedContentItems);
    const newPage = Math.ceil(updatedContentItems.length / ITEMS_PER_PAGE);
    setCurrentPage(newPage);
    onUpdateUserData({ content: updatedContentItems });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, field: 'title' | 'text') => {
    const updatedContentItems = localContentItems.map(item => 
      item.id === id ? { ...item, [field]: e.target.value } : item
    );
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const updatedContentItems = localContentItems.map(item => 
      item.id === id ? { ...item, type: e.target.value } : item
    );
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
  };

  const deleteContentItem = (id: number) => {
    const updatedContentItems = localContentItems.filter(item => item.id !== id);
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
    const totalPages = Math.ceil(updatedContentItems.length / ITEMS_PER_PAGE);
    setCurrentPage(totalPages);
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

  const handleSwap = () => {

  const Idx1 = firstIndex - 1;
  const Idx2 = secondIndex - 1;

  // Check if the indices are valid and not the same
  if (Idx1 !== Idx2 && Idx1 >= 0 && Idx2 >= 0 && Idx1 < localContentItems.length && Idx2 < localContentItems.length) {
    // Swap the content items
    const updatedContentItems = [...localContentItems];
    [updatedContentItems[Idx1], updatedContentItems[Idx2]] = [updatedContentItems[Idx2], updatedContentItems[Idx1]];

    // Update state and propagate changes
    setLocalContentItems(updatedContentItems);
    onUpdateUserData({ content: updatedContentItems });
  }
};



  return (
    <div style={{ height: '100%', backgroundColor: '#e0e0e0', padding: '20px' }}>
      <h2 style={{ fontSize: '2vh' }}>Manage Content Items</h2>
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
            {/* Swap Inputs */}
     
        <input
          type="number"
          min="1"
          max={localContentItems.length}
          value={firstIndex}
          onChange={(e) => setFirstIndex(Number(e.target.value))}
          style={{ borderRight: '1px solid grey', padding: '10px' }}
        />
        <input
          type="number"
          min="1"
          max={localContentItems.length}
          value={secondIndex}
          onChange={(e) => setSecondIndex(Number(e.target.value))}
          style={{  padding: '10px' }}
        />
        <button onClick={handleSwap}  style={{ marginTop: '10px', padding: '10px', backgroundColor: 'lightblue' }}>Swap</button>
      </div>

   

      {paginatedItems.map(contentItem => (
        <div key={contentItem.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={contentItem.title}
            onChange={(e) => handleInputChange(e, contentItem.id, 'title')}
            style={{ width: '80%', padding: '10px', marginBottom: '5px', borderRight: '1px solid grey' }}
            placeholder="Title"
          />
          {/* Dropdown for selecting content type */}
          <select
            value={contentItem.type}
            onChange={(e) => handleTypeChange(e, contentItem.id)}
             style={{
    padding: '10px', 
    width: '80%',
    fontSize: '16px', 
    borderRadius: '5px', 
    marginBottom: '5px',
    appearance: 'none', 
    backgroundColor: '#fff', 
    textAlign: 'center',
  }}
          >
            <option value="text">Text  </option>
            <option value="image">Image  </option>
          </select>
          <input
            type="text"
            value={contentItem.text}
            onChange={(e) => handleInputChange(e, contentItem.id, 'text')}
            style={{ width: '80%', padding: '10px', marginBottom: '5px', borderLeft: '1px solid grey' }}
            placeholder={contentItem.type === 'text' ? 'Text Content' : 'Content URL'}
          />
          <button
            onClick={() => deleteContentItem(contentItem.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '10px',
            }}
          >
            <Icon icon="mdi:trash" width="40" />
          </button>
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
