import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { firestore2 } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '/src/app/components/Feedback/feedback.css';

const Feedback = ({ isModalOpen, setIsModalOpen }) => {
  const [name, setName] = useState('Anonymous');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore2, 'suggestions'), {
        name: name.trim(),
        topic: 'UserUnit',
        suggestion: suggestion.trim(),
        timestamp: serverTimestamp(),
        status: 'incomplete',
      });
      setName('Anonymous');
      setSuggestion('');
    } catch (error) {
      console.error('Error adding suggestion: ', error);
    }
  };

  const handleProjectClick = async () => {
    try {
      await addDoc(collection(firestore2, 'feedback'), {
        project: 'UserUnit',
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Feedback</h5>
            <button type="button" className="close" onClick={() => setIsModalOpen(false)}>
              <Icon icon="mdi:close" width="24" />
            </button>
          </div>
          <div className="modal-body">
            <button className="improvement-button" onClick={handleProjectClick}>
              Signal for Improvement
            </button>
            <h2>Leave a Suggestion</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="suggestion">Suggestion</label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Your suggestion"
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Feedback;
