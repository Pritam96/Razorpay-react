import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const { reference } = useParams();
  return (
    <div>
      <h3>Order Successful</h3>
      <p>Reference no: {reference}</p>
    </div>
  );
};

export default PaymentSuccess;
