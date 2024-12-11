import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/page';
import PaymentPage from './pages/payment/page';
import PayPage from 'pages/pay/page';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pay" element={<PayPage />} />
                <Route path="/payment" element={<PaymentPage />} />
            </Routes>
        </Router>
    );
};

export default App;
