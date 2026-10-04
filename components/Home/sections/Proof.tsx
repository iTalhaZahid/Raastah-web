import { MiniVisual } from "@/components/Home/RidePreview";

const proof = [
  {
    title: "Verified Student Community",
    body: "Ride with people who are part of the university community.",
    kind: "verified",
  },
  {
    title: "Your Daily Ride, Simplified",
    body: "Find a ride without endlessly asking friends or searching through group chats.",
    kind: "find",
  },
  {
    title: "Ride When It Works for You",
    body: "Find rides for now or plan ahead with scheduled rides.",
    kind: "schedule",
  },
];

export default function Proof() {
  return (
      <section className="proof-section section-space">
        <div className="site-width">
          <div className="section-heading">
            <h2>
              Built for Students,
              <br />
              by the Student Community
            </h2>
            <p>
              People you have something in common with.
              <br />A journey you can share.
            </p>
          </div>
          <div className="proof-grid">
            {proof.map((item) => (
              <article className="proof-card" key={item.kind}>
                <MiniVisual kind={item.kind} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
  );
}
