import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import ProtectedRoute from "@/components/ProtectedRoute";

const mockUseAppSession = vi.fn();

vi.mock("@/contexts/AppSessionContext", () => ({
  useAppSession: () => mockUseAppSession(),
}));

describe("ProtectedRoute", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    container?.remove();
    mockUseAppSession.mockReset();
  });

  const renderRoute = (path: string) => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter
          initialEntries={[path]}
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <div>Admin page</div>
                </ProtectedRoute>
              }
            />
            <Route path="/account" element={<div>Account page</div>} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>,
      );
    });
  };

  it("redirects non-admin authenticated users away from admin routes", () => {
    mockUseAppSession.mockReturnValue({
      authStatus: "authenticated",
      isAuthenticated: true,
      isAdmin: false,
      adminStatus: "ready",
    });

    renderRoute("/admin");

    expect(container.textContent).toContain("Account page");
  });

  it("renders admin routes for authenticated admins", () => {
    mockUseAppSession.mockReturnValue({
      authStatus: "authenticated",
      isAuthenticated: true,
      isAdmin: true,
      adminStatus: "ready",
    });

    renderRoute("/admin");

    expect(container.textContent).toContain("Admin page");
  });
});
