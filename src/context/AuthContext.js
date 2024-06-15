"use client"

import { AUTH, DB } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';

const ADMIN_EMAILS = ['nadim.sheikh.07@gmail.com'];

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const reducer = (state, action) => {
    if (action.type === 'INITIALISE') {
        const { isAuthenticated, user } = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    }

    return state;
};

const AuthContext = createContext({
    ...initialState,
    method: 'firebase',
    login: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [profile, setProfile] = useState(null);

    useEffect(
        () =>
            onAuthStateChanged(AUTH, async (user) => {
                if (user) {
                    const userRef = doc(DB, 'users', user.uid);

                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        setProfile(docSnap.data());
                    }

                    dispatch({
                        type: 'INITIALISE',
                        payload: { isAuthenticated: true, user },
                    });
                } else {
                    dispatch({
                        type: 'INITIALISE',
                        payload: { isAuthenticated: false, user: null },
                    });
                }
            }),
        [dispatch]
    );

    const login = async (email, password) => {
        return await signInWithEmailAndPassword(AUTH, email, password)
    };

    const signUp = async (data) => {
        const { email, password, firstName, lastName } = data;

        try {
            const res = await createUserWithEmailAndPassword(AUTH, email, password);

            if (res && res.user) {
                const userRef = doc(collection(DB, 'users'), res.user.uid);

                await setDoc(userRef, {
                    uid: res.user.uid,
                    email,
                    firstName,
                    lastName
                });
            }

            return res;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error; // Re-throw the error after logging it
        }
    };

    const logout = () => signOut(AUTH);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'firebase',
                user: {
                    id: state?.user?.uid,
                    email: state?.user?.email,
                    photoURL: state?.user?.photoURL || profile?.photoURL,
                    displayName: `${state?.user?.firstName} ${state?.user?.lastName}` || profile?.displayName,
                    role: ADMIN_EMAILS.includes(state?.user?.email) ? 'admin' : 'user',
                    phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
                    country: profile?.country || '',
                    address: profile?.address || '',
                    state: profile?.state || '',
                    city: profile?.city || '',
                    zipCode: profile?.zipCode || '',
                    about: profile?.about || '',
                    isPublic: profile?.isPublic || false,
                },
                login,
                signUp,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
