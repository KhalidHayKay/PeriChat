let logoutFn: (() => void) | null = null;

export const setLogout = (fn: () => void) => {
    logoutFn = fn;
};

export const triggerLogout = () => {
    if (logoutFn) {
        logoutFn();
    } else {
        localStorage.clear();
        window.location.href = '/login';
    }
};
