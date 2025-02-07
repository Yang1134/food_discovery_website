import {useEffect, useState} from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {useLocation, useNavigate} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {useAuth} from "../contexts/authContext/index.jsx";

function Header() {
    const [accountOpen, setAccountOpen] = useState(false);
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [accountMenu, setAccountMenu] = useState([]);
    const { userLoggedIn } = useAuth();

    const handleClick = (event) => { setAnchorEl(event.currentTarget); };
    function handleClose() { setAnchorEl(null); }
    const nav = useNavigate()

    useEffect(() => {
        if (userLoggedIn) {
            setAccountMenu([
                { path: '/profile', label: 'Profile'},
                { path: "/logout", label: "Log Out" }
            ])
        } else {
            setAccountMenu([
                { path: '/login', label: 'Log In' },
                { path: '/register', label: 'Register' }
            ])
        }
    } ,[userLoggedIn])

    // Headers
    const navigationLinks = [
        { path: "/find-food", label: "Find food" },
        { path: "/categories", label: "Categories" },
        { path: "/restaurants", label: "Restaurants" },
        { path: "/about-us", label: "About us" },
    ];

    return (
        <>
            <div>
                <div style={{ height: "10px", width: "100%", backgroundColor: "#FD843D" }}></div>
                <div style={{ height: "88px", width: "100%", display: "flex", flexDirection: "row" }}>
                    <a href="/">
                        <img
                            src="https://i.ibb.co/dDpLHxg/Group-5.png"
                            style={{height: "100%", width: "187px"}}
                            alt=""
                        />
                    </a>
                    <div style={{display: "flex", flexDirection: "row", gap: "57px", paddingLeft: "107px"}}>
                        {navigationLinks.map((link) => (
                            <div key={link.path} style={{
                                display: "flex", flexDirection: 'column', alignItems: "center", margin: "auto 0",
                            }}>
                                <a href={`${link.path}`}>
                                    <p
                                        key={link.path}
                                        style={{
                                            fontSize: "16px",
                                            color: "#797474",
                                        }}
                                    >
                                        {link.label}
                                    </p>
                                </a>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: location.pathname === link.path ? "#FD843D" : "transparent",
                                        marginTop: "8px",
                                    }}
                                ></div>
                            </div>
                            ))}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: "auto",
                            paddingRight: "88px",
                            gap: "50px",
                        }}
                    >
                        <button
                            style={{
                                backgroundColor: "transparent",
                                color: "black",
                                padding: "0",
                                margin: "auto 0",
                                outline: "none",
                            }}
                            onClick={(e) => {
                                setAccountOpen(!accountOpen)
                                handleClick(e)
                            }}
                        >
                            {accountOpen ? (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <p style={{ fontSize: "16px", margin: 0, paddingRight: "5px" }}>Account</p>
                                    <KeyboardArrowUpIcon />
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <p style={{ fontSize: "16px", margin: 0, paddingRight: "5px" }}>Account</p>
                                    <KeyboardArrowDownIcon />
                                </div>
                            )}
                        </button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            disableRestoreFocus={true}
                        >
                            {accountMenu.map((menu, i) => (
                                <MenuItem key={i}>
                                    <a href={`${menu.path}`}>
                                        <p style={{color: 'black'}}>
                                            {menu.label}
                                        </p>
                                    </a>
                                </MenuItem>
                            ))}
                        </Menu>
                            <button
                                style={{
                                    height: "34px",
                                    textAlign: "center",
                                    padding: "0 20px",
                                    borderRadius: "100px",
                                    margin: "auto 0",
                                    backgroundColor: "#FD843D",
                                }}

                                onClick={() => {
                                    nav('/apply-partner')
                                }}
                            >
                                <p style={{fontSize: "16px"}}>Apply for partner</p>
                            </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
