import React from "react";
import styles from "./Playlist.module.css";

const Playlist = ({ playlistTracks, onRemoveTrack }) => {
  return (
    <div className={styles.playlistContainer}>
      {playlistTracks.length > 0 ? (
        <ul className={styles.playlistList}>
          {playlistTracks.map((track, index) => (
            <li key={track.id || index} className={styles.playlistItem}>
              <span>{track.trackName} - {track.firstArtist}</span>
              <button 
                className={styles.removeButton} 
                onClick={() => onRemoveTrack(track)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tracks in your playlist. Add some!</p>
      )}
    </div>
  );
};

export default Playlist;
