import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';
import { useNavigate } from 'react-router-dom'








const UserRegistration = () => {






  const [formData, setFormData] = useState({
    image: '',
    username: '',
    email: '',
    phoneNo: '',
    password: '',
  });

  let navigate = useNavigate()







  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "image") {
      setFormData({ ...formData, [name]: e.target.files[0] })
    } else {
      setFormData({ ...formData, [name]: value });

    }
  };






  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      console.log("The Register button is clicked")

      let formDataToSend = new FormData()
      for (let key in formData) {
        formDataToSend.append(key, formData[key])
      }

      const response = await axios.post(`${import.meta.env.VITE_Bakend_Base_Url}/api/userRoutes/registration`, formDataToSend, { withCredentials: true });



      // conditioning according to upcomming response from the backend
      if (response.data) {

        if (response.data.status == "error") {
          alert("something went wrong in server. please restart and try again")
        } else if (response.data.status == "present") {
          alert("This user is already present. So please login.")
          navigate("/userLogin")
        } else if (response.data.status == "failed") {
          alert(response.data.msg)
        } else if (response.data.status == "success") {
          alert(response.data.msg)
          navigate("/userHome")
        }

      } else {
        alert("There is something wrong in the server. Please restart and try again. Thanks.")
      }





    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };















  return (
    <div className="user_form_Div">

      <div className="user-form-container">
        <h2 className="form-title">User Registration</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Image (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number</label>
            <input
              type="number"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>

    </div>
  );
};
















export default UserRegistration;
