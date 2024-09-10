"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import App from "./components/app";
import { handleLogin } from "./request";

// Main component
export default function EWSIndex() {
  const router = useRouter();
  const loginCalled = useRef(false);

  useEffect(() => {
    if (!loginCalled.current) {
      loginCalled.current = true;
      handleLogin(router);
    }
  }, [router]);

  return (
    <>
      <App />
    </>
  );
}
