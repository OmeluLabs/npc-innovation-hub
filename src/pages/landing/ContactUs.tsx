// src/pages/landing/ContactUs.tsx
//
// The standalone /contact-us page. Used to wrap ContactSection in its own
// navy "Contact Us" hero banner with an intro paragraph - but that intro
// just repeated, in different words, the "Get in Touch" card's own intro
// right below it ("Have a question, or want to reach NPC Innovation Hub
// directly? Here is how to find us." vs. the card's own "Have a question
// about NPC Innovation Hub, a project, or joining us? Reach out directly,
// or send a message..."). Dropped the banner - the card already opens with
// its own heading and explanation - so a direct link or bookmark to this
// page shows exactly the same content as scrolling to Home's #contact
// section, with nothing redundant either place.
import ContactSection from "./ContactSection";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-surface-muted py-16">
      <ContactSection />
    </div>
  );
};

export default ContactUs;
