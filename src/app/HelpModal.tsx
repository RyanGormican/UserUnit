import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab?: string; 
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, selectedTab}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedTab ?? 'general');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(selectedTab ?? 'general'); // Reset active tab when modal is opened
    }
  }, [isOpen, selectedTab]);

  if (!isOpen) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="help-modal">
      <div className="modal-content">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <h2 style={{ textAlign: 'center', width: '100%' }}>Help</h2>
          <button
            type="button"
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={onClose}
          >
            <Icon icon="mdi:close" color="#aaa" width="24" />
          </button>
        </div>

        {/* Tab buttons */}
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => handleTabChange('general')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: activeTab === 'general' ? 'lightblue' : '#f1f1f1',
              color: activeTab === 'general' ? '#fff' : '#333',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            General
          </button>
           <button
            onClick={() => handleTabChange('container')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: activeTab === 'container' ? 'lightblue' : '#f1f1f1',
              color: activeTab === 'container' ? '#fff' : '#333',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Container
          </button>
          <button
            onClick={() => handleTabChange('templateDetails')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: activeTab === 'templateDetails' ? 'lightblue' : '#f1f1f1',
              color: activeTab === 'templateDetails' ? '#fff' : '#333',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Template Details
          </button>
        </div>

        {/* Conditional content based on active tab */}
        {activeTab === 'general' ? (
          <ul style={{ padding: 0, listStyle: 'none' }}>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="icon-park-outline:page" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Switch to Container mode to view the layout of containers within the selected template.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="ic:outline-list" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Switch to Content mode to manage the list of content to be added into the containers.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="lucide:book-template" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Switch to Template mode to manage the list of available templates.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="icon-park-outline:page-template" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Switch to Template Detail mode to manage the details within the selected template.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="ri:pencil-line" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Toggle Edit mode to manage container content and spacing in Container mode.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="mdi:import" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Import a JSON file to replace the stored data.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="material-symbols:download" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Download the stored data as a JSON file.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="mdi:camera" width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Download a PNG of the current template layout when in Container mode.</span>
            </li>
             <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="mdi:grid"  width="40" style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Toggle gridlines in Container mode for better precision</span>
            </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Icon icon="mdi:magnet"  width="40" rotate={45} style={{ marginRight: '10px', flexShrink: 0 }} />
              <span>Toggle Snap mode in Container mode to ensures resizes move in accordance with the gridline placements (I.e whole numbers)</span>
            </li>
          </ul>
        ) : activeTab === 'container' ? (
          <div>
            <ul style={{ padding: 0, listStyle: 'none' }}>
             <li style={{ marginBottom: '20px' }}>
                <strong>How can I resize a container?</strong>
          <p>
  A container can be resized by ensuring edit mode is on by clicking 
  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
    <Icon 
      icon="ri:pencil-line" 
      style={{ marginRight: '5px' }} 
    /> 
    to turn it into 
    <Icon 
      icon="ri:pencil-fill" 
      style={{ marginLeft: '5px' }} 
    />
  </span>
  . Once edit mode is on, you can click on either of the light blue  
  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
    <Icon 
      icon="mdi:arrow-top-left" 
      style={{ marginRight: '5px' }} 
    /> 
    and
    <Icon 
      icon="mdi:arrow-bottom-right" 
      style={{ marginLeft: '5px' }} 
    />
  </span> 
  buttons to drag the x and y positions of the corner the button is pointed at.
</p>


              </li>
              <li style={{ marginBottom: '20px' }}>
                <strong>How big can I size a container?</strong>
                <p>
  A container can be resized to a maximum area of the{' '}
  <span
    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
    onClick={() => handleTabChange('templateDetails')} 
  >
    template dimensions
  </span>
  .
</p>
              </li>
                 <li style={{ marginBottom: '20px' }}>
                <strong>What do the + buttons indicate</strong>
                <p>
  The blue + buttons indicate a possible space in which a container can exist that does not overlap with existing containers and does not violate  {' '}
  <span
    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
    onClick={() => handleTabChange('templateDetails')} 
  >
    template dimensions
  </span>
  .
</p>
              </li>

            </ul>
          </div>
        ) : activeTab === 'templateDetails' ? (
          <div>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: '20px' }}>
                <strong>What does 'Relative Template Positioning' mean?</strong>
                <p>
                  'Relative Template Positioning' refers to the placement of a container within the template, defined by the x and y coordinates of its upper-left and bottom-right corners. For example, if the bottom-right coordinates are (63.00, 52.41), it means the corner is at 63.00% of the width  and 52.41% of the height for the template dimensions.
                </p>
              </li>
              <li style={{ marginBottom: '20px' }}>
                <strong>What does 'Template Dimensions' indicate?</strong>
                <p>
                  'Template Dimensions' defines the area in which the user can construct and resize their containers. In relative positioning, (0,0) describes the top left corner and (100,100) describes the bottom right corner. The dimensions prevent construction on and above the buttons row along with extending past the browser window.
                </p>
              </li>
             <li style={{ marginBottom: '20px' }}>
                <strong>My container lines up with grid lines, yet my relative template positioning has a decimal number. Why?</strong>
                <p>
                Because the user can extend containers to the entire width of the window but not the entire height of the window, the positioning percentage is not a direct translation to the positioning of the grid.
                </p>
              </li>
                   </ul>
          </div>
        ) : (
          <div>No content for this tab</div> 
        )}
      </div>
    </div>
  );
};

export default HelpModal;
