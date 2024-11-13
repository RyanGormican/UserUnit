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
}

const ITEMS_PER_PAGE = 10; // Number of items per page for pagination

const Template: React.FC<TemplateProps> = ({ templateItems, onUpdateUserData, setCurrentTemplateId }) => {
  const [localTemplates, setLocalTemplates] = useState<TemplateItem[]>(templateItems);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Add state for search term

  useEffect(() => {
    setLocalTemplates(templateItems);
  }, [templateItems]);

  // Handle template name change
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

  // Copy template item
  const copyTemplateItem = (id: number) => {
    const templateToCopy = localTemplates.find(template => template.id === id);
    if (!templateToCopy) return;

    const newId = Date.now();
    const newTemplate: TemplateItem = {
      id: newId,
      name: `Copy of ${templateToCopy.name}`,
      containers: templateToCopy.containers.map(container => ({
        ...container,
        id: generateContainerId(),
      })),
    };

    const updatedTemplates = [...localTemplates, newTemplate];
    setLocalTemplates(updatedTemplates);
    onUpdateUserData({ template: updatedTemplates });
  };

  // Add a new template
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

    if (updatedTemplates.length === 1) {
      setCurrentTemplateId(newId);
    }
    const totalPages = Math.ceil(updatedTemplates.length / ITEMS_PER_PAGE);
    setCurrentPage(totalPages);
  };

  // Delete template item
  const deleteTemplateItem = (id: number) => {
    const updatedTemplates = localTemplates.filter(t => t.id !== id);
    setLocalTemplates(updatedTemplates);
    onUpdateUserData({ template: updatedTemplates });
    const totalPages = Math.ceil(updatedTemplates.length / ITEMS_PER_PAGE);
    setCurrentPage(totalPages);
  };

  // Filter templates by search term
  const filteredTemplates = localTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div style={{ height: '100%', backgroundColor: '#e0e0e0', padding: '20px' }}>
       <h2 style={{ fontSize: '2vh' }}>Edit Templates</h2>
        <div>
      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
           placeholder="Search by title"
          style={{ width: '10%', padding: '10px', marginBottom: '10px' }}
        />
 <button onClick={addTemplateItem} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'lightblue' }}>
        Add New Template
      </button>
      </div>
      
     
      </div>
      {paginatedTemplates.map(template => (
        <div key={template.id} style={{ marginBottom: '10px' }}>
          <div className="flex" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Copy icon */}
            <Icon
              icon="tabler:copy"
              width="40"
              onClick={() => copyTemplateItem(template.id)}
              style={{ cursor: 'pointer', marginRight: '10px' }}
            />

            {/* Template name input */}
            <input
              type="text"
              value={template.name}
              onChange={(e) => handleNameChange(template.id, e.target.value)}
              style={{ padding: '10px', width: '99vw' }}
            />

            {/* Delete (trash) icon */}
            <button
              onClick={() => deleteTemplateItem(template.id)}
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
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            <Icon icon="mdi:arrow-left" color={currentPage === 1 ? 'gray' : 'black'} width="20" />
          </button>
          <span style={{ margin: '0 10px' }}>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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

export default Template;
