const cron = require("node-cron");
const axios = require("axios");

const startCronJobs = () => {
    cron.schedule("0 * * * * *", async () => {
        try {
          // Replace this URL with the API endpoint you want to call
          const response = await axios.get(`${process.env.SERVER_URL}/api/alive`);
          console.log("API called successfully:", response.data.message);
        } catch (error) {
          console.error("Error calling API:", error);
        }
      });
      console.log("Cron job scheduled to run every 60 seconds.");
  };

  module.exports = startCronJobs;