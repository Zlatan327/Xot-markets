"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, Loader2, ExternalLink, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = "info", title, message, txHash, duration = 5000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message, txHash, duration }]);

    if (duration > 0 && type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id, { type, title, message, txHash, duration = 5000 }) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, type, title, message, txHash } : t))
    );
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, updateToast }}>
      {children}
      {/* Toast Render Container */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "420px",
        pointerEvents: "none"
      }}>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isLoading = toast.type === "loading";
          
          const borderColor = isSuccess ? "#238636" : isError ? "#da3633" : isLoading ? "#58a6ff" : "#30363d";
          const iconColor = isSuccess ? "#39d353" : isError ? "#f85149" : isLoading ? "#58a6ff" : "var(--glow-cyan)";

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "auto",
                background: "#0d1117",
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                padding: "14px 16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                color: "#f0f6fc",
                animation: "slideIn 0.25s ease-out",
                minWidth: "300px"
              }}
            >
              <div style={{ marginTop: "2px", color: iconColor }}>
                {isLoading ? <Loader2 size={18} className="animate-spin" /> :
                 isSuccess ? <CheckCircle2 size={18} /> :
                 isError ? <AlertCircle size={18} /> : <Info size={18} />}
              </div>

              <div style={{ flex: 1 }}>
                {toast.title && (
                  <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "2px" }}>
                    {toast.title}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.4" }}>
                  {toast.message}
                </div>

                {toast.txHash && (
                  <a
                    href={`https://www.okx.com/explorer/xlayer-test/tx/${toast.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#58a6ff",
                      fontSize: "11px",
                      marginTop: "6px",
                      textDecoration: "none",
                      fontWeight: "600"
                    }}
                  >
                    View on OKX Explorer <ExternalLink size={11} />
                  </a>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#8b949e",
                  cursor: "pointer",
                  padding: "2px",
                  marginTop: "-2px"
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
