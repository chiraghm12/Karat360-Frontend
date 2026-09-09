import { useEffect } from "react";

const PageMeta = ({ title }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
};

export const AppWrapper = ({ children }) => <>{children}</>;

export default PageMeta;
