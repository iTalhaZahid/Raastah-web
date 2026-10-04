import Image from "next/image";

const features = [
  {
    label: "Start with the map",
    title: "See your area and start a ride search",
    body: "The home screen opens on a live map, with a destination search and saved places close at hand. Start planning a trip from wherever you are.",
    image: "/android/05-home.png",
    alt: "Raastah home screen with a map, destination search, and saved places",
  },
  {
    label: "Schedule a ride",
    title: "Choose when you want to leave",
    body: "Pick a quick pickup in 15 minutes, leave later today, or choose a time for tomorrow. Raastah puts the departure options right alongside your route.",
    image: "/android/20-schedule-departure.png",
    alt: "Raastah schedule screen with options to leave in 15 minutes, later today, or tomorrow",
  },
  {
    label: "Saved places",
    title: "Keep favourite destinations ready",
    body: "Your saved list keeps familiar stops together with their addresses. Revisit places you use often and remove them when you no longer need them.",
    image: "/android/09-saved-places.png",
    alt: "Raastah saved places screen listing stored destinations and addresses",
  },
  {
    label: "Choose your ride",
    title: "Compare offers and make your choice",
    body: "Browse car and bike offers, review each fare and destination, then accept or send a counteroffer. The ride details stay visible while you decide.",
    image: "/android/Screenshot_1790593166.png",
    alt: "Raastah ride offers showing fares, destinations, and accept or counteroffer actions",
  },
  {
    label: "Scheduled rides",
    title: "Find your planned trips in one place",
    body: "The My Scheduled Rides tab is where your planned journeys appear. When you have no rides scheduled yet, the screen points you back to Find Ride to get started.",
    image: "/android/Screenshot_1790592868.png",
    alt: "Raastah scheduled rides screen with Find Ride and My Scheduled Rides tabs",
  },
  {
    label: "Ride chat",
    title: "Coordinate directly with your ride companion",
    body: "Use the ride conversation to share pickup updates and confirm where to meet. Keep trip coordination alongside your messages with the other rider.",
    image: "/android/Screenshot_1790592880.png",
    alt: "Raastah ride chat with pickup updates and a message field",
  },
];

export default function FeaturesPage() {
  return (
    <main id="main-content" className="landing dedicated-features">
      <section className="features-page-intro site-width">
        <p className="features-page-eyebrow">Made for campus journeys</p>
        <h1>A better way to get anywhere, together </h1>
        <p>
          Find rides, plan ahead, and share the journey with people in your
          university community.
        </p>
      </section>

      <div className="feature-stories site-width">
        {features.map((feature, index) => (
          <section
            className={`feature-story${index % 2 === 1 ? " feature-story-reverse" : ""}`}
            key={feature.label}
          >
            <div className="feature-story-image">
              <Image
                src={feature.image}
                alt={feature.alt}
                width={922}
                height={2048}
                sizes="(max-width: 760px) 78vw, (max-width: 1000px) 38vw, 320px"
              />
            </div>
            <div className="feature-story-copy">
              <p className="feature-story-label">0{index + 1} / {feature.label}</p>
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
