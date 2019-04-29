import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const SongAction = () => {
    return (
        <DropdownButton className="ma2"
            title="Action"
            id="dropdown-secondary-button"
            key="songAction"
            align="right">
            <Router>
                <Dropdown.Item><Link to="/songdtl">Add New Song</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/songschdl">Schedule Song</Link></Dropdown.Item>
            </Router>

        </DropdownButton>
    )
}

export default SongAction;