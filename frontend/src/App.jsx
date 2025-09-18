import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/public/Register";
import PetRegister from "./pages/public/PetRegister";
import Index from "./pages/public";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/public/Register" element={<Register/>}/>
            <Route path="/public/PetRegister" element={<PetRegister/>}/>
            <Route path="/public/" element={<Index/>}/>
        </Routes>
    );
}
export default App;