// App.tsx
import { useState } from "react";
import { Rutas } from "./rutas/Rutas";
import styled from "styled-components";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import Navbar from "./components/dashboard/Navbar"; // Comentado
import Footer from "./components/dashboard/Footer";

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
        {shouldShowSidebar && <Navbar sidebarOpen={sidebarOpen} />}
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
     margin-left: 90px;
    width: calc(100% - 90px);
    transition: all 0.3s ease;

    .sidebarState.active & {
      margin-left: 300px;
      width: calc(100% - 300px);
  `}
`;
