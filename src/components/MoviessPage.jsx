import {ALL_MOVIE_URL} from "../constants/api.js";

import {InfiniteMediaGallery} from "./InfiniteMediaGallery.jsx";

export function MoviessPage() {
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