"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getHistoryPosition, stampHistoryEntry } from "@/lib/historyPosition";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);

  const navigateAfterClose = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!sidebarOpen || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const { href } = event.currentTarget;
    flushSync(() => setSidebarOpen(false));
    const animations = sidebarRef.current?.getAnimations() ?? [];
    Promise.allSettled(animations.map((animation) => animation.finished))
      .then(() => window.location.assign(href));
  };

  useEffect(() => {
    const sync = () => {
      const position = getHistoryPosition();
      setCanBack(position.canGoBack);
      setCanForward(position.canGoForward);
    };

    const closeSidebarForUnload = () => {
      document.documentElement.dataset.mlvhNavigating = "";
      sidebarRef.current?.classList.remove("open");
      backdropRef.current?.classList.remove("show");
      setSidebarOpen(false);
    };

    const handlePageShow = () => {
      sync();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          delete document.documentElement.dataset.mlvhNavigating;
        });
      });
    };

    stampHistoryEntry();
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", closeSidebarForUnload);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", closeSidebarForUnload);
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
        <a className="mlvh-sidebar-toggle mlvh-sidebar-toggle-close" href="/" aria-label="Back to entry screen">
          <img src={`/assets/icons/misc/close.svg`} alt="" />
        </a>
      </header>

      <nav className="mlvh-dock" aria-label="History">
        <button className="mlvh-dock-btn" aria-label="Go back" disabled={!canBack} onClick={() => window.history.back()}>
          <img src={`/assets/icons/misc/back.svg`} alt="" />
        </button>
        <button type="button" className="mlvh-dock-badge" aria-hidden="true" tabIndex={-1}>
          <img src={`/assets/brand/star.svg`} alt="" />
        </button>
        <button className="mlvh-dock-btn mlvh-dock-btn-forward" aria-label="Go forward" disabled={!canForward} onClick={() => window.history.forward()}>
          <img src={`/assets/icons/misc/back.svg`} alt="" />
        </button>
      </nav>

      <div className="mlvh-app-shell">
        <div
          ref={backdropRef}
          className={`mlvh-sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside ref={sidebarRef} className={`mlvh-sidebar ${sidebarOpen ? "open" : ""}`}>
          <a className="mlvh-sidebar-brand" href="/home" onClick={navigateAfterClose}>
            <img src={`/assets/brand/mlvh.svg`} alt="MLVH" />
          </a>

          <nav className="mlvh-sidebar-nav">
            <a className="mlvh-sidebar-link" href="/home" onClick={navigateAfterClose}>
              <img src={`/assets/icons/nav/home.svg`} alt="" />
              <span>Home</span>
            </a>
            <a className="mlvh-sidebar-link" href="/patients" onClick={navigateAfterClose}>
              <img src={`/assets/icons/nav/patients.svg`} alt="" />
              <span>Patient Admin</span>
            </a>
            <a className="mlvh-sidebar-link" href="/medical-records" onClick={navigateAfterClose}>
              <img src={`/assets/icons/nav/consultations.svg`} alt="" />
              <span>Medical Records</span>
            </a>
            <a className="mlvh-sidebar-link active" href="/dashboard/" onClick={navigateAfterClose}>
              <img src={`/assets/icons/nav/dashboard.svg`} alt="" />
              <span>Dashboard</span>
            </a>
          </nav>
        </aside>

        <main className="mlvh-main">
          <h1 className="mlvh-page-title">
            <img src={`/assets/brand/title.svg`} alt="My Little Virtual Hospital" />
          </h1>
          {children}
        </main>
      </div>
    </>
  );
}