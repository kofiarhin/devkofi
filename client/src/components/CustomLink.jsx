import { Link } from "react-router-dom";

const CustomLink = ({ url = "/", text }) => {
  return <Link to={url}> {text} </Link>;
};

export default CustomLink;
