import { Check } from "lucide-react";
import { MiniVisual } from "@/components/Home/RidePreview";

const features = [
  {
    label: "Verified students",
    title: "Know You’re Riding With Students",
    body: "Raastah is designed around a verified student community, helping create a more trusted environment for campus rides.",
    benefit: "A familiar community to share the journey with.",
    kind: "verified",
  },
  {
    label: "Find rides",
    title: "Find Someone Going Your Way",
    body: "Enter where you’re going and discover available rides that match your destination.",
    benefit:
      "Spend less time searching and more time getting where you need to go.",
    kind: "find",
  },
  {
    label: "Offer a ride",
    title: "Turn Your Empty Seat Into a Shared Ride",
    body: "Already driving to campus? Offer your available seats to students going your way.",
    benefit: "Share the journey instead of making the trip alone.",
    kind: "offer",
  },
  {
    label: "Schedule your rides",
    title: "Plan Your Ride Before You Need It",
    body: "Know you’ll need a ride tomorrow morning? Schedule it ahead of time and plan your commute around your day.",
    benefit: "Less last-minute searching.",
    kind: "schedule",
  },
  {
    label: "Smart ride matching",
    title: "Matched Around Where You’re Going",
    body: "Destination-based matching helps connect riders with drivers heading toward compatible destinations.",
    benefit: "Find relevant rides without sorting through unrelated options.",
    kind: "match",
  },
  {
    label: "Ride preferences",
    title: "Ride Your Way",
    body: "Set your ride preferences and discover rides that better fit what you’re looking for.",
    benefit: "More comfortable and relevant ride options.",
    kind: "preferences",
  },
  {
    label: "Ride requests & negotiation",
    title: "You’re in Control of the Ride",
    body: "Request a ride, review the details, and communicate with the other student before the ride is finalized.",
    benefit: "Both sides can agree on the journey before committing.",
    kind: "request",
  },
];

export default function Solution() {
  return (
      <section
        id="features"
        className="features-section section-space site-width"
      >
        <div className="section-heading">
          <h2>
            One App - A Better Way
            <br />
            to Get Around Campus
          </h2>
          <p>
            Raastah connects students who need a ride with students already
            heading their way, making everyday travel simpler, more affordable,
            and easier to plan.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((item) => (
            <article
              className={`feature-card feature-${item.kind}`}
              key={item.kind}
            >
              <div className="feature-copy">
                <p className="feature-label">{item.label}</p>
                <h3>{item.title}</h3>

                <p className="feature-benefit">
                  <Check size={17} aria-hidden="true" />
                  {item.benefit}
                </p>
              </div>
              <MiniVisual kind={item.kind} />
            </article>
          ))}
        </div>
      </section>
  );
}
