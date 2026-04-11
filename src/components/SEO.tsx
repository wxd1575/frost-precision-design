import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
}

const SEO = ({ 
  title = "Frost & Ice Aircon", 
  description = "Reliable cooling, refrigeration, and electrical solutions for homes and businesses across South Africa.",
  type = "website"
}: SEOProps) => {
  const location = useLocation();
  const fullTitle = title === "Frost & Ice Aircon" ? title : `${title} | Frost & Ice Aircon`;
  const canonicalUrl = `https://frosticeaircon.co.za${location.pathname === '/' ? '' : location.pathname}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "Frost & Ice Aircon",
    "image": "https://frosticeaircon.co.za/favicon.png",
    "url": "https://frosticeaircon.co.za",
    "telephone": "+27845893702",
    "email": "info@frosticeaircon.com",
    "address": {
      "@type": "PostalAddress",
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
    "description": description
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content="/favicon.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/favicon.png" />
      <link rel="canonical" href={canonicalUrl} />
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
