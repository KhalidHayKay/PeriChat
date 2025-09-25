import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import ChatLayout from './layouts/ChatLayout';
// import Home from './layouts/Home';
import { ChatProvider } from './contexts/ChatContext';
import { EventBusProvider } from './contexts/EventBus';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        element={
                            <ProtectedRoute>
                                {/* <OnlineUsersProvider> */}
                                <EventBusProvider>
                                    <ChatProvider>
                                        <ChatLayout />
                                    </ChatProvider>
                                </EventBusProvider>
                                {/* </OnlineUsersProvider> */}
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                    </Route>
                    {/* Individual conversation routes */}
                    {/* <Route path=":conversationId" element={<Conversation />} /> */}

                    <Route element={<AuthLayout />}>
                        <Route path='login' element={<Login />} />
                        <Route path='register' element={<Register />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
