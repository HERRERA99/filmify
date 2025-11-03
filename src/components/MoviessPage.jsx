import {InfiniteMediaGallery} from "./InfiniteMediaGallery.jsx";
import {ALL_MOVIE_URL} from "../constants/api.js";

export function MoviessPage() {
    return (
        <>
            <InfiniteMediaGallery
                title={"Movies"}
                apiPath={ALL_MOVIE_URL}
                mediaType={"movie"}
            />
        </>
    )
}