import {UPCOMING_MOVIES_SHORT_URL} from "../constants/api.js";
import {InfiniteMediaGallery} from "./InfiniteMediaGallery.jsx";

export function UpcomingMoviesPage() {
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