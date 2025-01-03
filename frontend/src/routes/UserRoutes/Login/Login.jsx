import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom'








const UserLogin = () => {






  const [formData, setFormData] = useState({
    phoneNo: '',
    password: '',
  });

  let navigate = useNavigate()






  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };






  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_Bakend_Base_Url}/api/userRoutes/login`, formData, { withCredentials: true });

      console.log(response.data)

      if (response) {


        if (response.data.status == "error") {
          alert(response.data.msg)
        } else if (response.data.status == "failed") {
          alert(response.data.msg)
          navigate("/userRegistration")
        } else if (response.data.status == "success") {
          alert(response.data.msg)
          navigate("/userHome")
        } else if(response.data.status=="emptyField"){
          alert("Please Enter the all Fields correctly")
        } 
        else {
          alert("please try again")
        }


      } else {
        alert("The response is not working so please try again")
      }


    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };















  return (

    <div className="user_form_Div">

      <div className="user-form-container">
        <h2 className="form-title">User Login</h2>
        <form className="user-form" onSubmit={handleSubmit}>

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
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>

    </div>


  );
};
















export default UserLogin;
