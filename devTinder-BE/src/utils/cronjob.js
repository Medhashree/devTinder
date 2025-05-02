const cron = require("node-cron");
const ConnectionRequest = require("../model/connectionRequest.js");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Change based on your service provider
  auth: {
    user: process.env.CONNECTION_REQUEST_EMAILID,
    pass: process.env.CONNECTION_REQUEST_PASSWORD,
  },
});

//crontab.guru
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    //query should be paginated(limit) if more users as this query is expensive
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const emailsSent = new Set();

    //if more users
    //send in bulk via Amazon SES OR
    //create your queue and send them in batches(bee-queue OR bull) this will put the mails in queue and run one by one, will not block the code
    for (const req of pendingRequests) {
      const toUser = req.toUserId;
      const fromUser = req.fromUserId;

      if (!toUser?.emailId || emailsSent.has(toUser.emailId)) continue;

      const mailOptions = {
        from: process.env.CONNECTION_REQUEST_EMAILID,
        to: toUser.emailId,
        subject: "💌 You Have New Connection Requests on DevTinder!",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f0f8ff; border-radius: 12px;">
          <h2 style="color: #0077cc;">Hi ${toUser.firstName}, 👋</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Awesome news! <strong>You received new connection request(s)</strong> on <strong>DevTinder</strong> yesterday based on your tech stack and interests. 🧠💻
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Developers who share your vision and skillset are looking to connect and potentially build something amazing together. Don’t miss the opportunity to team up!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://16.171.234.159/" target="_blank" style="background-color: #0077cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
              🔍 View Your Dev Matches
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Wishing you powerful collaborations ahead,<br><strong>– The DevTinder Team 💡</strong></p>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);
      emailsSent.add(toUser.emailId);
    }
  } catch (error) {
    console.error("Error in scheduled connection email job:", error);
  }
});
