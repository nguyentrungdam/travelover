import { useState } from "react";
import "./formInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPasswordInput = inputProps.type === "password";
  const handleFocus = (e) => {
    setFocused(true);
  };
  const togglePasswordVisibility = () => {
    if (isPasswordInput) {
      setShowPassword(!showPassword);
    }
  };
  const handleInputChange = (e) => {
    // Xử lý lỗi ở đây bằng cách kiểm tra errorMessage
    setHasError(errorMessage !== ""); // Kiểm tra xem errorMessage có giá trị hay không
  };
  return (
    <div className="formInput">
      <label className="text-dark">{label}</label>
      <div className="passwordContainer">
        <input
          {...inputProps}
          type={isPasswordInput && showPassword ? "text" : inputProps.type}
          onChange={onChange || handleInputChange}
          onBlur={handleFocus}
          onFocus={() =>
            inputProps.name === "confirmPassword" && setFocused(true)
          }
          focused={focused.toString()}
        />
        {isPasswordInput && (
          <div onClick={togglePasswordVisibility}>
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="passwordIcon"
            />
          </div>
        )}
      </div>
      {hasError && <span className="error-container">{errorMessage}</span>}
    </div>
  );
};

export default FormInput;
