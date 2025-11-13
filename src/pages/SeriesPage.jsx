import {ALL_TV_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function SeriesPage() {
    useScrollMemory("moviesScroll");

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