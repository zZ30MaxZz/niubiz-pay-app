import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/page';
import PayPage from 'pages/pay/page';
import PayAppPage from 'pages/pay-app/page';
import TokenAppPage from 'pages/token-app/page';
import OnlyTokenPage from 'pages/only-token/only-token/page';
import OnlyTokenPayPage from 'pages/only-token/only-token-pay/page';
import OnlyTokenAppPage from 'pages/only-token/only-token-app/page';
import OnlyTokenPayAppPage from 'pages/only-token/only-token-pay-app/page';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pay" element={<PayPage />} />
                <Route path="/pay-app" element={<PayAppPage />} />
                <Route path="/token-app" element={<TokenAppPage />} />

                <Route path="/only-token/token" element={<OnlyTokenPage />} />
                <Route path="/only-token/pay" element={<OnlyTokenPayPage />} />
                <Route path="/only-token/token-app" element={<OnlyTokenAppPage />} />
                <Route path="/only-token/pay-app" element={<OnlyTokenPayAppPage />} />
            </Routes>
        </Router>
    );
};

export default App;
