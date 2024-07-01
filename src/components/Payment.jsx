import axios from "axios";
import { useNavigate } from "react-router-dom";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTIxN2E3MmI5NDI1Y2I1MDY4NDZhMiIsImlhdCI6MTcxOTY3MzYyNiwiZXhwIjoxNzIyMjY1NjI2fQ.RGVNWCMMQYp5M5H1qxcPadHs0EKnphd4Niehyv1f0sk";

const Payment = () => {
  const navigate = useNavigate();
  const checkoutHandler = async () => {
    try {
      // This API returns { razorpay_key_id }
      const responseKey = await axios.get(
        "http://localhost:5000/api/payment/key",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpay_key_id = responseKey.data?.razorpay_key_id;

      if (!razorpay_key_id) {
        alert("Key not found");
        return;
      }

      // Create an order
      /**
       * This API returns order details eg: username, email, order_id, amount **
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
        handler: async (response) => {
          try {
            // Verify payment signature
            /**
             * This API returns success message and reference_no
              {
                "message": "Payment successful",
                "reference_no": "order_OTFQBgbvI1F3sr"
              }
             */
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            navigate(`/paymentsuccess/${verifyResponse.data?.reference_no}`);
          } catch (error) {
            console.log(error);
          }
        },
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
      /**
       * Have to Handle Payment Error
       * {
              "code": "BAD_REQUEST_ERROR",
              "description": "Your payment didn't go through as it was declined by the bank. Try another payment method or contact your bank.",
              "source": "bank",
              "step": "payment_authorization",
              "reason": "payment_failed",
              "metadata": {
                  "payment_id": "pay_OTFnTrWcrAwUYB",
                  "order_id": "order_OTFnOJJycFCRRc"
              }
          }
       */
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
