// YoutubeList.jsx
import React from "react";
import "./youtubelist.styles.scss";

const YoutubeList = ({ data }) => {
  if (!data || data.length === 0) return <p>No videos found.</p>;

  return (
    <div className="youtube-list">
      {data.map(({ id, title, description, thumbnail, publishedAt }) => (
        <div key={id} className="youtube-card">
          <img src={thumbnail} alt={title} className="youtube-thumb" />
          <div className="youtube-info">
            <h3 className="youtube-title">{title}</h3>
            <p className="youtube-date">
              {new Date(publishedAt).toLocaleDateString()}
            </p>
            <p className="youtube-desc">{description.slice(0, 150)}...</p>
            <a
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-link"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YoutubeList;
