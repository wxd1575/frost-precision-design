import { Helmet } from 'react-helmet-async';

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
  const fullTitle = title === "Frost & Ice Aircon" ? title : `${title} | Frost & Ice Aircon`;

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
    </Helmet>
  );
};

export default SEO;
