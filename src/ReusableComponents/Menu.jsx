import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

function CustomMenu({categories, text, onCategorySelect }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function handleClose() {
        setAnchorEl(null);
    }

    function handleCategoryClick(item) {
    //     Add category to url param
        if (onCategorySelect) {
            onCategorySelect(item);
        }
        console.log(item);
        handleClose();
    }

    return (
        <>
            <button style={{
                textAlign: 'center',
                padding: '0px',
                borderRadius: '100px',
                backgroundColor: 'white'
            }} onClick={handleClick}>
                <p style={{padding: '14px 18px 14px 18px', margin: '0px', color: '#918D8D'}} >{text}</p>
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableRestoreFocus={true}
            >
                {categories.map((item, index) => (
                    <MenuItem key={index} onClick={() => {
                        handleCategoryClick(item)
                    }}>
                        {item}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default CustomMenu;