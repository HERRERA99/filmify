import {UPCOMING_MOVIES_SHORT_URL} from "../constants/api.js";
import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function UpcomingMoviesPage() {
    const {t} = useLanguage();
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={t("upcoming")}
                apiPath={UPCOMING_MOVIES_SHORT_URL}
                mediaType={"movie"}
            />
        </>
    )
}
