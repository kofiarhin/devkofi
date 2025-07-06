import "./templateList.styles.scss";
const TemplateList = ({ data }) => {
  return (
    <div className="template-wrapper">
      {data.map((item) => (
        <div key={item.id || item.name} className="template-unit">
          <h2>{item.name}</h2>
          <p> {item.description} </p>
          <button>Download</button>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
