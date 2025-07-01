import './App.css'
import axios from "axios";


function App() {


  const handlePayment = async () => {
    try {
      //create order via backend
      const data = {
        amount: 500,
        currency: "INR"
      }

      let response = await axios.post("http://localhost:8000/create-order", data);
      if (response.data.success) {
        let { id, currency, amount } = response.data.order;

        console.log("Order api response:");
        console.log({ id, currency, amount });


        const options = {
          key: "rzp_test_UHo2ud9UPAAaoQ", // Your Razorpay Key ID
          amount: amount, // Amount in paise
          currency: currency, // Currency code
          name: "Test Payment",
          description: "Test Payment Description",
          order_id: id, // Order ID from the backend
          handler: async function (response) {
            console.log("Payment successful:", response);
            //response contains =>
            //{razorpay_payment_id: 'pay_QnuzFlSsRlcISL', 
            // razorpay_order_id: 'order_QnuwtKwDehV1G9', 
            // razorpay_signature: 'ad76d78f9bfee7b436ddec00f2ce12b37df3a0f6a6c1b2d52311175dc79ff3e5'}

            console.log("Verifying payment...");
            const responseVerify = await axios.post("http://localhost:8000/verify-payment", response);
            if (responseVerify.data.success) {
              console.log("Payment verified successfully:", responseVerify.data);
              window.alert(responseVerify.data.message);
            } else {
              console.error("Payment verification failed:", responseVerify.data);
              window.alert(responseVerify.data.message);
            }
          },
          prefill: {
            name: "Md Romaan",
            email: "mohammadromaan2806@gmail.com",
            contact: "+917975001560",
          },
          theme: {
            color: "#F37254"
          }
        }

        const razorpay = new window.Razorpay(options);
        razorpay.open();

      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  }

  return (
    <>
      <button onClick={handlePayment}>Pay Now</button>
    </>
  )
}

export default App
