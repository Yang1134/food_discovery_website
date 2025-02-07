import React, { useState , useEffect} from 'react';
import './TagPopup.css';

function TagPopup({ open, restaurantTags, allTags, onClose, onSave }) {
  console.log(restaurantTags)
  console.log(allTags)
  const [selectedTags, setSelectedTags] = useState(restaurantTags);


  useEffect(() => {
    if (open) {
      setSelectedTags(restaurantTags); // Update selectedTags when popup is opened
    }
  }, [restaurantTags, open]); // Only trigger when restaurantTags or open state changes

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSave = () => {
    onSave(selectedTags);  // Save the updated tags
    onClose();  // Close the popup
  };

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Tags</h2>
        <div className="tag-list">
          {allTags.map((tag) => (
            <div key={tag} className="tag-item">
              <input
                type="checkbox"
                id={tag}
                checked={selectedTags.includes(tag)}  // Preselect based on selectedTags
                onChange={() => handleTagToggle(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TagPopup;
