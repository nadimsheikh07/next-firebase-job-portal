"use client"

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

AuthGuard.propTypes = {
    children: PropTypes.node,
};

export default function AuthGuard({ children }) {
    const { isAuthenticated, isInitialized } = useAuth();

    const { pathname, push } = useRouter();

    const [requestedLocation, setRequestedLocation] = useState(null);

    useEffect(() => {
        if (requestedLocation && pathname !== requestedLocation) {
            push(requestedLocation);
        }
        if (isAuthenticated) {
            setRequestedLocation(null);
        }
    }, [isAuthenticated, pathname, push, requestedLocation]);

    if (!isInitialized) {
        return "Loading...";
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        push('/admin/auth/signin')
    }

    return <>{children}</>;
}