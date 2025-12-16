import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { firstName } = formData;

  return (
    <div>
      <h1 className="heading center">Register</h1>

      <div className="form-wrapper">
        <form>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name..."
              name="firstName"
              value={firstName}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
