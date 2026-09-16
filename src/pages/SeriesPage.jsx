import {ALL_TV_URL} from "../constants/api.js";
import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function SeriesPage() {
    const {t} = useLanguage();
    useScrollMemory("seriesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={t("series")}
                apiPath={ALL_TV_URL}
                mediaType={"tv"}
                filter={true}
            />
        </>
    )
}
