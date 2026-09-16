import {IoGlobeOutline} from "react-icons/io5";

import {useLanguage} from "./LanguageContext.jsx";

export function LanguageSelector({className = ""}) {
    const {language, languages, setLanguage} = useLanguage();
    return <label className={`language-selector ${className}`} title="Idioma / Language">
        <IoGlobeOutline aria-hidden="true" />
        <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Idioma">
            {Object.entries(languages).map(([code, item]) => <option key={code} value={code}>{item.short}</option>)}
        </select>
    </label>;
}
