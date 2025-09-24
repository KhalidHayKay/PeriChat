import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import AuthLayout from './layouts/AuthLayout';
import Home from './layouts/Home';
import Login from './pages/Auth/Login';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                {/* <Route path='about' element={<About />} /> */}

                <Route element={<AuthLayout />}>
                    <Route path='login' element={<Login />} />
                    {/* <Route path='register' element={<Register />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
