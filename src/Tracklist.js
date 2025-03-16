import React from 'react';
import styles from './Tracklist.module.css';
import Track from "./Track";

export function Tracklist({ tracks, addTrackToPlaylist }) {
  if (!tracks || !Array.isArray(tracks)) {
    return <p className={styles.noTracks}>No tracks available.</p>;
  }

  return (
    <div className={styles.tracklist}>
      {tracks.map((track, index) => (
        <Track
            key={track.id || index}
            albumName={track.albumName}
            trackName={track.trackName}
            firstArtist={track.firstArtist}
            onAddTrack={() => addTrackToPlaylist(track)}
        />

      ))}
    </div>
  );
}
