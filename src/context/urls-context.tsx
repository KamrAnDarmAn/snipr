import axios from "axios";
import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import { UserContext } from "./user-context";
import { debounce } from "lodash";

const UrlContext = createContext();

export const UrlContextProvider = ({ children }) => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchUrls = useCallback(
        debounce(async () => {
            if (isFetching || !userInfo?.token) {
                if (!userInfo?.token) {
                    setUrls([]);
                    setError("Please log in to view URLs.");
                    setLoading(false);
                }
                return;
            }

            setIsFetching(true);
            setLoading(true);
            setError(null);

            try {
                const source = axios.CancelToken.source();
                const timeout = setTimeout(() => {
                    source.cancel("Request timed out");
                }, 5000);

                const res = await axios.get(
                    import.meta.env.VITE_API_URL
                        ? `${import.meta.env.VITE_API_URL}/get`
                        : "http://localhost:3001/get",
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                        cancelToken: source.token,
                    }
                );

                clearTimeout(timeout);
                if (!res.data.urls) {
                    console.warn("No urls field in response:", res.data);
                    setError("Invalid response format from server.");
                    setUrls([]);
                } else {
                    setUrls(res.data.urls);
                }
            } catch (error) {
                let errorMessage;
                if (axios.isCancel(error)) {
                    errorMessage = "Request timed out. Please try again.";
                } else {
                    errorMessage =
                        error.response?.status === 401
                            ? "Session expired. Please log in again."
                            : error.response?.data?.error || "Failed to fetch URLs.";
                    console.error("Fetch error:", errorMessage, error.response || error);
                    if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                        setUserInfo(null);
                    }
                }
                setError(errorMessage);
                toast.error(errorMessage);
                setUrls([]);
            } finally {
                setLoading(false);
                setIsFetching(false);
            }
        }, 1000),
        [userInfo?.token, isFetching, setUserInfo]
    );

    return (
        <UrlContext.Provider value={{ fetchUrls, urls, loading, error }}>
            {children}
        </UrlContext.Provider>
    );
};

export const useUrls = () => useContext(UrlContext);