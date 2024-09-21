import { Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";

function App() {
  return (
    <ProtectedRoute role={undefined}>
      <MainLayout />
    </ProtectedRoute>
  );
}

export default App;
