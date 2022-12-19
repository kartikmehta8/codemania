import React from "react";

export default function VideoItem({ video }) {
    return (
        <div className="m-4" style={{ width: "260px" }}>
            <div>
                <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        className=""
                        alt="THUMBNAIL"
                        src={video.snippet.thumbnails.medium.url}
                    />
                </a>
            </div>
        </div>
    );
}
