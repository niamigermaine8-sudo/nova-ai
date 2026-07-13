export type NovaAccount = {
  fullName: string;
  email: string;
  password: string;
};

const AUTH_KEY = "nova-authenticated";
const AUTH_USER_KEY = "nova-authenticated-user";
const ACCOUNT_KEY = "nova-account";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthenticated(user: { fullName: string; email: string; school?: string }) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_KEY, "true");
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthenticatedUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { fullName: string; email: string; school?: string };
  } catch {
    return null;
  }
}

export function clearAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredAccount(): NovaAccount | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(ACCOUNT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as NovaAccount;
  } catch {
    return null;
  }
}

export function saveAccount(account: NovaAccount) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}
