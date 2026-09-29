import React, {useState} from 'react';
import axios from 'axios'; // Import Axios
import './css/Login.css';

const Registration = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // For error messages
  const [previewImage, setPreviewImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      // Prepare the request body using FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('email', email);
      formData.append('password', password);

      // Add the profile image if the user uploaded it
      const fileInput = document.getElementById('profileImage'); // Access the
                                                                 // file input
      if (fileInput.files[0]) {
        formData.append('photo', fileInput.files[0]); // Append the uploaded
                                                      // file
      }
      try {
        // Send API request using Axios
        const apiUrl = import.meta.env.VITE_APP_BASE_URL;
        const response = await axios.post(`${apiUrl}/api/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Handle success
        setMessage(response.data.message || 'Registration successful!');
      }
      catch (err) {
        console.error('Error making the API call:', err);
        if (err.response) {
          setError(err.response.data.message ||
              'An error occurred during registration.');
        }
        else {
          setError('Unable to connect to the server. Please try again later.');
        }
      }

      // Clear form fields
      setName('');
      setAge('');
      setGender('');
      setEmail('');
      setPassword('');
      fileInput.value = ''; // Clear file input
    }
    catch (err) {
      // Handle errors
      if (err.response && err.response.data) {
        setError(err.response.data.message ||
            'An error occurred during registration.');
      }
      else {
        // General or network error
        setError('Unable to connect to the server. Please try again later.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    else {
      setPreviewImage('');
    }
  };

  return (
      <main className = "page-content auth-page" >
        <div className = "login-card" >
          <h1 className = "login-title" >Create an Account</h1 >
          {message && <p className = "success-message" >{message}</p >}
          {error && <p className = "error-message" >{error}</p >}

          <form onSubmit = {handleSubmit} className = "login-form" >
            <label htmlFor = "name" className = "form-label" >Name</label >
            <input
                type = "text"
                id = "name"
                name = "name"
                className = "form-input"
                value = {name}
                onChange = {(e) => setName(e.target.value)}
                required
                placeholder = "Enter your name"
            />

            <label htmlFor = "age" className = "form-label" >Age</label >
            <input
                type = "number"
                id = "age"
                name = "age"
                className = "form-input"
                value = {age}
                onChange = {(e) => setAge(e.target.value)}
                required
                placeholder = "Enter your age"
            />

            <label htmlFor = "gender" className = "form-label" >Gender</label >
            <select
                id = "gender"
                name = "gender"
                className = "form-input"
                value = {gender}
                onChange = {(e) => setGender(e.target.value)}
                required
            >
              <option value = "" >Select your gender</option >
              <option value = "male" >Male</option >
              <option value = "female" >Female</option >
              <option value = "other" >Other</option >
            </select >

            <label htmlFor = "email" className = "form-label" >Email</label >
            <input
                type = "email"
                id = "email"
                name = "email"
                className = "form-input"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                required
                placeholder = "Enter your email"
            />

            <label htmlFor = "password"
                   className = "form-label" >Password</label >
            <input
                type = "password"
                id = "password"
                name = "password"
                className = "form-input"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                required
                placeholder = "Create a password"
            />

            <label htmlFor = "profileImage" className = "form-label" >Profile
                                                                      Image</label >
            <input
                type = "file"
                id = "profileImage"
                name = "profileImage"
                className = "form-input"
                onChange = {handleImageChange}
            />
            {previewImage && (
                <div className = "image-preview-container" >
                  <p className = "form-label" >Image Preview:</p >
                  <img
                      src = {previewImage}
                      alt = "Preview"
                      className = "image-preview"
                  />
                </div >
            )}

            <button type = "submit" className = "submit-button" >Register
            </button >
          </form >
          <p className = "login-footer" >
            Already have an account? <a href = "/login" target = "_blank" >Login</a >
          </p >
        </div >
      </main >
  );
};

export default Registration;