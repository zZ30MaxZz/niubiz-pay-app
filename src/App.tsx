import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/page';
import PayPage from 'pages/pay/page';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pay" element={<PayPage />} />
            </Routes>
        </Router>
    );
};

export default App;
