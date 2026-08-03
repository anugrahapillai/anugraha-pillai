import ContactForm from "@/components/public/ContactForm";

export const metadata = {
  title: "Contact — Anugraha Pillai",
  description: "Get in touch for advisory services, research collaborations, or speaking engagements.",
};

export default function ContactPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1>Get in Touch</h1>
        <p>Send a message regarding research collaborations, advisory engagements, or writing inquiries.</p>
      </header>

      <section className="contact-layout">
        <ContactForm />
      </section>
    </div>
  );
}
