"use client"

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import SignInForm from '@/components/auth/signIn';
import { PermissionError } from '@/components/auth/permissionError';

AuthGuard.propTypes = {
    children: PropTypes.node,
};

export default function AuthGuard({ children }) {
    const { isAuthenticated, isInitialized, user } = useAuth();

    const { push } = useRouter();
    const pathname = usePathname();
    
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

    if (isAuthenticated && user.role != "admin") {
        const isAdminPath = pathname.includes('/admin');
        if (isAdminPath) {
            return (
                <PermissionError title="Authentication Error" error="you don't have permission to access this page"/>
            )
        }
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }

        return (
            <SignInForm />
        )
    }

    return <>{children}</>;
}