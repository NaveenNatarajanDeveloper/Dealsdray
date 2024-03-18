import React, { useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './CreateEmployee.css'; 
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState({
    MCA: false,
    BCA: false,
    BSC: false
  });
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    try {
       
        if (!name || !email || !mobileNo || !designation || !gender || !courses.MCA && !courses.BCA && !courses.BSC || !image) {
            setErrors({ ...errors, message: 'All fields are required' });
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors({ ...errors, email: 'Invalid email format' });
            return;
        }

        
        const response = await axios.get(`http://localhost:9121/employees`);
        const existingEmployee = response.data.find(employee => employee.email === email);
        if (existingEmployee) {
            setErrors({ ...errors, email: 'Email already exists' });
            return;
        }

        
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobileNo)) {
            setErrors({ ...errors, mobileNo: 'Invalid mobile number format' });
            return;
        }
        
        const id = uuidv4();

       
        const createDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });

        
        const newEmployee = {
            id,
            name,
            email,
            mobile: mobileNo,
            designation,
            gender,
            courses,
            image,
            createDate, 
            imageUrl 
        };

        
        const postResponse = await axios.post('http://localhost:9121/employees', newEmployee);
        console.log('Employee added successfully:', postResponse.data);
       
        navigate('/EmployeeList');
    } catch (error) {
        console.error('Error adding new employee:', error);
       
    }
};



  
 
  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        const formData = new FormData();
        formData.append('image', selectedFile);
        try {
          const response = await axios.post('https://api.imgbb.com/1/upload?key=a7b9f6c044cbdd48eb33f3124c1cae41', formData);
          setImageUrl(response.data.data.url); 
          setImage(selectedFile); 
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
        setErrors({ image: 'Invalid file type. Only JPG and PNG files are allowed.' });
      }
    }
  };

 
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let errorMessage = '';

    if (type === 'checkbox') {
      setCourses({ ...courses, [name]: checked });
      return;
    }

    switch (name) {
      case 'name':
        errorMessage = value.trim() ? '' : 'Name is required';
        break;
      case 'email':
        errorMessage = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
        break;
      case 'mobileNo':
        errorMessage = /^\d{10}$/.test(value) ? '' : 'Invalid mobile number format';
        break;
      case 'designation':
        errorMessage = value ? '' : 'Designation is required';
        break;
      case 'gender':
        errorMessage = value ? '' : 'Gender is required';
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
    
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'mobileNo':
        setMobileNo(value);
        break;
      case 'designation':
        setDesignation(value);
        break;
      case 'gender':
        setGender(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid mt-3">
        <h2>Create Employee</h2>
        {errors.message && <div className="alert alert-danger">{errors.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name <span className="required">*</span></label>
            <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleInputChange} />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email <span className="required">*</span></label>
            <input type="email" className="form-control" id="email" name="email" value={email} onChange={handleInputChange} />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNo" className="form-label">Mobile No <span className="required">*</span></label>
            <input type="text" className="form-control" id="mobileNo" name="mobileNo" value={mobileNo} onChange={handleInputChange} />
            {errors.mobileNo && <div className="text-danger">{errors.mobileNo}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation <span className="required">*</span></label>
            <select className="form-select" id="designation" name="designation" value={designation} onChange={handleInputChange}>
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && <div className="text-danger">{errors.designation}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Gender <span className="required">*</span></label>
            <div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="male" value="Male" checked={gender === 'Male'} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="male">Male</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="female" value="Female" checked={gender === 'Female'} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="female">Female</label>
              </div>
            </div>
            {errors.gender && <div className="text-danger">{errors.gender}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Courses <span className="required">*</span></label>
            <div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="mca" name="MCA" checked={courses.MCA} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="mca">MCA</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="bca" name="BCA" checked={courses.BCA} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="bca">BCA</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="bsc" name="BSC" checked={courses.BSC} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="bsc">BSC</label>
              </div>
            </div>
            {errors.courses && <div className="text-danger">{errors.courses}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image <span className="required">*</span></label>
            <input type="file" className="form-control" id="image" name="image" accept="image/png, image/jpeg" onChange={handleImageUpload} />
            {errors.image && <div className="text-danger">{errors.image}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </>
  );
};

export default CreateEmployee;
