// src/utils/authTokenManager.ts

const TOKEN_KEY = "accessToken";

export const authTokenManager = {
  set(token: string | null) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
