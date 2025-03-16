import React, { useState } from 'react';
import styles from './SearchBar.module.css'; // Import CSS file

export function SearchBar(props) {
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.trim().length > 0) {
      props.addSearchWord(text);
      setText("");
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput} // Apply styles
        aria-label="Search for a track"
        placeholder="Search for a track..."
        value={text}
        onChange={handleTextChange}
      />
      <button type="submit" className={styles.searchButton}>Search</button>
    </form>
  );
}
