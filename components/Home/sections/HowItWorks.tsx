import { ArrowUpRight, Check, MessageCircle, Users } from "lucide-react";

const steps = [
  {
    verb: "Find",
    title: "Tell Raastah Where You’re Going",
    body: "Enter your destination and discover rides heading your way.",
    visual: "University main gate",
    icon: ArrowUpRight,
  },
  {
    verb: "Choose",
    title: "Find a Ride That Fits",
    body: "Review available rides and choose the one that works for you.",
    visual: "Verified student · 2 seats",
    icon: Users,
  },
  {
    verb: "Request",
    title: "Send Your Ride Request",
    body: "Request the ride and coordinate the journey with the driver.",
    visual: "Ride request sent",
    icon: MessageCircle,
  },
  {
    verb: "Ride",
    title: "Meet. Ride. Get There.",
    body: "Connect with your fellow student and share the journey.",
    visual: "Next stop: campus",
    icon: Check,
  },
];

export default function HowItWorks() {
  return (
      <section id="how-it-works" className="how-section section-space">
        <div className="site-width">
          <div className="section-heading">
            <h2>
              Your Next Ride Is Just
              <br />a Few Steps Away
            </h2>
            <p>
              Find. Schedule. Share. Ride.
              <br />
              Keep your commute simple.
            </p>
          </div>
          <ol className="steps-grid">
            {steps.map((item, i) => (
              <li key={item.verb}>
                <div className="step-top">
                  <span>0{i + 1}</span>
                  <strong>{item.verb}</strong>
                </div>
                <div className="step-visual">
                  <item.icon size={22} aria-hidden="true" />
                  <span>{item.visual}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
  );
}
