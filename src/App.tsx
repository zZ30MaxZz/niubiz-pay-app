import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/page';
import PayPage from 'pages/pay/page';
import PayAppPage from 'pages/pay-app/page';
import TokenAppPage from 'pages/token-app/page';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pay" element={<PayPage />} />
                <Route path="/pay-app" element={<PayAppPage />} />
                <Route path="/token-app" element={<TokenAppPage />} />
            </Routes>
        </Router>
    );
};

export default App;
