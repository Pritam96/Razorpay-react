import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTIxN2E3MmI5NDI1Y2I1MDY4NDZhMiIsImlhdCI6MTcxOTY3MzYyNiwiZXhwIjoxNzIyMjY1NjI2fQ.RGVNWCMMQYp5M5H1qxcPadHs0EKnphd4Niehyv1f0sk";

const Payment = () => {
  const checkoutHandler = async () => {
    try {
      // This API returns razorpay_key_id
      const responseKey = await axios.get(
        "http://localhost:5000/api/payment/key",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpay_key_id = responseKey.data?.key;

      if (!razorpay_key_id) {
        alert("Key not found");
        return;
      }

      // Create an order
      /*
        ** This API returns order details eg: username, email, order_id, amount **
                order = {
                  username: "Pritam",
                  email: "pritammondal96@gmail.com",
                  order_id: "order_OTEdizAA95XaYI",
                  amount: 50000,
                };
      */
      const orderResponse = await axios.post(
        "http://localhost:5000/api/payment/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = orderResponse.data;

      var options = {
        key: razorpay_key_id,
        amount: order.amount,
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://avatars.githubusercontent.com/u/48077267?v=4", // Change the image
        order_id: order.order_id,
        callback_url: "http://localhost:5000/api/payment/verify",
        prefill: {
          name: order.username,
          email: order.email,
          contact: order.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      razor.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred during the payment process. Please try again.");
    }
  };

  return (
    <div>
      <h2>Payments Page</h2>
      <button onClick={checkoutHandler}>Click to pay</button>
    </div>
  );
};

export default Payment;
