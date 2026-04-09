import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("pontaj_user");
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("pontaj_user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("pontaj_user");
    setCurrentUser(null);
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;
  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;

