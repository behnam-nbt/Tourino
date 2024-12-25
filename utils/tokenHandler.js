import Cookies from "js-cookie";

export const setTokens = (data) => {
    const { accessToken, refreshToken } = data;
    Cookies.set('accessToken', accessToken, { expires: 7 }); // Expires in 7 days
    Cookies.set('refreshToken', refreshToken, { expires: 30 }); // Expires in 30 days

    console.log('Tokens are set in cookies');
};

export const getToken = (tokenName) => {
    const token = Cookies.get(tokenName);
    if (!token) {
        console.warn(`Token ${tokenName} not found`);
    }
    return token;
};