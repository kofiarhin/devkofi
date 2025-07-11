import "./templateList.styles.scss";

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
              <a href={zip} className="btn" download>
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
