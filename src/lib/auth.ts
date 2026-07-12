export type NovaAccount = {
  fullName: string;
  email: string;
  password: string;
};

const AUTH_KEY = "nova-authenticated";
const ACCOUNT_KEY = "nova-account";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_KEY, "true");
}

export function clearAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_KEY);
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
