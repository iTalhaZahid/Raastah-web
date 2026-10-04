import { ArrowUpRight, Plus } from "lucide-react";

const faqs = [
  [
    "What is Raastah?",
    "Raastah is a student-focused ride-sharing app that helps students find and share rides with other students going their way.",
  ],
  [
    "Who can use Raastah?",
    "Raastah is designed for students and members of the university community who meet the platform’s verification requirements.",
  ],
  [
    "Do I need to be a driver to use Raastah?",
    "No. You can use Raastah as a rider, driver, or both.",
  ],
  [
    "Can I schedule a ride in advance?",
    "Yes. Raastah allows you to schedule rides so you can plan your upcoming journeys ahead of time.",
  ],
  [
    "How does Raastah match riders and drivers?",
    "Raastah looks at compatible destinations and journey information to help connect riders with drivers going their way.",
  ],
  [
    "Can I offer rides as a student?",
    "Yes. If you’re driving somewhere and have available seats, you can offer your ride to other students.",
  ],
  [
    "Is Raastah a taxi service?",
    "No. Raastah is designed around student ride sharing and cost sharing rather than traditional taxi or ride-hailing services.",
  ],
  [
    "How do I get Raastah?",
    "Download Raastah from the Google Play Store, create your account, complete verification, and start finding or offering rides.",
  ],
];

export default function FAQ() {
  return (
      <section id="faqs" className="faq-section section-space site-width">
        <div>
          <h2>
            Good Questions
            <br />
            Straight Answers
          </h2>
          <p>Frequently asked questions</p>
          <p>
            Something else on your mind?
            <br />
            <a href="mailto:info@raastah.app">
              Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q} name="faq">
              <summary>
                {q}
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
  );
}
