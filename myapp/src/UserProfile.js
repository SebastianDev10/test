import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
    const [editProfile, setEditProfile] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        address: '',
        phoneNumber: ''
    });
    const [displayProfile, setDisplayProfile] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        address: '',
        phoneNumber: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/UserProfile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            const data = response.data;
            setEditProfile({
                firstName: data.first_name,
                lastName: data.last_name,
                bio: data.bio,
                address: data.address,
                phoneNumber: data.phone_number
            });
            setDisplayProfile({
                firstName: data.first_name,
                lastName: data.last_name,
                bio: data.bio,
                address: data.address,
                phoneNumber: data.phone_number
            });
            
            setLoading(false);
            if (data.avatar) {
                setAvatarPreview(`http://localhost:8000/media/avatars/${data.avatar}`);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            setLoading(false);
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('first_name', editProfile.firstName);
        formData.append('last_name', editProfile.lastName);
        formData.append('bio', editProfile.bio);
        formData.append('address', editProfile.address);
        formData.append('phone_number', editProfile.phoneNumber);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await axios.post('http://localhost:8000/UserProfile/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile updated:', response.data);
            setDisplayProfile(prevState => ({
                ...editProfile,
                avatar: response.data.avatar || prevState.avatar,
            }));
            if (response.data.avatar) {
                // Reset the avatar file input after successful upload
                setAvatarPreview(`http://localhost:8000/media/avatars/${response.data.avatar}`);
                // Update the file input element by resetting its value

                
            } else {
                // Keep the current preview if the new avatar is not in the response
                setAvatarPreview(null);
            }

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Profil Użytkownika</h2>
            <div>
                <strong>Imię: </strong> {displayProfile.firstName}<br />
                <strong>Nazwisko: </strong> {displayProfile.lastName}<br />
                <strong>O mnie: </strong> {displayProfile.bio}<br />
                <strong>Adres: </strong> {displayProfile.address}<br />
                <strong>Numer telefonu: </strong> {displayProfile.phoneNumber}<br />
                {/* Display avatar if available */}
                {avatarPreview && (
                    <div>
                        <strong>Avatar: </strong>
                        <img src={avatarPreview} alt="User Avatar" />
                    </div>
                )}

            </div>
            <form onSubmit={handleSubmit}>
                {/* Input fields for editing profile */}
                <input type="text" name="firstName" value={editProfile.firstName} onChange={handleInputChange} />
                <input type="text" name="lastName" value={editProfile.lastName} onChange={handleInputChange} />
                <textarea name="bio" value={editProfile.bio} onChange={handleInputChange} />
                <input type="text" name="address" value={editProfile.address} onChange={handleInputChange} />
                <input type="text" name="phoneNumber" value={editProfile.phoneNumber} onChange={handleInputChange} />
                <input type="file" onChange={handleAvatarChange} />
                <button type="submit">Zapisz zmiany</button>
            </form>
        </div>
    );
}

export default UserProfile;
