import React from "react";
import { Metadata } from "next";
import { DOMAIN_URL } from "@/constant/apiUrl";

export const metadata: Metadata = {
  title: "Cookie Policy | Bolton Today – How We Use Cookies",
  description:
    "Read Bolton Today's Cookie Policy to learn how we use cookies to enhance your experience, deliver relevant content, and support our journalism. Find out how to manage your cookie preferences.",
  alternates: {
    canonical: `${DOMAIN_URL}/cookie-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};
const CookiesPolicy = () => {
  return (
    <>
      {/* StartFragment */}
      <div>
        <h1>What Are Cookies?</h1>
        <p>
          Cookies are small data files stored on your device when you visit a
          website. They help websites function properly and efficiently by
          remembering your preferences, measuring site usage, and delivering
          relevant content.
        </p>
        <p>
          Some cookies are essential for the website to work. Others help us
          improve how you experience our journalism, including how stories load,
          how ads are served, and which content is most read.
        </p>
        <h2>How We Use Cookies</h2>
        <p>
          We use cookies on
          <a href="https://boltontoday.co.uk">boltontoday.co.uk</a>
          for the following purposes:
        </p>
        <ul>
          <li>
            Essential Functionality: To ensure the website operates correctly —
            including navigation, article access, and site security.
          </li>
          <li>
            Analytics &amp; Performance: To collect anonymous data on how
            visitors use our site, which helps us improve story relevance and
            site performance. (e.g. Google Analytics)
          </li>
          <li>
            Personalisation: To remember your preferences, such as article views
            or device type.
          </li>
          <li>
            Advertising: To serve ads that support our journalism. Some cookies
            help limit repetition and deliver more relevant promotions via
            trusted advertising platforms.
          </li>
        </ul>
        <h2>Third-Party Cookies</h2>
        <p>
          Some features — such as embedded videos, social media share buttons,
          or external links — may set third-party cookies. These are controlled
          by the providers of those services (e.g. YouTube, Twitter, Facebook)
          and are subject to their own cookie policies.
        </p>
        <h2>Managing Your Cookie Preferences</h2>
        <p>
          When you first visit our website, you’ll see a cookie consent banner
          that allows you to:
        </p>
        <ul>
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Adjust your cookie settings at any time</li>
        </ul>
        <p>
          You can also manage or delete cookies directly in your browser
          settings. Please note that blocking certain types of cookies may
          affect how our site functions.
        </p>
        <p>For help managing cookies in your browser:</p>
        <ul>
          <li>Google Chrome: Support</li>
          <li>Mozilla Firefox: Support</li>
          <li>Safari: Support</li>
          <li>Microsoft Edge: Support</li>
        </ul>
        <h2>Your Privacy Matters</h2>
        <p>
          We are committed to protecting your data and respecting your privacy.
          For more information on how we collect, store, and use your
          information, please read our full Privacy Policy.
        </p>
      </div>
      {/* EndFragment */}
    </>
  );
};

export default CookiesPolicy;
