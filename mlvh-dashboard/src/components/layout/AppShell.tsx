"use client";

import { useEffect, useRef, useState } from "react";
import { getHistoryPosition, stampHistoryEntry } from "@/lib/historyPosition";
const BASE_PATH = "/dashboard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const closeSidebarForNavigationRef = useRef(() => {
    document.documentElement.dataset.mlvhNavigating = "";
    sidebarRef.current?.classList.remove("open");
    backdropRef.current?.classList.remove("show");
    setSidebarOpen(false);
  });
  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);

  useEffect(() => {
    const sync = () => {
      const position = getHistoryPosition();
      setCanBack(position.canGoBack);
      setCanForward(position.canGoForward);
    };

    const closeSidebar = () => closeSidebarForNavigationRef.current();

    const handlePageShow = () => {
      delete document.documentElement.dataset.mlvhNavigating;
      sync();
    };

    stampHistoryEntry();
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", closeSidebar);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", closeSidebar);
    };
  }, []);

  return (
    <>
      <header className="mlvh-header">
        <button
          className="mlvh-sidebar-toggle mlvh-sidebar-toggle-open"
          aria-label="Toggle navigation"
          onClick={() => setSidebarOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mlvh-header-nav">
          <button className="mlvh-header-nav-btn" aria-label="Go back" disabled={!canBack} onClick={() => window.history.back()}>
            <img src={`${BASE_PATH}/icons/misc/back.svg`} alt="" />
          </button>
          <button className="mlvh-header-nav-btn mlvh-header-nav-btn-forward" aria-label="Go forward" disabled={!canForward} onClick={() => window.history.forward()}>
            <img src={`${BASE_PATH}/icons/misc/back.svg`} alt="" />
          </button>
        </div>
        <a className="mlvh-sidebar-toggle mlvh-sidebar-toggle-close" href="/" aria-label="Back to entry screen">
          <img src={`${BASE_PATH}/icons/misc/close.svg`} alt="" />
        </a>
      </header>

      <div className="mlvh-app-shell">
        <div
          ref={backdropRef}
          className={`mlvh-sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside ref={sidebarRef} className={`mlvh-sidebar ${sidebarOpen ? "open" : ""}`}>
          <a className="mlvh-sidebar-brand" href="/home">
            <img src={`${BASE_PATH}/brand/mlvh.svg`} alt="MLVH" />
          </a>

          <nav className="mlvh-sidebar-nav">
            <a className="mlvh-sidebar-link" href="/home" onClick={closeSidebarForNavigationRef.current}>
              <img src={`${BASE_PATH}/icons/nav/home.svg`} alt="" />
              <span>Home</span>
            </a>
            <a className="mlvh-sidebar-link" href="/patients" onClick={closeSidebarForNavigationRef.current}>
              <img src={`${BASE_PATH}/icons/nav/patients.svg`} alt="" />
              <span>Patient Admin</span>
            </a>
            <a className="mlvh-sidebar-link" href="/medical-records" onClick={closeSidebarForNavigationRef.current}>
              <img src={`${BASE_PATH}/icons/nav/consultations.svg`} alt="" />
              <span>Medical Records</span>
            </a>
            <a className="mlvh-sidebar-link active" href="/dashboard/" onClick={closeSidebarForNavigationRef.current}>
              <img src={`${BASE_PATH}/icons/nav/dashboard.svg`} alt="" />
              <span>Dashboard</span>
            </a>
          </nav>
        </aside>

        <main className="mlvh-main">
          <h1 className="mlvh-page-title">
            <img src={`${BASE_PATH}/brand/title.svg`} alt="My Little Virtual Hospital" />
          </h1>
          {children}
        </main>
      </div>
    </>
  );
}