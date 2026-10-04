import LegalPage from "@/components/legal-page";

const deletionEmail = "mailto:support@raastah.app?subject=Raastah%20Account%20Deletion%20Request";

export default function DeleteAccountContent() {
  return (
    <LegalPage
      title="Delete Account"
      description="Manage your account and personal data."
      showContents={false}
    >
        <p className="deletion-intro">
          This page is the public account-deletion resource for <strong>Raastah</strong>, including the Raastah mobile application available on Google Play. You can request deletion of your app account and associated personal data <strong>without reinstalling or opening the app</strong>.
        </p>

        <section aria-labelledby="web-request" className="deletion-request">
          <p className="deletion-eyebrow">Request deletion on the web</p>
          <h2 id="web-request">Email our support team</h2>
          <p>
            Tap the button below to open an email to <strong>support@raastah.app</strong> with the subject <em>Raastah Account Deletion Request</em>. Include the email address on your account so we can verify you are the account holder.
          </p>
          <a href={deletionEmail} className="deletion-button">
            Request account deletion
          </a>
          <p className="deletion-email-note">
            Or email <a href={deletionEmail}>support@raastah.app</a> with subject &quot;Raastah Account Deletion Request&quot;.
          </p>
        </section>

        <div className="deletion-details">
          <section aria-labelledby="what-happens-next">
            <h2 id="what-happens-next">What Happens Next</h2>
            <ul>
              <li>We verify that the request comes from the account holder (for example, by confirming control of the registered email).</li>
              <li>We process verified requests within <strong>14 business days</strong> (sooner when possible). You will receive email confirmation when deletion is complete.</li>
              <li>When we delete your Raastah account, we delete associated personal data except where we must retain information for legitimate reasons such as security, fraud prevention, dispute resolution, accounting, or legal compliance.</li>
            </ul>
          </section>
          <section aria-labelledby="delete-in-app">
            <h2 id="delete-in-app">Optional: Delete in the app</h2>
            <p>If you still have the Raastah app installed, you can also delete from <strong>Profile → Settings → Delete Account</strong>. The web request path above is available if you have uninstalled the app or cannot access it.</p>
          </section>
          <section aria-labelledby="retained-records">
            <h2 id="retained-records">What we may retain</h2>
            <p>Certain records may be retained for a limited period where required or permitted by law — for example, security and fraud logs needed for security purposes or information needed to resolve disputes. Material retention practices are described in our <a href="/privacy-policy">Privacy Policy</a>.</p>
          </section>
        </div>
    </LegalPage>
  );
}
