
import { useEffect, useState, useRef } from "react";
import "./App.css";
import atPeaceAudio from "./assets/At Peace (Official Video) Karan Aujla Latest Punjabi Songs 2025.mp3";
import barsAudio from "./assets/52 Bars (Official Video) Karan Aujla Ikky Four You EP First Song Latest Punjabi Songs 2023.mp3";
import winningSpeechAudio from "./assets/Winning Speech (Music Video) Karan Aujla Mxrci Latest Punjabi Songs 2024.mp3";

const initialPlaylists = [
  {
    id: 1,
    title: "Karan Aujla",
    description: "Beats for high focus",
    cover: "🌙",
    songs: [
      {
        id: 1,
        title: "At Peace",
        artist: "Karan Aujla",
        duration: "2:52",
        audioUrl: atPeaceAudio,
      },
      {
        id: 2,
        title: "52 Bars",
        artist: "Karan Aujla",
        duration: "3:41",
        audioUrl: barsAudio,
      },
      {
        id: 3,
        title: "Winning Speech",
        artist: "Karan Aujla",
        duration: "3:57",
        audioUrl: winningSpeechAudio,
      },
    ],
  },
  {
    id: 2,
    title: "Morning Energy",
    description: "Fresh tracks to start strong",
    cover: "☀️",
    songs: [
      {
        id: 4,
        title: "First Light",
        artist: "Nova Pulse",
        duration: "3:05",
        audioUrl: "/songs/first-light.mp3",
      },
      {
        id: 5,
        title: "Run It Back",
        artist: "Skyline",
        duration: "2:51",
        audioUrl: "/songs/run-it-back.mp3",
      },
      {
        id: 6,
        title: "Bright Steps",
        artist: "Amber City",
        duration: "3:30",
        audioUrl: "/songs/bright-steps.mp3",
      },
    ],
  },
  {
    id: 3,
    title: "Chill Drive",
    description: "Smooth songs for the road",
    cover: "🚗",
    songs: [
      {
        id: 7,
        title: "Window Down",
        artist: "Coastline",
        duration: "3:18",
        audioUrl: "/songs/window-down.mp3",
      },
      {
        id: 8,
        title: "Cruise Control",
        artist: "Metro Fade",
        duration: "2:49",
        audioUrl: "/songs/cruise-control.mp3",
      },
      {
        id: 9,
        title: "Night Highway",
        artist: "Signal Blue",
        duration: "3:42",
        audioUrl: "/songs/night-highway.mp3",
      },
    ],
  },
];

