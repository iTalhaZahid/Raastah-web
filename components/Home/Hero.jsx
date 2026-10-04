import { Check } from "lucide-react";
import RidePreview from "./RidePreview";
import PlayStoreLink from "./PlayStoreLink";
export default function Hero() {
  return (
    <section id="home" className="home-hero site-width">
      <div className="hero-copy">
        <h1>
          Your Campus
          <br />
          Your People
          <br />
          Your Raastah
        </h1>

        <p className="hero-body">
          Stop dealing with expensive daily commutes, empty seats, and the
          hassle of finding someone to ride with. Raastah helps students
          discover, request, and schedule rides with people from their
          university community.
        </p>
        <div className="hero-actions">
          <PlayStoreLink compact />
          <a className="text-link" href="#how-it-works">
            See How It Works
          </a>
        </div>
        <p className="hero-assurance">
          <Check size={15} aria-hidden="true" /> Your university community. Less
          commute hassle.
        </p>
      </div>
      <RidePreview screenshot="/android/05-home.png" />
    </section>
  );
}
