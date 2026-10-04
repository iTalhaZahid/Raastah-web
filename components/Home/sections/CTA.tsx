import RidePreview from "@/components/Home/RidePreview";
import PlayStoreLink from "@/components/Home/PlayStoreLink";

export default function CTA() {
  return (
      <section id="download" className="download-section">
        <div className="site-width download-inner">
          <div>
            <h2>Make Your Daily Campus Commute Easier</h2>
            <p>
              Find your people. Share your ride.
              <br />
              Save time. Plan ahead.
            </p>
            <PlayStoreLink />
            <p className="download-last">
              Your next ride could already be going your way.
            </p>
          </div>
          <RidePreview screenshot="/android/20-schedule-departure.png" routePreview />
        </div>
      </section>
  );
}
