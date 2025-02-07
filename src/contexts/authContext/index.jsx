import {createContext, useState, useEffect, useContext} from "react";
import { auth } from "../../../firebase.config.js";
import {onAuthStateChanged} from "@firebase/auth";
import {getUserEntry} from "../../apis.js";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUserDB, setCurrentUserDB] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
            const data = await getUserEntry(user.uid)
            if (data) {
                setCurrentUserDB(data);
                console.log("Welcome Back,", data.name)
            }
            setCurrentUser({...user });
            setUserLoggedIn(true);
        }
        else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading,
        currentUserDB,
        setCurrentUserDB,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}