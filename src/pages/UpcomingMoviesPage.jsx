import {UPCOMING_MOVIES_SHORT_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function UpcomingMoviesPage() {
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={"Upcoming Movies"}
                apiPath={UPCOMING_MOVIES_SHORT_URL}
                mediaType={"movie"}
            />
        </>
    )
}