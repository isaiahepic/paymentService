const https = require("https");
const dotenv = require("dotenv");
dotenv.config();

// Configure Paystack
const payStack = {
  acceptPayment: async (req, res) => {
    console.log("Request Body: ", req.body);
    try {
      // Request body from the clients
      const { email, amount } = req.body;
      if (!email || !amount) {
        return res
          .status(400)
          .json({ error: "Email and amount are required fields" });
      }

      // Params
      const params = JSON.stringify({
        email,
        amount: amount * 100,
      });

      //   return res.status(200).json({ msg: "Payment initialized", params });

      // Options
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };

      // Client request to paystack API
      const clientReq = https
        .request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", () => {
            const parsed = JSON.parse(data);
            console.log("Paystack Response:", parsed);
            return res.status(200).json(parsed);
          });
        })
        .on("error", (error) => {
          console.error(error);
        });
      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

const initializePayment = payStack;
module.exports = initializePayment;
