import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";

import ServerConfig from "./pages/ServerConfig";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pairing from "./pages/Pairing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import Services from "./pages/Services";

const theme = createTheme({
  palette: { mode: "dark" },
  typography: { fontFamily: "Poppins, sans-serif", fontSize: 13 },
});

const App = () => {
  const [connected, setConnected] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          {/* Navbar always visible */}
          <Navbar connected={connected} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/connect" element={<ServerConfig />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard setConnected={setConnected} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pairing"
              element={
                <ProtectedRoute>
                  <Pairing />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
