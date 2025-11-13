import {TOP_RATED_SERIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function TopRatedSeriesPage() {
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={"Top Rated Series"}
                apiPath={TOP_RATED_SERIES_SHORT_URL}
                mediaType={"tv"}
            />
        </>
    )
}