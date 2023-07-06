declare global {
  interface Window {
    REACT_APP_SERVER_URL: string;
  }
}

export const serverUrl =
  window.REACT_APP_SERVER_URL ?? "http://localhost:3001/";
