"use client";

import { useState } from "react";

const BASE_PATH = "/dashboard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <a className="mlvh-sidebar-toggle mlvh-sidebar-toggle-close" href="/about" aria-label="Back to entry screen">
          <img src={`${BASE_PATH}/icons/misc/close.svg`} alt="" />
        </a>
      </header>

      <div className="mlvh-app-shell">
        <div
          className={`mlvh-sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside className={`mlvh-sidebar ${sidebarOpen ? "open" : ""}`}>
          <a className="mlvh-sidebar-brand" href="/patients">
            <img src={`${BASE_PATH}/brand/mlvh.svg`} alt="MLVH" />
          </a>

          <nav className="mlvh-sidebar-nav">
            <a className="mlvh-sidebar-link active" href="/dashboard/">
              <img src={`${BASE_PATH}/icons/nav/dashboard.svg`} alt="" />
              <span>Dashboard</span>
            </a>
            <a className="mlvh-sidebar-link" href="/patients">
              <img src={`${BASE_PATH}/icons/nav/patients.svg`} alt="" />
              <span>Patient Admin</span>
            </a>
            <a className="mlvh-sidebar-link" href="/medical-records">
              <img src={`${BASE_PATH}/icons/nav/consultations.svg`} alt="" />
              <span>Medical Records</span>
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