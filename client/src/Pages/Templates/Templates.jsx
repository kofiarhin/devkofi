import TemplateLIst from "../../components/TemplateList/TemplateList";
import useTemplateQuery from "../../hooks/useTemplateQuery";
import Spinner from "../../components/Spinner/Spinner";
import TemplateList from "../../components/TemplateList/TemplateList";
const Templates = () => {
  const { data, isPending } = useTemplateQuery();
  if (isPending) {
    return <Spinner />;
  }
  return (
    <div className="container">{data && <TemplateList data={data} />}</div>
  );
};

export default Templates;
