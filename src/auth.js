import {auth} from "../firebase.config.js"
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updatePassword
} from "@firebase/auth";

export const createUser = async (email, password) => {
    try {
        const userData = await createUserWithEmailAndPassword(auth, email, password);
        const status = true;
        return {userData, status};
    } catch (error) {
        console.error("Error signing in:", error.message);
    }
}

export const userSignIn = async (email, password) => {
    try {
        const userData = await signInWithEmailAndPassword(auth, email, password);
        const status = true;
        return {userData, status};
    } catch (error) {
        console.error("Error signing in:", error.message);
    }
};

export const userSignOut = () => {
    return auth.signOut();
}

export const userPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const userPasswordChange = (password) => {
    return updatePassword(auth, password);
}