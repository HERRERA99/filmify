import {TOP_RATED_MOVIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";

export function TopRatedMoviesPage() {
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