function App() {
  // Use the module-level data here; the `playlists` state is declared below.
  const [selectedPlaylist, setSelectedPlaylist] = useState(initialPlaylists[0]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");



  const handleCreatePlaylist = () => {
    const name = newPlaylistName.trim();

    if (!name) return;

    const newPlaylist = {
      id: Date.now(),
      title: name,
      description: "Your new playlist",
      cover: "🎵",
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);

    setNewPlaylistName("");
    setShowCreatePlaylist(false);
    setSelectedPlaylist(newPlaylist);
  };

  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const getSongDuration = (song) => {
    if (!song?.duration) return 0;

    const [minutes, seconds] = song.duration.split(":").map(Number);

    return minutes * 60 + seconds;
  };

  // Reset progress when the song changes.
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [currentSong]);

  // Handle audio playback.
useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !currentSong) return;

  if (isPlaying) {
    audio.play().catch((error) => {
      console.error("Playback failed:", error);
      setIsPlaying(false);
    });
  } else {
    audio.pause();
  }
}, [isPlaying, currentSong]);

  // Close the modal using Escape.
  useEffect(() => {
    if (!isPlayerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPlayerOpen(false);
      }

      // Keyboard seeking.
      if (
        event.target.tagName !== "INPUT" &&
        audioRef.current &&
        currentSong
      ) {
        if (event.key === "ArrowRight") {
          audioRef.current.currentTime = Math.min(
            audioRef.current.currentTime + 5,
            audioRef.current.duration || 0
          );
        }

        if (event.key === "ArrowLeft") {
          audioRef.current.currentTime = Math.max(
            audioRef.current.currentTime - 5,
            0
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlayerOpen, currentSong]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlayerOpen(true);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const songs = selectedPlaylist.songs;
    const index = songs.findIndex(
      (song) => song.id === currentSong?.id
    );

    const nextSong = songs[(index + 1) % songs.length];

    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const songs = selectedPlaylist.songs;
    const index = songs.findIndex(
      (song) => song.id === currentSong?.id
    );

    // Restart the current track if it has played for more than 3 seconds.
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const previousSong =
      songs[(index - 1 + songs.length) % songs.length];

    setCurrentSong(previousSong);
    setIsPlaying(true);
  };

  const handleSeek = (event) => {
    const newTime = Number(event.target.value);

    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercent =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="app">
      <aside className="sidebar">
  <h2>Spotify Clone</h2>

  <nav>
    <a href="#home">Home</a>
    <a href="#search">Search</a>
    <a href="#library">Library</a>
  </nav>

  <button
    className="create-playlist-btn"
    onClick={() => setShowCreatePlaylist(true)}
  >
    <span>＋</span>
    Create Playlist
  </button>

  <div className="sidebar-playlists">
    {playlists.map((playlist) => (
      <div
        key={playlist.id}
        className={
          selectedPlaylist.id === playlist.id
            ? "sidebar-playlist active"
            : "sidebar-playlist"
        }
        onClick={() => setSelectedPlaylist(playlist)}
      >
        {playlist.cover} {playlist.title}
      </div>
    ))}
  </div>
</aside>

      <main className="main-content" id="home">
        <h1>Good Evening</h1>
        <p>Pick Something to play!!</p>

        <section className="playlist-grid">
          {playlists.map((playlist) => (
            <article
              className={`playlist-card ${
                selectedPlaylist.id === playlist.id ? "selected" : ""
              }`}
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedPlaylist(playlist);
                }
              }}
            >
              <div className="playlist-cover">{playlist.cover}</div>
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
            </article>
          ))}
        </section>

        <section className="song-section" id="library">
          <h2>{selectedPlaylist.title}</h2>
          <p>{selectedPlaylist.description}</p>

          <div className="song-list">
            {selectedPlaylist.songs.map((song, index) => (
              <div
                className={`song-row ${
                  currentSong?.id === song.id ? "active-song" : ""
                }`}
                key={song.id}
                onClick={() => handleSongClick(song)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSongClick(song);
                  }
                }}
              >
                <span className="song-number">
                  {currentSong?.id === song.id && isPlaying
                    ? "♫"
                    : index + 1}
                </span>

                <div className="song-details">
                  <strong>{song.title}</strong>
                  <p>{song.artist}</p>
                </div>

                <span className="song-duration">{song.duration}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Persistent mini-player */}
      <footer className="player">
        {currentSong ? (
          <>
            <div
              className="mini-cover"
              onClick={() => setIsPlayerOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Open now playing"
            >
              {selectedPlaylist.cover}
            </div>

            <div
              className="mini-song-info"
              onClick={() => setIsPlayerOpen(true)}
              role="button"
              tabIndex={0}
            >
              <strong>{currentSong.title}</strong>
              <p>{currentSong.artist}</p>
            </div>

            <button
              className="mini-play-button"
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            <button
              className="expand-player"
              onClick={() => setIsPlayerOpen(true)}
              aria-label="Expand player"
              title="Open now playing"
            >
              ⤢
            </button>

            <button
              className="create-playlist-btn"
              onClick={() => setShowCreatePlaylist(true)}
            >
              <span>＋</span>
              Create Playlist
            </button>

          </>
        ) : (
          <p>No Song Playing</p>
        )}

        
      <button
        className="create-confirm-btn"
        onClick={handleCreatePlaylist}
      >
        Create
      </button>
      
      </footer>

      {/* Now Playing modal */}
      {isPlayerOpen && currentSong && (
        <div
          className="now-playing-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPlayerOpen(false);
            }
          }}
        >
          <section
            className="now-playing-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Now playing"
          >
            <header className="modal-header">
              <button
                className="close-btn"
                onClick={() => setIsPlayerOpen(false)}
                aria-label="Close player"
              >
                ✕
              </button>

              <span>NOW PLAYING</span>
              <span className="header-space" />
            </header>

            <div className="modal-content">
              <div className="modal-cover">
                {selectedPlaylist.cover}
              </div>

              <div className="modal-song-info">
                <div>
                  <h2>{currentSong.title}</h2>
                  <p>{currentSong.artist}</p>
                  <small>{selectedPlaylist.title}</small>
                </div>

                <button
                  className="like-btn"
                  aria-label="Like song"
                  title="Like song"
                >
                  ♡
                </button>
              </div>

              {/* Interactive progress bar */}
              <div className="modal-progress">
                <input
                  type="range"
                  className="progress-track"
                  min={0}
                  max={duration || getSongDuration(currentSong) || 1}
                  step={0.1}
                  value={Math.min(
                    currentTime,
                    duration || getSongDuration(currentSong)
                  )}
                  style={{
                    background: `linear-gradient(to right, #1ed760 ${progressPercent}%, #535353 ${progressPercent}%)`,
                  }}
                  onChange={handleSeek}
                  aria-label="Seek through song"
                />

                <div className="time-labels">
                  <span>{formatTime(currentTime)}</span>
                  <span>
                    {formatTime(duration || getSongDuration(currentSong))}
                  </span>
                </div>
              </div>

              <div className="modal-controls">
                <button
                  onClick={handlePrevious}
                  aria-label="Previous song"
                >
                  ⏮
                </button>

                <button
                  className="modal-play-btn"
                  onClick={() => setIsPlaying((playing) => !playing)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "Ⅱ" : "▶"}
                </button>

                <button onClick={handleNext} aria-label="Next song">
                  ⏭
                </button>
              </div>

              <div className="modal-footer">
                <span>♫</span>
                Playing from {selectedPlaylist.title}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Audio element stays mounted so playback continues when modal closes */}
      <audio
          ref={audioRef}
          src={currentSong?.audioUrl}
          preload="auto"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={handleNext}
          onError={(e) => {
            console.error("Audio error:", e.currentTarget.error);
            setIsPlaying(false);
          }}
        />

        {showCreatePlaylist && (
  <div
    className="playlist-modal-overlay"
    onClick={() => setShowCreatePlaylist(false)}
  >
    <div
      className="playlist-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-modal"
        onClick={() => setShowCreatePlaylist(false)}
      >
        ×
      </button>

      <h2>Create Playlist</h2>
      <p>Give your new playlist a name.</p>

      <input
        type="text"
        placeholder="My Playlist"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreatePlaylist();
          }
        }}
        autoFocus
      />

    </div>
  </div>
)}
    </div>
  );
}

export default App;
