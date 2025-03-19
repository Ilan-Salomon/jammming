# 🎵 Jamming App  

🚀 **Live Demo:** [Check it out on Netlify](https://cozy-puppy-ca1913.netlify.app/)  

## ⚠️ Important Notes  

- ✅ **Login to Spotify** works perfectly.  
- ✅ **Search functionality** works as expected.  
- ✅ **Adding and removing tracks** in a playlist works.  
- ❌ **"Save to Spotify" will not work** unless your email is added as a user in my Spotify app.  
  - If you want full functionality, clone the project and update your **clientId** and **clientSecret** in the Spotify API settings.  
  - Then, simply run `npm start` and enjoy! 🎶  

## 🎯 Functionality  

This app allows you to:  

- **Log in to Spotify** using OAuth authentication.  
- **Search for tracks** via the Spotify API.  
- **Select tracks and add them to a playlist.**  
- **Create a new playlist and add selected tracks.**  
- **Save the playlist to your Spotify account** (only works for authorized users).  

## 📁 List of Components  

- `App.js`  
- `index.js`  
- `Playlist.js`  
- `Search.js`  
- `SearchBar.js`  
- `Track.js`  
- `Tracklist.js`  

## 🔮 Future Improvements if you want to keep developing this project

- 🔑 **Allow login with any Spotify account** instead of requiring mine.  
- ⚡ **Optimize API calls** to refresh the token only every hour instead of on every request.  
- 🔐 **Require Spotify login before entering the page.**  
- 🎨 **Improve CSS for a better user experience.**  

---

💻 **Keep Coding and Have Fun! 🚀**  
