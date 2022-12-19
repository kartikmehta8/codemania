import React from "react";
import VideoItem from "./VideoItem";

function VideoList({ videos }) {
    const listOfVideos = videos.map((video, id) => (
        <VideoItem key={id} video={video} />
    ));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-4">
            {listOfVideos}
        </div>
    );
}

export default VideoList;
