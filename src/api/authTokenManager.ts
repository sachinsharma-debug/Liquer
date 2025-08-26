

/**
 * Save the token to local storage.
 * @param token - The token to be stored.
 */
export const saveToken = (token: string): void => {
    localStorage.setItem("authToken", token);
  };
  
  /**
   * Retrieve the token from local storage.
   * @returns The token if it exists, otherwise null.
   */
  export const getToken = (): string | null => {
    return localStorage.getItem("authToken");
  };
  
  /**
   * Remove the token from local storage.
   */
  export const clearToken = (): void => {
    localStorage.removeItem("authToken");
  };
  
  /**
   * Add the token to the headers of API requests.
   * @param headers - The headers object to which the token should be added.
   * @returns The updated headers object.
   */
  export const addTokenToHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  
  /**
   * Logout the user by clearing the token and optionally redirecting.
   * @param redirectUrl - The URL to redirect to after logout (optional).
   */
  export const logout = (redirectUrl?: string): void => {
    clearToken();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };
  