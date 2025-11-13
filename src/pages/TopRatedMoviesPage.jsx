import {TOP_RATED_MOVIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function TopRatedMoviesPage() {
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={"Top Rated Movies"}
                apiPath={TOP_RATED_MOVIES_SHORT_URL}
                mediaType={"movie"}
            />
        </>
    )
}