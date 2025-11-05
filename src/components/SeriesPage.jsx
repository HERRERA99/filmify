import {InfiniteMediaGallery} from "./InfiniteMediaGallery.jsx";
import {ALL_TV_URL} from "../constants/api.js";

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