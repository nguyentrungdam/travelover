import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../slices/accountSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, account } = useSelector((state) => state.account);
  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(signout());
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="logo">
        <img src="/airplane.png" alt="" />
        <h3>Travelover</h3>
      </div>
      <div className="icons">
        {isAuthenticated ? (
          <>
            {account?.data && (
              <div className="userwraper userwraper1">
                <h5 className="mb-0">
                  {account.data.firstName} {account.data.lastName}
                </h5>
                <img
                  className="user-avatar"
                  src={account.data.avatar || "/noavatar.png"}
                  alt={account.data.lastName}
                />
                <div className="DropDownContent DropDownContent1">
                  <Link className="link1" to="/user-profile">
                    <span className="SubA">Tài Khoản</span>
                  </Link>
                  <span className="SubA seperate" onClick={handleLogout}>
                    Đăng Xuất
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
