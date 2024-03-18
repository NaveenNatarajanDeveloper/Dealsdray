import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Component/Routing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <>
    <Routing />
    <ToastContainer />
  </>
);
