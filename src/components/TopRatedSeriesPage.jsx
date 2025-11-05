import {TOP_RATED_SERIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "./InfiniteMediaGallery.jsx";

export function TopRatedSeriesPage() {
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