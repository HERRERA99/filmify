import {ALL_TV_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";

export function SeriesPage() {
    return (
        <>
            <InfiniteMediaGallery
                title={"Series"}
                apiPath={ALL_TV_URL}
                mediaType={"tv"}
                filter={true}
            />
        </>
    )
}