import { Link } from "react-router-dom";
import "./templateList.styles.scss";
import { downloadFile } from "../../services/services";

const TemplateList = ({ data }) => {
  return (
    <div className="list">
      {data.map(({ slug, name, description, tags, zip, status }) => (
        <div key={slug} className="card">
          <div className="image">
            <img
              src={`/img/test.png`}
              alt={name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.jpg";
              }}
            />
          </div>
          <div className="content">
            <h3 className="title">{name}</h3>
            <p className="desc">{description}</p>
            <div className="tags">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="footer">
              <span className={`status ${status}`}>{status}</span>
              <button
                onClick={() => downloadFile(name)}
                className="btn"
                download
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
