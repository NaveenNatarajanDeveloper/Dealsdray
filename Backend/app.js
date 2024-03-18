const express = require('express');
const app = express();
const port = 9121;
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConnect, getData, postData, updateEmployee, deleteEmployee } = require('./controller/dbcontroller');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const { v4: uuidv4 } = require('uuid'); 

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to Database
dbConnect().then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.error('Failed to connect to database', err);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if email and password match the default credentials
    if (username === 'naveen' && password === 'Admin@1') {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
  
//for get employeee
app.get('/employees', async (req, res) => {
    try {
        const id = req.query.id;
        console.log('ID:', id); 
        let filter = {};

        if (id) {
            filter = { _id: new ObjectId(id) }; 
        }

        const output = await getData('employees', filter);

        if (!output || output.length === 0) {
            return res.status(404).send('No employees found');
        }

        res.send(output);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).send('Internal Server Error: ' + error.message); 
    }
});

//create employee
app.post('/employees', async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses, imageUrl } = req.body;

        // Check if email already exists
        const existingEmployee = await getData('employees', { email });

        if (existingEmployee && existingEmployee.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        let id;
        let isUnique = false;

       
        while (!isUnique) {
            id = 'EMP' + uuidv4().substr(0, 4).toUpperCase(); 

          
            const existingEmployeeWithId = await getData('employees', { id });

            if (!existingEmployeeWithId || existingEmployeeWithId.length === 0) {
                
                isUnique = true;
            }
        }

        
        const newEmployee = {
            id, 
            name,
            email,
            mobile,
            designation,
            gender,
            courses,
            imageUrl,
            createDate: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),// Use 'Asia/Kolkata' for GMT+5:30// Use server's timezone
        };

        
        const response = await postData('employees', newEmployee);

        res.json([response]); 
    } catch (error) {
        console.error('Error adding new employee:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


// Route to update an employee
app.put('/employees/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = req.body;

        if (Object.keys(update).length === 0) {
            return res.status(400).send('Update data is empty');
        }

        const response = await updateEmployee('employees', filter, update);
        res.send(response);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Route to delete an employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }; 
        const response = await deleteEmployee('employees', filter);
        
        if (response.deletedCount === 0) {
            return res.status(404).send('Employee not found'); 
        }
        
        res.send(response);
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Internal Server Error: ' + error.message); 
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
