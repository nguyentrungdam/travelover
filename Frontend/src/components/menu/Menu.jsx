import { Link } from "react-router-dom";
import "./menu.css";
import { menu, menuEnterprise } from "../../assets/data/dataAdmin";
import { useSelector } from "react-redux";

const Menu = () => {
  const { account } = useSelector((state) => state.account);
  console.log(account.data.role);
  return (
    <div className="menu">
      {account.data.role === "ADMIN"
        ? menu.map((item) => (
            <div className="item" key={item.id}>
              <span className="title">{item.title}</span>
              {item.listItems.map((listItem) => (
                <Link to={listItem.url} className="listItem" key={listItem.id}>
                  <img src={listItem.icon} alt="" />
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              ))}
            </div>
          ))
        : menuEnterprise.map((item) => (
            <div className="item" key={item.id}>
              <span className="title">{item.title}</span>
              {item.listItems.map((listItem) => (
                <Link to={listItem.url} className="listItem" key={listItem.id}>
                  <img src={listItem.icon} alt="" />
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              ))}
            </div>
          ))}
    </div>
  );
};

export default Menu;
