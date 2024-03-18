import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './EmployeeList.css';
import { Link } from 'react-router-dom';



const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

  useEffect(() => {

    axios.get('http://localhost:9121/employees')
      .then(response => {

        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);


  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchKeyword.toLowerCase())
  ).slice(indexOfFirstEmployee, indexOfLastEmployee);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDelete = async (id) => {
    try {

      await axios.delete(`http://localhost:9121/employees/${id}`);

      setEmployees(employees.filter(employee => employee._id !== id));
      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };


  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedEmployees = [...employees];
    sortedEmployees.sort((a, b) => {
      if (key === 'name' || key === 'email' || key === 'designation') {
        // Sort by name, email, or designation
        const valueA = a[key].toUpperCase();
        const valueB = b[key].toUpperCase();
        if (direction === 'ascending') {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
        } else {
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
        }
        return 0;
      } else {

        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      }
    });
    setEmployees(sortedEmployees);
  };



  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const getArrowIconFor = (name) => {
    if (!sortConfig) {
      return;
    }
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
  };
  return (
    <>
      <Header />
      <div className="container-fluid mt-3">
        <div className="row mb-3">
          <div className="col">
            <h2>Employee List</h2>
          </div>
          <div className="col text-end">
            <p>Total Count: {employees.length}</p>
            <Link to="/CreateEmployee" className="btn btn-primary">Create Employee</Link>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Enter Search Keyword" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
              <button className="btn btn-outline-secondary" type="button">Search</button>
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>

              <th onClick={() => requestSort('id')} className={getClassNamesFor('id')}>
                Unique Id <span className={`sort-indicator ${getArrowIconFor('id') ? 'visible' : ''}`}>{getArrowIconFor('id')}</span>
              </th>

              <th>Image</th>
              <th onClick={() => requestSort('name')} className={getClassNamesFor('name')}>
                Name <span className={`sort-indicator ${getArrowIconFor('name') ? 'visible' : ''}`}>{getArrowIconFor('name')}</span>
              </th>
              <th onClick={() => requestSort('email')} className={getClassNamesFor('email')}>
                Email <span className={`sort-indicator ${getArrowIconFor('email') ? 'visible' : ''}`}>{getArrowIconFor('email')}</span>
              </th>

              <th>Mobile No</th>
              <th onClick={() => requestSort('designation')} className={getClassNamesFor('designation')}>
                Designation <span className={`sort-indicator ${getArrowIconFor('designation') ? 'visible' : ''}`}>{getArrowIconFor('designation')}</span>
              </th>
              <th onClick={() => requestSort('gender')} className={getClassNamesFor('gender')}>
                Gender <span className={`sort-indicator ${getArrowIconFor('gender') ? 'visible' : ''}`}>{getArrowIconFor('gender')}</span>
              </th>
              <th>Course</th>
              <th onClick={() => requestSort('createDate')} className={getClassNamesFor('createDate')}>
                Created Date <span className={`sort-indicator ${getArrowIconFor('createDate') ? 'visible' : ''}`}>{getArrowIconFor('createDate')}</span>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td><img src={employee.imageUrl} alt="Employee" className="rounded-circle" width="50" height="50" /></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>
                  {employee.courses && Object.entries(employee.courses).map(([course, enrolled]) => (
                    enrolled && <span key={course}>{course}, </span>
                  ))}
                </td>
                <td>{employee.createDate}</td>
                <td>
                  <Link to={{ pathname: `/edit/${employee._id}`, state: { employee } }} className="btn btn-sm btn-primary me-2">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="col d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
              <li key={i + 1} className="page-item">
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
