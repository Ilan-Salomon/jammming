import React from "react";
import styles from "./Track.module.css";

const Track = ({ albumName, trackName, firstArtist, onAddTrack }) => {
  return (
    <div className={styles["track-container"]}>
      <div className={styles["track-info"]}>
        <h3 className={styles["track-name"]}>{trackName}</h3>
        <div className={styles["track-details"]}>
          <p>{firstArtist}</p>
          <span>|</span>
          <p>{albumName}</p>
        </div>
      </div>
      <button className={styles["add-button"]} onClick={onAddTrack}>+</button>
    </div>
  );
};

export default Track;
