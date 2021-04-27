import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Input, Label, FormText, Table } from 'reactstrap';
import DataTable, { createTheme } from 'react-data-table-component';

import './styles.css'

const App = () => {
    // Set tables const
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [duplicate, setDuplicate] = useState([]);

    // Handle .csv when upload
    const handleFileUpload = async e => {
        const file = e.target.files[0]      // Get file
        const reader = new FileReader()
        reader.onload = (evt) => {
            const bstr = evt.target.result  // Parse data
            handleInformation(bstr)         // Handle csv information
        };
        reader.readAsBinaryString(file);
    }

    // Handle .csv parsed information
    const handleInformation = dataString => {
        const lines = dataString.split(/\r\n|\n/)   // Separate csv array by lines
        const headers = lines[0].split(',')         // Get headers of csv file
        const list = []                             // Instance of list to alocate csv information
        const duplicateList = []

        const phoneList = []

        // Loop trough each line to split its values
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (headers && row.length === headers.length) {  // Avoid in case any line has more or less elements than headers
                const obj = {};                             // Instance object to alocate each line as json
                // Loop trough each value in line
                for (let j = 0; j < headers.length; j++) {
                    if(handleEmailValidation(row[1])){      // Verify second row is a valid email, otherwise avoid
                        let element = row[j];
                        if (headers[j]) {
                            obj[headers[j]] = element;      // Save each value into object
                        }
                    }
                }
     
                // Verify object to avoid blank and duplicates
                if (Object.values(obj).filter(x => x).length > 0) {
                    if(!phoneList.includes(obj.Telefono)){  // If phone list dosn't includes this phone then
                        phoneList.push(obj.Telefono)        // add to phone list and keep verifying
                        list.push(obj)                      // save object into table list
                    } else {                                // else, save into duplicate list
                        duplicateList.push(obj)
                    }
                }
            }
        }
     
        // Set headers
        const columns = headers.map(c => ({
          name: c,
          selector: c,
        }));
     
        
        setColumns(columns)         // Set columns
        setData(list)               // Set rows

        setDuplicate(duplicateList) // Set duplicated
    }
 
    // Handle wrong email address        - email name      @ email domain      . email dot
    const handleEmailValidation = email => /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)

    createTheme('solarized', {
        text: {
          primary: '#C70039',
          secondary: '#581845',
        },
      });

    return (
        <div className="App">
            <Container classname="themed-container" fluid={true}>
                <Row>
                    <Col sm="12" className="headerBar">
                        <h2>CSV FILE READER AND TABLE DEPLOY</h2>
                        <Form>
                            <FormGroup>
                                <Input type="file" accept=".csv" onChange={handleFileUpload} className="input-style"/>
                                <FormText color="light">Upload a .csv file to deploy table (Must contain name, email and phone)</FormText>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Row className="body table-style">
                    <Col sm={6}>
                        <h4>Table information</h4>
                        <DataTable 
                            pagination
                            highlightOnHover
                            columns={columns}
                            data={data}
                        />
                    </Col>
                    <Col sm={6}>
                        <h4>Table duplicates</h4>
                        <DataTable 
                            theme="solarized"
                            pagination
                            highlightOnHover
                            columns={columns}
                            data={duplicate}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default App
