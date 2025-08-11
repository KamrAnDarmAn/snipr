import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    return { id: decoded.id, token };
                } else {
                    localStorage.removeItem("token");
                    return null;
                }
            } catch (error) {
                localStorage.removeItem("token");
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUserInfo({ id: decoded.id, token });
                } else {
                    localStorage.removeItem("token");
                    setUserInfo(null);
                }
            } catch (error) {
                localStorage.removeItem("token");
                setUserInfo(null);
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUserInfo(null);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}