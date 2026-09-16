import {POPULAR_SERIES_SHORT_URL} from "../constants/api.js";
import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function PopularSeriesPage() {
    const {t} = useLanguage();
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={t("popularSeries")}
                apiPath={POPULAR_SERIES_SHORT_URL}
                mediaType={"tv"}
            />
        </>
    )
}
