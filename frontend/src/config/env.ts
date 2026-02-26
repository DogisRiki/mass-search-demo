/**
 * 環境変数
 */
const createEnv = () => {
    const env = {
        API_URL: import.meta.env.VITE_API_URL,
    };

    if (!env.API_URL) {
        throw new Error("API_URL is required but not provided.");
    }

    return env;
};

export const env = createEnv();
