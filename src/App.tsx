import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Outlet />
    </div>
  );
}

export default App;
