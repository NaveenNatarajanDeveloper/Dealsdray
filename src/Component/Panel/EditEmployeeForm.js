import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState({});
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:9121/employees?id=${id}`)
      .then(response => {
        const employeeData = response.data[0];
        setName(employeeData.name);
        setEmail(employeeData.email);
        setMobileNo(employeeData.mobile);
        setDesignation(employeeData.designation);
        setGender(employeeData.gender);
        setCourses(employeeData.courses);

        setImage(employeeData.image);
        setImageUrl(employeeData.imageUrl);
      })
      .catch(error => {
        console.error('Error fetching employee:', error);
      });
  }, [id]);

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
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
        setErrors({ image: 'Invalid file type. Only JPG and PNG files are allowed.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const validationErrors = {};
      if (!name || !email || !mobileNo || !designation || !gender || !Object.values(courses).some(course => course)) {
        validationErrors.message = 'All fields are required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await axios.put(`http://localhost:9121/employees/${id}`, {
        name,
        email,
        mobile: mobileNo,
        designation,
        gender,
        courses,
        imageUrl
      });
      console.log('Employee updated successfully:', response.data);
      navigate('/EmployeeList');

    } catch (error) {
      console.error('Error updating employee:', error);

    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

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
        <h2>Edit Employee</h2>
        {errors.message && <div className="alert alert-danger">{errors.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name <span style={{ color: 'red' }}>*</span></label>
            <input type="text" className="form-control" id="name" value={name} name="name" onChange={handleInputChange} />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
            <input type="email" className="form-control" id="email" value={email} name="email" onChange={handleInputChange} />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNo" className="form-label">Mobile No <span style={{ color: 'red' }}>*</span></label>
            <input type="text" className="form-control" id="mobileNo" value={mobileNo} name="mobileNo" onChange={handleInputChange} />
            {errors.mobileNo && <div className="text-danger">{errors.mobileNo}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation <span style={{ color: 'red' }}>*</span></label>
            <select className="form-select" id="designation" value={designation} name="designation" onChange={handleInputChange}>
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && <div className="text-danger">{errors.designation}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Gender <span style={{ color: 'red' }}>*</span></label>
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
            <label className="form-label">Course <span style={{ color: 'red' }}>*</span></label>
            <div>
              {Object.entries(courses).map(([course, isChecked]) => (
                <div key={course} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={course}
                    value={course}
                    checked={isChecked}
                    onChange={(e) => setCourses({ ...courses, [course]: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor={course}>{course}</label>
                </div>
              ))}
            </div>
            {errors.courses && <div className="text-danger">{errors.courses}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image Upload <span style={{ color: 'red' }}>*</span></label>
            <input type="file" accept=".jpg, .png" className="form-control" id="image" onChange={handleImageUpload} />
            {errors.image && <div className="text-danger">{errors.image}</div>}
          </div>
          {imageUrl && (
            <div className="mb-3">
              <div className="image-container" style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '10px' }}>
                <img src={imageUrl} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
            </div>
          )}


          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditEmployee;
