import { ArrowDown, Clock3, Wallet, Users, MessageCircle } from "lucide-react";

const problems = [
  {
    icon: Clock3,
    title: "Too Much Time Finding a Ride",
    body: "You’re constantly asking friends, posting in WhatsApp groups, or waiting to see if someone is going your way.",
  },
  {
    icon: Wallet,
    title: "Daily Travel Gets Expensive",
    body: "Travelling alone means you’re often paying the full cost of the journey.",
  },
  {
    icon: Users,
    title: "Empty Seats Go to Waste",
    body: "Students are already travelling to the same places with empty seats, but there’s no easy way to connect them.",
  },
  {
    icon: MessageCircle,
    title: "Group Chats Aren’t Built for Ride Matching",
    body: "Messages get buried. Plans change. You don’t know who is actually going your way.",
  },
];

export default function Problem() {
  return (
      <section className="problem-section section-space">
        <div className="site-width">
          <div className="problem-heading">
            <h2>Getting to Campus Shouldn’t Be This Complicated</h2>
            <p>
              The same journey. The same hassle.
              <br />
              Every single day.
            </p>
          </div>
          <div className="problem-grid">
            {problems.map(({ icon: Icon, ...item }) => (
              <article key={item.title}>
                <div className="problem-card-heading">
                  <Icon size={25} aria-hidden="true" />
                  <h3>{item.title}</h3>
                </div>
                <p>{item.body}</p>

              </article>
            ))}
          </div>
          <div className="problem-close">
            <span>There should be an easier way</span>
            <ArrowDown size={30} aria-hidden="true" />
          </div>
        </div>
      </section>
  );
}
