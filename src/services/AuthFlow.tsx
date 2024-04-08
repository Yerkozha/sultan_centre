import React from 'react';
import { RootState } from '@/store';
import { useStore } from 'react-redux';
import AuthContainer from '@/presentation/container/AuthContainer';
import { useAppSelector } from '@/hooks/useStore';

export const withAuth = (WrappedComponent) => (props) => {
    
    const accessToken = useAppSelector(state => state.user.access);
    
    if (!accessToken) {
        return <AuthContainer />;
    }

    return <WrappedComponent {...props} />;
};
  
