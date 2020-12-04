import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';

export class NavigationBar extends Component {
    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">                    
                    Notch up
                    </Navbar.Brand>
                </Navbar>
            </>
        )
    }
}