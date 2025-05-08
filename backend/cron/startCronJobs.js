const cron = require("node-cron");
const checkAppointmentsForConfirmation = require("./checkAppointments");

const startCronJobs = () => {
  cron.schedule("*/30 * * * *", () => {
    console.log("🔁 Checking appointments for confirmation...");
    checkAppointmentsForConfirmation();
  });
};

module.exports = startCronJobs;
