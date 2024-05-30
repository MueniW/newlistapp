import React, { useState, useEffect, useRef } from 'react';
import './ListGroup.css';
import './styles.css';
import alarmSound from './alarm.mp3'; // Ensure this path is correct

function ListGroup() {
  const [items, setItems] = useState([
    { id: 1, text: "Shopping", checked: false, editable: false, dueDate: '', dueTime: '' },
    { id: 2, text: "Make Calls", checked: false, editable: false, dueDate: '', dueTime: '' },
    { id: 3, text: "Meetings", checked: false, editable: false, dueDate: '', dueTime: '' },
    { id: 4, text: "Book Club", checked: false, editable: false, dueDate: '', dueTime: '' },
    { id: 5, text: "Generate Reports", checked: false, editable: false, dueDate: '', dueTime: '' },
  ]);

  const [newItem, setNewItem] = useState("");
  const [newItemDueDate, setNewItemDueDate] = useState("");
  const [newItemDueTime, setNewItemDueTime] = useState("");
  const audioRef = useRef(null); // Reference to the audio instance

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const editItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, editable: !item.editable } : item));
  };

  const handleChange = (id, event) => {
    setItems(items.map(item => item.id === id ? { ...item, text: event.target.value } : item));
  };

  const handleDueDateChange = (id, event) => {
    setItems(items.map(item => item.id === id ? { ...item, dueDate: event.target.value } : item));
  };

  const handleDueTimeChange = (id, event) => {
    setItems(items.map(item => item.id === id ? { ...item, dueTime: event.target.value } : item));
  };

  const addItem = () => {
    if (newItem.trim() !== "") {
      const newItemObject = {
        id: items.length + 1,
        text: newItem,
        checked: false,
        editable: false,
        dueDate: newItemDueDate,
        dueTime: newItemDueTime,
      };
      setItems([...items, newItemObject]);
      setNewItem("");
      setNewItemDueDate("");
      setNewItemDueTime("");
    }
  };

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      items.forEach(item => {
        if (item.dueDate && item.dueTime) {
          const dueDateTime = new Date(`${item.dueDate}T${item.dueTime}`);
          if (now >= dueDateTime && !item.checked) {
            playAlarm();
            alert(`Reminder: ${item.text}`);
          }
        }
      });
    };

    const intervalId = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [items]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(alarmSound);
    audioRef.current = audio;

    audio.play().catch(error => console.error('Audio playback failed:', error));

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 180000); // Stop after 3 minutes (180,000 milliseconds)
  };

  return (
    <div className="list-container">
      <h1>Wife's To Do List</h1>
      <div className="add-item">
        <input 
          type="text" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)} 
          placeholder="Add a new item" 
        />
        <input 
          type="date" 
          value={newItemDueDate} 
          onChange={(e) => setNewItemDueDate(e.target.value)} 
          placeholder="Due Date" 
        />
        <input 
          type="time" 
          value={newItemDueTime} 
          onChange={(e) => setNewItemDueTime(e.target.value)} 
          placeholder="Due Time" 
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul className="list-group">
        {items.map(item => (
          <li key={item.id} className={`list-group-item ${item.checked ? 'checked' : ''}`}>
            {item.editable ? (
              <>
                <input type="text" value={item.text} onChange={(e) => handleChange(item.id, e)} />
                <input type="date" value={item.dueDate} onChange={(e) => handleDueDateChange(item.id, e)} />
                <input type="time" value={item.dueTime} onChange={(e) => handleDueTimeChange(item.id, e)} />
              </>
            ) : (
              <>
                <span>{item.text}</span>
                <span>{item.dueDate} {item.dueTime}</span>
              </>
            )}
            <button onClick={() => toggleCheck(item.id)}>Check</button>
            <button onClick={() => editItem(item.id)}>{item.editable ? "Save" : "Edit"}</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;


























































