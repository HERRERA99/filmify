import {POPULAR_SERIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";

export function PopularSeriesPage() {
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