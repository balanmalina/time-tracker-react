import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("pontaj_user");
    if (saved) setCurrentUser(JSON.parse(saved));

    const savedTheme = localStorage.getItem("pontaj_theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("pontaj_user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("pontaj_user");
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("pontaj_theme", newTheme);
    document.body.className = newTheme;
  };

  if (!currentUser) return (
    <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
  );

  return (
    <Dashboard
      user={currentUser}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;