// App.tsx
import { useState } from "react";
import { Rutas } from "./rutas/Rutas";
import styled from "styled-components";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";

const sin_sidebar = ["/login", "/", "/registro"];

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const shouldShowSidebar = !sin_sidebar.includes(
    location.pathname.toLowerCase()
  );

  return (
    <Container
      className={
        shouldShowSidebar
          ? sidebarOpen
            ? "sidebarState active"
            : ""
          : "no-sidebar"
      }
    >
      {shouldShowSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <MainContent $hasSidebar={shouldShowSidebar}>
        <Rutas />
      </MainContent>
    </Container>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// Estilos modificados
const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  transition: all 0.3s;
  min-height: 100vh;

  &.active {
    grid-template-columns: 300px auto;
  }

  &.no-sidebar {
    display: block;
  }
`;

const MainContent = styled.main<{ $hasSidebar: boolean }>`
  ${({ $hasSidebar }) =>
    !$hasSidebar &&
    `
    width: 100%;
    max-width: 100%;
  `}
`;
