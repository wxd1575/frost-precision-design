import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from '@/data/reviews';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
}

const SEO = ({ 
  title = "Frosty Ice Aircon and Refrigeration", 
  description = "Reliable cooling, refrigeration, and electrical solutions for homes and businesses across South Africa.",
  type = "website"
}: SEOProps) => {
  const location = useLocation();
  const fullTitle = title === "Frosty Ice Aircon and Refrigeration" ? title : `${title} | Frosty Ice Aircon and Refrigeration`;
  const canonicalUrl = `https://frosticeaircon.co.za${location.pathname === '/' ? '' : location.pathname}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "Frosty Ice Aircon and Refrigeration",
    "image": "https://frosticeaircon.co.za/favicon.png",
    "url": "https://frosticeaircon.co.za",
    "telephone": "+27845893702",
    "email": "info@frosticeaircon.co.za",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "22 Selkirk St",
      "addressLocality": "Germiston",
      "addressRegion": "Gauteng",
      "postalCode": "1401",
      "addressCountry": "ZA"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:00",
        "closes": "14:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": GOOGLE_RATING,
      "reviewCount": GOOGLE_REVIEW_COUNT,
      "bestRating": 5
    },
    "description": description
  };

  return (
    // defer={false} writes the head during the commit instead of in a
    // requestAnimationFrame callback. rAF never runs in a tab that is not
    // painting (a Google Ads click opened in a background tab, a prerender),
    // which left the head on the index.html defaults and made RouteTracker
    // send GA4 the site-wide page_title.
    <Helmet defer={false}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content="https://frosticeaircon.co.za/favicon.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://frosticeaircon.co.za/favicon.png" />
      <link rel="canonical" href={canonicalUrl} />
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
