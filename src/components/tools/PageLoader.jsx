import {useLanguage} from "../Language/LanguageContext.jsx";

import "../../styles/PageLoader.css";

export function PageLoader() {
    const {t} = useLanguage();
    return (
        <div className="page-loader">
            <div className="spinner"></div>
            <p>{t("loadingContent")}</p>
        </div>
    );
}
