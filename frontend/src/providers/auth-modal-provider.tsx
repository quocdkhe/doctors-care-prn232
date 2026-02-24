"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LoginModal } from "../components/modals/login-modal";
import { RegisterModal } from "../components/modals/register-modal";

type ModalType = "login" | "register" | null;

interface AuthModalContextType {
  activeModal: ModalType;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <AuthModalContext.Provider
      value={{
        activeModal,
        openLoginModal: () => setActiveModal("login"),
        openRegisterModal: () => setActiveModal("register"),
        closeModal: () => setActiveModal(null),
      }}
    >
      {children}
      <LoginModal
        open={activeModal === "login"}
        onClose={() => setActiveModal(null)}
      />
      <RegisterModal
        open={activeModal === "register"}
        onClose={() => setActiveModal(null)}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
