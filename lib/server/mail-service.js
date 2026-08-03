import { firestorePosts } from "@/lib/repositories/firestore-adapters";

export const TARGET_TEST_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || process.env.RECIPIENT_EMAIL;

/**
 * Records contact inquiry in Cloud Firestore `contactInquiries` collection.
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const timestamp = new Date().toISOString();
  const emailPayload = {
    to: TARGET_TEST_EMAIL,
    fromName: name,
    fromEmail: email,
    subject: subject || `New Enquiry from ${name} via Anugraha Website`,
    body: message,
    timestamp,
  };

  // Record Inquiry in Cloud Firestore `contactInquiries`
  let savedId = null;
  try {
    const firestoreRecord = await firestorePosts.create.call(
      { collectionName: "contactInquiries" },
      {
        ...emailPayload,
        status: "received",
        deliveryTarget: TARGET_TEST_EMAIL,
      }
    ).catch(() => null);
    savedId = firestoreRecord?.id || null;
  } catch (err) {
    console.warn("Firestore contact record warning:", err.message);
  }

  return {
    success: true,
    mailDelivered: false,
    provider: "Cloud Firestore Inquiry Record",
    targetEmail: TARGET_TEST_EMAIL,
    firestoreRecordId: savedId,
    timestamp,
  };
}
