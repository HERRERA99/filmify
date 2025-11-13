import {ALL_MOVIE_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "../components/common/InfiniteMediaGallery.jsx";
import {useScrollMemory} from "../utils/useScrollMemory.js";

export function MoviessPage() {
    useScrollMemory("moviesScroll");

    return (
        <>
            <InfiniteMediaGallery
                title={"Movies"}
                apiPath={ALL_MOVIE_URL}
                mediaType={"movie"}
                filter={true}
            />
        </>
    )
}