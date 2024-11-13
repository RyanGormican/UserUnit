import React from 'react';
import { Icon } from '@iconify/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

        {/* List of help items with icons on the left and text on the right */}
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
        </ul>
      </div>
    </div>
  );
};

export default HelpModal;
