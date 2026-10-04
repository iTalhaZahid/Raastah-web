export default function PlayStoreLink({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <a
      className="play-link"
      href="https://play.google.com/store/apps/details?id=app.raastah"
      aria-label="Download Raastah on Google Play"
    >
      <svg
        width="25"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 3.5v17c0 .59.34 1.11.84 1.35L13.69 12 3.84 2.15C3.34 2.39 3 2.91 3 3.5m3.05-.84 10.76 6.22-2.27 2.27zm14.11 8.15c.79.62.79 1.76 0 2.38l-2.27 1.31-2.5-2.5 2.5-2.5zM6.05 21.34l8.49-8.49 2.27 2.27z" />
      </svg>
      <span>
        {compact ? (
          "Download Raastah"
        ) : (
          <>
            <small>Download Raastah on</small>
            <strong>Google Play</strong>
          </>
        )}
      </span>
    </a>
  );
}
