import {userSignOut} from "../../auth.js";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Signout () {

    const navigate = useNavigate();

    useEffect(() => {
        userSignOut();
        navigate("/");
    }, [])

    return (
        <></>
    )
}

export default Signout;