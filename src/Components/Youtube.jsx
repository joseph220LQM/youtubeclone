import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { Search, Menu, Video, Users, Upload, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import './Styles/Youtube.css';

export default function YoutubePage({user}) {
  const [activeTab, setActiveTab] = useState('my-videos');
  const [videoPreview, setVideoPreview] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);
  const fileInputRef = useRef(null);


  if (!user || user.role !== 'user') {
    return <Navigate to="/" />;
  }

  const avatar = `https://api.multiavatar.com/${user._id}.svg`;

    useEffect(() => {
    // Fetch the uploaded videos from the server
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://youtubecloneback.vercel.app/videos/getMyVideos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id }),
      });
        if (response.ok) {
          const data = await response.json();
          setUploadedVideos(data.videos || []);
        } else {
          console.error('Failed to fetch videos');
        }
      } catch (error) {
        alert("Error al obtener los videos");
      }
    };
    fetchVideos();
  }, [user._id]);

  useEffect(() => {
    const fetchOtherVideos = async () => {
      try {
        const response = await fetch('https://youtubecloneback.vercel.app/videos/getOtherVideos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setOtherVideos(data.videos || []);
        } else {
          console.error('Failed to fetch other users videos');
        }
      } catch (error) {
        alert("Error al obtener los videos de otros usuarios");
      }
    };
  
    if (activeTab === 'other-videos') {
      fetchOtherVideos();
    }
  }, [activeTab, user._id]);
  


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoPreview(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!videoPreview || !videoTitle) {
      alert("Debe proporcionar un título y un archivo de video.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('title', videoTitle);
    formData.append('file', videoPreview);
    try {
      const response = await fetch('https://youtubecloneback.vercel.app/user/videos', {
          method: 'POST',
          body: formData,
      });
      
      if (response.ok) {
        const newVideo = await response.json();

      // Agregar el nuevo video a los videos ya subidos en el estado
      setUploadedVideos((prev) => [...prev, newVideo.video]);
        alert("Video subido con éxito.");
      } else {
        alert("Error al subir el video.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
    // Reiniciar el formulario
    setIsLoading(false);
    setVideoTitle('');
    setVideoPreview(null);
    setPreviewURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="youtube-clone">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Cargando, por favor espere...</p>
        </div>
      )}
      <header className="header">
        <div className="header-left">
          <button className="icon-button">
            <Menu />
          </button>
          <div className="logo">
            <Video color="red" />
            <span>YouTube</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
            <button className="search-button">
              <Search />
            </button>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-button">
            <img src={avatar} height="32" width="32" alt="Usuario" className="user-avatar" />
          </button>
        </div>
      </header>
      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'my-videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-videos')}
        >
          <Video />
          Mis videos
        </button>
        <button
          className={`tab ${activeTab === 'other-videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('other-videos')}
        >
          <Users />
          Videos de otros usuarios
        </button>
      </nav>
      <main className="content">
        {activeTab === 'my-videos' ? (
          <div className="my-videos">
            <h2>Mis videos</h2>
            <form onSubmit={handleSubmit} className="upload-form" enctype="multipart/form-data">
              <div className="form-group">
                <label htmlFor="video-title">Título del video:</label>
                <input type="text" id="video-title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="video-file">Seleccionar video:</label>
                <input type="file" id="video-file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} required
                />
              </div>
              {previewURL && (
                <div className="video-preview">
                  <h3>Previsualización:</h3>
                  <video src={previewURL} controls width="100%" height="auto" />
                </div>
              )}
              <button type="submit" className="upload-button">
                <Upload />
                Subir Video
              </button>
            </form>
            <div className="video-grid">
              {uploadedVideos.map((video) => (
                <div className="video-card" key={video._id}>
                  <video controls width="100%" >
                    <source src={video.location} type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                  <div className='video-info'>
                    <h3 className='video-title'>{video.title}</h3>
                    <p className='video-meta'>Subido por: {user.nombre} • hace {video.timestamp}</p>
                    <div className="video-actions">
                      <button className="action-button"><ThumbsUp size={16} /> Me gusta</button>
                      <button className="action-button"><MessageCircle size={16} /> Comentar</button>
                      <button className="action-button"><Share2 size={16} /> Compartir</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="other-videos">
            <h2>Videos de otros usuarios</h2>
            <div className="video-grid">
              {otherVideos.map(video => (
                <div className="video-card" key={video._id}>
                <video controls width="100%">
                  <source src={video.location} type="video/mp4" />
                  Tu navegador no soporta la reproducción de video.
                </video>
                <div className="video-info">
                  <h3 className='video-title'>{video.title}</h3>
                  <p className='video-meta'>Subido por: {video.uploaderInfo?.nombre} • hace {video.timestamp}</p>
                  <div className="video-actions">
                    <button className="action-button"><ThumbsUp size={16} /> Me gusta</button>
                    <button className="action-button"><MessageCircle size={16} /> Comentar</button>
                    <button className="action-button"><Share2 size={16} /> Compartir</button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}