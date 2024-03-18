import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Main from './main';
import Login from './Login/Login';
import Dashboard from './Panel/Dashboard';
import EmployeeList from './Panel/EmployeeList';
import EditEmployee from './Panel/EditEmployeeForm';
import CreateEmployee from './Panel/CreateEmployeeForm';

const Routing = () => {
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main/>}>
                    <Route index element={<Login/>}/>
                    <Route path="Dashboard" element={<Dashboard/>}/>
                    <Route path="EmployeeList" element={<EmployeeList/>}/>
                    <Route path="/edit/:id" element={<EditEmployee/>}/>
                    <Route path="CreateEmployee" element={<CreateEmployee/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Routing