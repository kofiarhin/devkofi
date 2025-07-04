const TemplateList = ({ data }) => {
  return (
    <div className="template-wrapper">
      {data.map((item) => (
        <div key={item.id || item.name}>
          <h2>{item.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
