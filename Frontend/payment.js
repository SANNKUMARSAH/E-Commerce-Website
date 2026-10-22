// ==========================================
// Razorpay payment helper (used by checkout.html and orders.html)
// Resolves { paid: true } on success,
//          { paid: false, error } when the popup is closed without paying.
// Rejects on network/server errors.
// ==========================================
async function startRazorpayPayment(orderId) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const res = await fetch(`${window.API_BASE}/api/payment/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({ orderId })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Could not start payment");
    }

    if (typeof Razorpay === "undefined") {
        throw new Error("Payment window could not load. Check your internet and try again.");
    }

    return new Promise((resolve, reject) => {
        let lastError = null;

        const rzp = new Razorpay({
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            order_id: data.razorpayOrderId,
            name: "ShopEase",
            description: "Order payment",
            theme: { color: "#2563eb" },

            handler: async function (response) {
                try {
                    const verify = await fetch(`${window.API_BASE}/api/payment/verify`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const result = await verify.json();

                    if (!verify.ok) {
                        throw new Error(result.message || "Payment verification failed");
                    }

                    resolve({ paid: true });
                } catch (err) {
                    reject(err);
                }
            },

            modal: {
                ondismiss: function () {
                    resolve({ paid: false, error: lastError });
                }
            }
        });

        rzp.on("payment.failed", function (resp) {
            lastError = (resp.error && resp.error.description) || "Payment failed";
        });

        rzp.open();
    });
}
