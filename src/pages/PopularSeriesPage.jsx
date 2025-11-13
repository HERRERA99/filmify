import {POPULAR_SERIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function PopularSeriesPage() {
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={"Popular Series"}
                apiPath={POPULAR_SERIES_SHORT_URL}
                mediaType={"tv"}
            />
        </>
    )
}