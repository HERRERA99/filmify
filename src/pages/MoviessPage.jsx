import {ALL_MOVIE_URL} from "../constants/api.js";
import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function MoviessPage() {
    const {t} = useLanguage();
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={t("movies")}
                apiPath={ALL_MOVIE_URL}
                mediaType={"movie"}
                filter={true}
            />
        </>
    )
}
