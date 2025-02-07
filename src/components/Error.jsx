import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

function Error() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/')
    }, [])

    return (
        <>
        </>
    )
}

export default Error;