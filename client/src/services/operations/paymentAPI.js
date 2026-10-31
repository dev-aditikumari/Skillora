import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { paymentEndpoints } from "../api";
import { getUserDetails } from "./profileAPI";

const { CAPTURE_PAYMENT_API, VERIFY_PAYMENT_API, ENROLL_FREE_API } = paymentEndpoints;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const verifyPayment = async (paymentResponse, navigate, dispatch) => {
  const toastId = toast.loading("Verifying payment...");
  try {
    const response = await apiConnector("POST", VERIFY_PAYMENT_API, paymentResponse);
    if (!response.data.success) throw new Error(response.data.message);

    toast.success("You are enrolled!");
    dispatch(getUserDetails());
    navigate("/dashboard/enrolled-courses");
  } catch (error) {
    toast.error(error.response?.data?.message || "Payment verification failed");
  }
  toast.dismiss(toastId);
};

export const buyCourse = async (courseId, user, navigate, dispatch) => {
  const toastId = toast.loading("Loading...");
  try {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Could not load payment gateway");

    const response = await apiConnector("POST", CAPTURE_PAYMENT_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    const order = response.data.data;

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Skillora",
      description: order.courseName,
      prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email },
      handler: (paymentResponse) => verifyPayment(paymentResponse, navigate, dispatch),
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", () =>
      toast.error("Payment failed. Please try again.")
    );
    paymentObject.open();
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Could not start payment");
  }
  toast.dismiss(toastId);
};

export const enrollFree = async (courseId, navigate, dispatch) => {
  const toastId = toast.loading("Enrolling...");
  try {
    const response = await apiConnector("POST", ENROLL_FREE_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("You are enrolled!");
    dispatch(getUserDetails());
    navigate("/dashboard/enrolled-courses");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Could not enroll");
  }
  toast.dismiss(toastId);
};
