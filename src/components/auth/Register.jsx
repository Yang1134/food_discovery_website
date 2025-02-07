import Header from "../../ReusableComponents/Header.jsx";
import {IconButton, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import {useAuth} from "../../contexts/authContext/index.jsx";
import {useState} from "react";
import {createUser} from "../../auth.js";
import {createUserEntry} from "../../apis.js";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


function Register() {
    const { userLoggedIn, setCurrentUserDB } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // If user is logged in redirect to home
    if (userLoggedIn) {
        navigate("/");
    }

    // Password show trigger
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {event.preventDefault();};
    const handleMouseUpPassword = (event) => {event.preventDefault();};

    // Form stuff
    const onSubmit = async () => {
        if(!isSigningIn) {
            setIsSigningIn(true)
            const {userData, status} = await createUser(email, password)
            if (status) {
                const {success, data} = await createUserEntry(userData.user, name)
                if (success) {
                    setCurrentUserDB(data);
                    // Now after registration, redirect to the category selection page
                    navigate("/changepreference");
                    // navigate("/");
                }
            }
        }
    }

    return (
        <>
            <Header></Header>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                paddingTop: "36px"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "500px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: '50px 100px'
                }}>
                    <p style={{
                        paddingBottom: '30px', fontSize: '36px'
                    }}>
                        Sign Up For Eat La!
                    </p>
                    <div style={{width: '100%', display: "flex", flexDirection: "column", paddingBottom: '10px'}}>
                        <p style={{color: "#797474"}}>Name</p>
                        <TextField
                            variant="outlined"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            style={{width: "100%"}}
                        />
                    </div>

                    <div style={{width: '100%', display: "flex", flexDirection: "column", paddingBottom: '10px'}}>
                        <p style={{color: "#797474"}}>Email</p>
                        <TextField
                            variant="outlined"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={{width: '100%', display: "flex", flexDirection: "column"}}>
                        <p style={{color: "#797474"}}>Password</p>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </div>

                    <button onClick={() => {
                        onSubmit()
                    }}
                            style={{backgroundColor: '#FD843D', borderRadius: '50px', marginTop: '50px', width: '100%'}}
                    >
                        Register Now
                    </button>
                </div>
            </div>
            <footer style={{position: 'fixed', bottom: '0', width: '100%'}}>
                <p>&copy; 2024 EatLa! All Rights Reserved.</p>
            </footer>
        </>
    )
}

export default Register;