// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"

import AuthForm from "./auth/AuthForm"
import ProtectedRoute from "./auth/ProtectedRoute"
import Dashboard from "./components/Dashboard"
import NotFound from "./components/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
