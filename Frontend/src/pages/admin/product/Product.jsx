import { singleProduct } from "../../../assets/data/dataAdmin";
import Single from "../../../components/single/Single";
import "./product.css";

const Product = () => {
  //Fetch data and send to Single Component
  return (
    <div className="product">
      <Single {...singleProduct} />
    </div>
  );
};

export default Product;
