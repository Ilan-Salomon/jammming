import React, { useState, useEffect } from "react";
import styles from "./Playlist.module.css";

const clientId = "1674121457ca4bba8f4ab14eba675207";  
const clientSecret = "a2abb117ff3c4541b2c9323929831dd2";  
const redirectUri = "https://https://cozy-puppy-ca1913.netlify.app//callback";  
const scopes = "playlist-modify-private playlist-modify-public";

const Playlist = ({ playlistTracks, onRemoveTrack, props }) => {
  const [text, setText] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  // 🔹 Handle Playlist Name Input
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

  // 🔹 Redirect User to Spotify Login
  const redirectToSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl; 
  };

  // 🔹 Extract Auth Code from URL
  const getAuthCodeFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");

    // 🔹 Remove the code from the URL to prevent reusing it
    if (authCode) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return authCode;
  };

  // 🔹 Exchange Auth Code for Access Token
const getAccessToken = async (authCode) => {
  if (!authCode) return; // Prevent API call if no auth code

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    console.log("Access Token before fetching user ID:", data.accessToken);


    if (data.access_token) {
      setAccessToken(data.access_token);
      console.log("Access Token:", data.access_token);

      // ✅ Show success alert when login is successful
      alert("✅ You have logged in successfully to your Spotify account!");
    } else {
      console.error("❌ Error getting access token:", data);
      alert("❌ Error getting access token. Please try logging in again.");
    }
  } catch (error) {
    console.error("❌ Error in token request:", error);
    alert("❌ Network error. Please try again.");
  }
};


  // 🔹 Fetch User ID
  const getUserId = async () => {
    if (!accessToken) return null;

    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      const data = await response.json();
      return data.id || null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const addTracksToPlaylist = async (playlistId) => {
    if (!accessToken) {
      alert("Please log in to Spotify first.");
      return;
    }
  
    const trackUris = playlistTracks.map(track => track.uri); // ✅ Extract track URIs
    if (trackUris.length === 0) {
      alert("Your playlist is empty. Add tracks before saving!");
      return;
    }
  
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }), // ✅ Send track URIs
    });
  
    const data = await response.json();
    if (data.snapshot_id) {
      alert("✅ Tracks added to your Spotify playlist!");
    } else {
      console.error("❌ Error adding tracks:", data);
      alert("❌ Failed to add tracks.");
    }
  };
  

  // 🔹 Create Playlist in Spotify
  const createPlaylist = async () => {
    if (!accessToken) {
      alert("Please log in to Spotify first.");
      return;
    }
  
    const userId = await getUserId();
    if (!userId) return;
  
    const playlistData = {
      name: text || "My Awesome Playlist",
      description: "Created via Spotify API",
      public: false
    };
  
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlistData),
    });
  
    const data = await response.json();
    if (data.id) {
      alert("✅ Playlist Created Successfully!");
      
      // 🔹 Add tracks to the playlist after it is created
      await addTracksToPlaylist(data.id); 
  
    } else {
      alert("❌ Error creating playlist.");
    }
  };
  

  // 🔹 Handle Spotify Login on Load
  useEffect(() => {
    const authCode = getAuthCodeFromURL();
    if (authCode && !accessToken) {
      getAccessToken(authCode);
    }
  }, [accessToken]); 
  

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        aria-label="Add a playlist name"
        placeholder="Add a playlist name..."
        value={text}
        onChange={handleTextChange}
      />

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
                  -
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks in your playlist. Add some!</p>
        )}
      </div>

      {!accessToken ? (
        <button type="button" onClick={redirectToSpotifyLogin} className={styles.searchButton}>
          Login to Spotify
        </button>
      ) : (
        <button 
          type="button" 
          onClick={createPlaylist} 
          className={styles.searchButton} 
          disabled={playlistTracks.length === 0}
          style={{ opacity: playlistTracks.length === 0 ? 0.5 : 1, cursor: playlistTracks.length === 0 ? "not-allowed" : "pointer" }}
        >
          Save to Spotify
        </button>
      )}
    </form>
  );
};

export default Playlist;
