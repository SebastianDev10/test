import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



function HomePage() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const token = localStorage.getItem('access_token');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [fileName, setFileName] = useState('Nie wybrano pliku');

    const handleLogout = () => {
        localStorage.removeItem('access_token');  // Usuń token z localStorage
        // Przekieruj na stronę logowania lub inną stronę
        window.location.href = '/login';  // Zmień '/login' na URL Twojej strony logowania
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : 'Nie wybrano pliku');
    };

    const handleLike = async (videoID) => {
        try {
            await axios.post(`http://localhost:8000/api/like/${videoID}/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchVideos();
        } catch (error) {
            console.error('Error liking image:', error);
        }
    };

    const handleDislike = async (videoID) => {
        try {
            await axios.post(`http://localhost:8000/api/dislike/${videoID}/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchVideos();
        } catch (error) {
            console.error('Error disliking image:', error);
        }
    };

    const uploadVideo = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        // Pobranie danych z formularza i dodanie ich do formData
        const videoFile = event.target.elements.video.files[0];
        formData.append('video', videoFile);
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);

        try {
            const response = await axios.post('http://localhost:8000/home/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Obraz przesłany:', response.data);
            fetchVideos(); // Odśwież obrazy po dodaniu nowego
            setVideoTitle('');
            setVideoDescription('');
            // Wyczyść wybrany plik
            setFileName('Nie wybrano pliku');
            // Resetuj również pole wyboru pliku formularza
            event.target.elements.image.value = null;
        } catch (error) {
            console.error('Błąd podczas przesyłania obrazu:', error.response?.data || error);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/home/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setVideos(response.data);
            setFilteredVideos(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania obrazów:', error);
        }
    };

    useEffect(() => {
        //fetchImages().then(() => setFilteredVideos(images));
        fetchVideos();
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        // Jeśli searchTerm nie jest pusty, filtruj obrazy, w przeciwnym razie ustaw wszystkie
        const filtered = searchTerm
            ? videos.filter((vid) =>
                vid.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : videos;
        
        setFilteredVideos(filtered);
        
    };
    
    



    return (
        <div className="home-page">
            <aside className="sidebar">
                <div className="logo-container">
                    <vid src="/logo/Fashionova-logos_white.png" alt="Fashionova" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => window.location.href = '/UserProfile'} className="profile-button">Mój profil</button>
                    <button onClick={handleLogout} className="logout-button"><FontAwesomeIcon icon={faRightFromBracket} /> Wyloguj</button>
                </nav>
            </aside>
            <main className="main-content">
                <section className="upload-section">
                <div className="search-bar-container">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search videos ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit"><FontAwesomeIcon icon={faSearch} /> Search</button>
                        </form>
                    </div>
                <form onSubmit={uploadVideo} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="video-upload" className="file-upload">
                            Wybierz plik
                            <input type="file" id="video-upload" name="video" onChange={handleFileChange} required hidden />
                        </label>
                        <span id="file-chosen">{fileName}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" name="title" placeholder="Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <textarea name="description" placeholder="Description" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} required />
                    </div>
                    <button type="submit" className="upload-button"><FontAwesomeIcon icon={faUpload} /> Upload Video</button>
                    
                </form>
                </section>
                <section className="gallery-section">
                <div className="video-gallery">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="video-item">
                            <video width="320" height="240" controls>
                                    <source src={video.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                            </video>

                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                            <div className="video-actions">
                            <button onClick={() => handleLike(video.id)} ><FontAwesomeIcon icon={faThumbsUp} /></button>
                            <span>Likes: {video.likes}</span>
                            <button onClick={() => handleDislike(video.id)} ><FontAwesomeIcon icon={faThumbsDown} /></button>
                            <span>Dislikes: {video.dislikes}</span>
                            </div>
                        </div>
                    ))}
                </div>
                </section>
            </main>
        </div>
    );
}

export default HomePage;
