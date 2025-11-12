import { useState } from "react";
import "./playground.styles.scss";
import Upload from "../../components/Upload/Upload";
const Playground = () => {
  const [trapEmpty, setTrapEmpty] = useState(false);
  console.log(trapEmpty);

  return (
    <div>
      <div
        id="playground"
        onMouseEnter={() => setTrapEmpty(false)}
        onMouseLeave={() => setTrapEmpty(true)}
        className={trapEmpty ? "empty" : ""}
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore saepe
          veritatis omnis nesciunt fugiat reiciendis tempore in commodi libero
          facere.
        </p>
      </div>
    </div>
  );
};

export default Playground;
