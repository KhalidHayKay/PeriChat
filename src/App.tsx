import { BrowserRouter, Route, Routes } from 'react-router';

import './App.css';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { AppEventProvider } from './contexts/AppEventsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConversationProvider } from './contexts/ConversationContext';
import { EchoProvider } from './contexts/EchoContext';
import { OnlineUsersProvider } from './contexts/OnlineUsersContext';
import { TempMessagesProvider } from './contexts/TempMessagesContext';
import AuthLayout from './layouts/AuthLayout';
import ChatLayout from './layouts/ChatLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Conversation from './pages/Conversation';
import Home from './pages/Home';
import NewPrivateConversation from './pages/NewPrivateConversation';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        element={
                            <ProtectedRoute>
                                <EchoProvider>
                                    <OnlineUsersProvider>
                                        <AppEventProvider>
                                            <ConversationProvider>
                                                <TempMessagesProvider>
                                                    <ChatLayout />
                                                </TempMessagesProvider>
                                            </ConversationProvider>
                                        </AppEventProvider>
                                    </OnlineUsersProvider>
                                </EchoProvider>
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route
                            path='conversation/:conversationId'
                            element={<Conversation />}
                        />
                        <Route
                            path='conversation/new'
                            element={<NewPrivateConversation />}
                        />
                    </Route>

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
