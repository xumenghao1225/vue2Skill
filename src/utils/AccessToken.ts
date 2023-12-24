const tokenTableName = "accessToken";

export const getAccessToken = () => sessionStorage.getItem(tokenTableName);

export const setAccessToken = (accessToken: string) =>
  sessionStorage.setItem(accessToken, tokenTableName);

export const removeAccessToken = () => sessionStorage.clear();
