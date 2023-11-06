import { useState } from "react";
import "./formInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validate";
const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, onChange, value, id, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isPasswordInput = inputProps.type === "password";

  const handleInputChange = (e) => {
    if (inputProps.name === "email") {
      const isValidEmail = validateEmail(e.target.value);
      if (!isValidEmail) {
        setErrorMessage("Phải là một địa chỉ email hợp lệ!");
      } else {
        setErrorMessage("");
      }
    } else if (
      inputProps.name === "firstname" ||
      inputProps.name === "lastname"
    ) {
      const isValidName = validateName(e.target.value);
      if (!isValidName && inputProps.name === "firstname") {
        setErrorMessage("Họ tối đa 10 kí tự và không có kí tự đặc biệt!");
      } else if (!isValidName && inputProps.name === "lastname") {
        setErrorMessage("Tên tối đa 10 kí tự và không có kí tự đặc biệt!");
      } else {
        setErrorMessage("");
      }
    } else if (inputProps.name === "password") {
      const isValidPassword = validatePassword(e.target.value);
      if (!isValidPassword) {
        setErrorMessage(
          "Mật khẩu nên có 8-20 ký tự và bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt (!@#$%^&*)"
        );
      } else {
        setErrorMessage("");
      }
    }
    onChange(e);
  };

  const handleFocus = (e) => {
    setFocused(true);
  };

  const togglePasswordVisibility = () => {
    if (isPasswordInput) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="formInput">
      <label className="text-dark label-form">{label}</label>
      <div className="inputContainer">
        <input
          className="input-form"
          {...inputProps}
          type={isPasswordInput && showPassword ? "text" : inputProps.type}
          onChange={handleInputChange}
          value={value}
          onBlur={handleFocus}
          onFocus={() =>
            inputProps.name === "confirmPassword" && setFocused(true)
          }
          focused={focused.toString()}
        />
        {isPasswordInput && (
          <div
            className="passwordIconContainer"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="passwordIcon"
            />
          </div>
        )}
      </div>
      {errorMessage && <span className="error-container">{errorMessage}</span>}
    </div>
  );
};

export default FormInput;
