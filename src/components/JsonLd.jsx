export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://ankurdev.vercel.app/#person",
        "name": "Ankur Singh",
        "url": "https://ankurdev.vercel.app",
        "image": "https://ankurdev.vercel.app/images/Ankur_Sem1_1.jpg",
        "sameAs": [
          "https://github.com/Ankurrr27",
          "https://linkedin.com/in/ankur-personal",
          "https://instagram.com/ankurrr27",
          "https://leetcode.com/u/a_nkurrr/"
        ],
        "jobTitle": ["Web Developer", "Frontend Developer", "UI/UX Designer"],
        "worksFor": {
          "@type": "Organization",
          "name": "IIITians Network"
        },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Indian Institute of Information Technology, Kota",
          "alternateName": "IIIT Kota"
        },
        "description": "B.Tech CSE student at IIIT Kota and full-stack web developer."
      },
    {
      "@type": "WebSite",
      "@id": "https://ankurdev.vercel.app/#website",
      "url": "https://ankurdev.vercel.app",
      "name": "Ankur dev",
      "publisher": {
        "@id": "https://ankurdev.vercel.app/#person"
      }
    }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
