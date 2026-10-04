import Image from "next/image";
import {
  CalendarDays,
  Check,
  GraduationCap,
  MapPin,
  SlidersHorizontal,
  Users,
  ArrowUpRight,
} from "lucide-react";

export function RouteMap() {
  return (
    <div className="route-map" aria-hidden="true">
      <svg viewBox="0 0 400 300" fill="none">
        <path
          d="M-20 60H420M-20 140H420M-20 240H420M70-20V320M180-20V320M310-20V320"
          stroke="#fff"
          strokeWidth="18"
        />
        <path
          d="m-30 300 170-180L380-20M-20 0l440 320"
          stroke="#fff"
          strokeWidth="11"
        />
        <path
          d="M70 240h110V140h130V60"
          stroke="#000"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeDasharray="8 5"
        />
        <circle
          cx="70"
          cy="240"
          r="9"
          fill="#000"
          stroke="#fff"
          strokeWidth="4"
        />
        <circle
          cx="310"
          cy="60"
          r="10"
          fill="#000"
          stroke="#fff"
          strokeWidth="4"
        />
      </svg>
      <span className="map-campus">
        <GraduationCap size={15} /> Campus
      </span>
      <span className="map-you">You</span>
    </div>
  );
}
export function MiniVisual({ kind }: { kind: string }) {
  return (
    <div className={`mini-visual mini-${kind}`} aria-hidden="true">
      {kind === "verified" ? (
        <>
          <span className="avatar large">AS</span>
          <strong>Ayesha S.</strong>
          <span>University community</span>
          <span className="verified-tag">
            <Check size={14} /> Student verified
          </span>
        </>
      ) : kind === "schedule" ? (
        <>
          <div className="mini-title">
            <CalendarDays size={19} />
            <strong>Your week, planned.</strong>
          </div>
          <div className="week">
            {["M", "T", "W", "T", "F"].map((day, i) => (
              <span className={i === 2 ? "selected" : ""} key={i}>
                {day}
                <b>{12 + i}</b>
              </span>
            ))}
          </div>
          <div className="mini-row">
            <span>Home to campus</span>
            <strong>8:30 AM</strong>
          </div>
        </>
      ) : kind === "preferences" ? (
        <>
          <div className="mini-title">
            <SlidersHorizontal size={19} />
            <strong>A ride that fits</strong>
          </div>
          {["Destination", "Departure time", "Available seats"].map((label) => (
            <div className="mini-row" key={label}>
              <span>{label}</span>
              <Check size={16} />
            </div>
          ))}
        </>
      ) : kind === "offer" ? (
        <>
          <div className="mini-title">
            <Users size={20} />
            <strong>Room for company.</strong>
          </div>
          <div className="seat-row">
            {[0, 1, 2].map((i) => (
              <span key={i}>
                <Users size={24} />
              </span>
            ))}
          </div>
          <div className="mini-row">
            <span>Heading to campus</span>
            <strong>2 seats free</strong>
          </div>
        </>
      ) : kind === "request" ? (
        <>
          <div className="mini-title">
            <span className="avatar">HA</span>
            <strong>Let’s share the ride.</strong>
          </div>
          <p className="message-bubble">Can we meet at the main gate?</p>
          <p className="message-bubble reply">That works. See you there!</p>
          <span className="verified-tag">
            <Check size={14} /> Journey agreed
          </span>
        </>
      ) : (
        <>
          <RouteMap />
          <div className="mini-row">
            <span>
              <MapPin size={14} />{" "}
              {kind === "match"
                ? "Same direction. Shared journey."
                : "A ride going your way"}
            </span>
            <ArrowUpRight size={18} />
          </div>
        </>
      )}
    </div>
  );
}
export default function RidePreview({
  screenshot = "/android/05-home.png",
  routePreview = false,
}: {
  screenshot?: string;
  routePreview?: boolean;
}) {
  return (
    <div
      className="ride-scene"
      role="img"
      aria-label={routePreview
        ? "Raastah route preview map with a Find a Companion button."
        : "Raastah home screen with a map, destination search, and saved places."}
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="scene-note note-trust">
        <span className="note-icon">
          <GraduationCap size={23} />
        </span>
        <div>
          <strong>{routePreview ? "Going your way" : "Your campus community"}</strong>
          <span>{routePreview ? "Find a companion for your route." : "Plan a ride from the map."}</span>
        </div>
      </div>
      <div className="phone">
        <Image
          className="phone-screenshot"
          src={screenshot}
          alt=""
          width={922}
          height={2048}
          priority
        />
      </div>
      <div className="scene-note note-schedule">
        <span className="note-icon">
          {routePreview ? <MapPin size={22} /> : <CalendarDays size={22} />}
        </span>
        <div>
          <strong>{routePreview ? "Route preview" : "Plan your next ride"}</strong>
          <span>Campus ride · 8:30 AM</span>
        </div>
        <Check size={18} />
      </div>
    </div>
  );
}
