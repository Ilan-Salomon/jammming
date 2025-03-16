import React, { useState, useEffect } from "react";
import logo from "./OLD/logo.png";
import styles from "./App.module.css";
import { SearchBar } from "./SearchBar";
import { Tracklist } from "./Tracklist";
import Playlist from "./Playlist";



async function getSpotifyToken() {
  const clientId = "1674121457ca4bba8f4ab14eba675207"; // Replace with your Client ID
  const clientSecret = "a2abb117ff3c4541b2c9323929831dd2"; // Replace with your Client Secret

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();
  console.log(data.access_token)
  return data.access_token; // Returns the access token
}

function App() {
  const [tracks, setTracks] = useState(null);
  const [extractedData, setExtractedData] = useState([]); // ✅ State for extracted tracks
  //const [playlist, setPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]); // ✅ Define playlistTracks state
  const [trackAddedMessages, setTrackAddedMessages] = useState([]); // Store multiple messages

  const addTrackToPlaylist = (track) => {
    if (!playlistTracks.some(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
  
      // Add the new message to the array
      setTrackAddedMessages(prevMessages => [...prevMessages, `${track.trackName} added to playlist!`]);
  
      // Hide each message individually after 3 seconds
      setTimeout(() => {
        setTrackAddedMessages(prevMessages => prevMessages.slice(1)); // Remove first message
      }, 3000);
    }
  };
  


  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };
  


  async function GetArtistData(input) {
    try {
      const accessToken = await getSpotifyToken(); // Get token first

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${input}&type=track&include_external=audio`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching artist data:", error);
    }
  }

  // ✅ Extract track data when tracks update
  useEffect(() => {
    if (tracks && tracks.tracks?.items) {
      const formattedTracks = tracks.tracks.items.map((item) => ({
        id: item.id, // ✅ Add track ID to prevent duplicates
        albumName: item.album?.name || "Unknown Album",
        trackName: item.name || "Unknown Track",
        firstArtist: item.artists?.[0]?.name || "Unknown Artist",
      }));
  
      setExtractedData(formattedTracks);
      console.log(formattedTracks); // Debugging
    }
  }, [tracks]);
  

  const addSearchWord = (searchWord) => {
    GetArtistData(searchWord);
    console.log(searchWord);
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <h1>Jammming Music</h1>
        </div>
  
        <main>
        <div className={styles.trackAddedMessageContainer}>
  {trackAddedMessages.map((message, index) => (
    <div key={index} className={styles.trackAddedMessage}>
      {message}
    </div>
  ))}
</div>

          <SearchBar addSearchWord={addSearchWord} />
          
          {/* ✅ Flex container for Tracklist & Playlist */}
          <div className={styles.contentContainer}>
            <div className={styles.section}>
              <h1 className={styles.sectionTitle}>Track List</h1>
              {extractedData.length > 0 ? (
                <Tracklist 
                  tracks={extractedData} 
                  addTrackToPlaylist={addTrackToPlaylist} 
                />
              ) : (
                <p>No tracks found. Try a different search!</p>
              )}
            </div>
  
            <div className={styles.section}>
              <h1 className={styles.sectionTitle}>Your Playlist</h1>
              <Playlist 
                playlistTracks={playlistTracks} 
                onRemoveTrack={removeTrackFromPlaylist} 
              />
            </div>
          </div>
        </main>
  
        <a className={styles.appLink}>© Jammming all rights reserved</a>
      </header>
    </div>
  );
  

}

export default App;
