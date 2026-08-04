import { firestorePosts } from "@/lib/repositories/firestore-adapters";

export const TARGET_TEST_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || process.env.RECIPIENT_EMAIL;

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_ACCESS_TOKEN;

/**
 * Records contact inquiry in Cloud Firestore and dispatches email via EmailJS REST API.
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const timestamp = new Date().toISOString();
  let mailDelivered = false;
  let deliveryError = null;

  // 1. Dispatch email via server-side EmailJS API
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const templateParams = {
        to_email: TARGET_TEST_EMAIL,
        title: subject || `Inquiry from ${name}`,
        name: name,
        from_name: name,
        email: email,
        from_email: email,
        reply_to: email,
        user_email: email,
        message: `${message}\n\n---\nFrom: ${email}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const emailJsPayload = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      };

      if (EMAILJS_PRIVATE_KEY) {
        emailJsPayload.accessToken = EMAILJS_PRIVATE_KEY;
      }

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailJsPayload),
      });

      if (response.ok) {
        mailDelivered = true;
      } else {
        const errorText = await response.text().catch(() => "Unknown error");
        deliveryError = `EmailJS API status ${response.status}: ${errorText}`;
        console.warn(deliveryError);
      }
    } catch (err) {
      deliveryError = err.message;
      console.warn("EmailJS server dispatch error:", err.message);
    }
  } else {
    deliveryError = "EmailJS credentials not fully configured in environment.";
    console.warn(deliveryError);
  }

  const emailPayload = {
    to: TARGET_TEST_EMAIL,
    fromName: name,
    fromEmail: email,
    subject: subject || `New Enquiry from ${name} via Anugraha Website`,
    body: message,
    timestamp,
  };

  // 2. Record Inquiry in Cloud Firestore `contactInquiries`
  let savedId = null;
  try {
    const firestoreRecord = await firestorePosts.create.call(
      { collectionName: "contactInquiries" },
      {
        ...emailPayload,
        status: mailDelivered ? "delivered" : "received",
        deliveryTarget: TARGET_TEST_EMAIL,
        deliveryError,
      }
    ).catch(() => null);
    savedId = firestoreRecord?.id || null;
  } catch (err) {
    console.warn("Firestore contact record warning:", err.message);
  }

  return {
    success: true,
    mailDelivered,
    deliveryError,
    provider: "Cloud Firestore & EmailJS Dispatch",
    targetEmail: TARGET_TEST_EMAIL,
    firestoreRecordId: savedId,
    timestamp,
  };
}
