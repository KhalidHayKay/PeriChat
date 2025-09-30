import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthContext();

    return isAuthenticated ? children : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
