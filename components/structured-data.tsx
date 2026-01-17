export function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nhan Nguyen',
    alternateName: 'Nguyen Xuan Nhan',
    jobTitle: 'Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'KMS Technology, Inc.',
    },
    url: 'https://foxminchan.github.io',
    image: {
      '@type': 'ImageObject',
      url: 'https://foxminchan.github.io/logo.png',
      width: '512',
      height: '512',
    },
    sameAs: ['https://github.com/foxminchan', 'https://www.linkedin.com/in/nxnhan/'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
    email: 'nguyenxuannhan407@gmail.com',
    knowsAbout: [
      '.NET Core',
      'C#',
      'Microservices',
      'Azure',
      'React',
      'TypeScript',
      'Clean Architecture',
      'Healthcare IT',
      'HIPAA Compliance',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'HUTECH University',
    },
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Nhan Nguyen - Software Engineering Services',
    description:
      'Professional software engineering services specializing in .NET, microservices architecture, and healthcare IT solutions.',
    provider: {
      '@type': 'Person',
      name: 'Nhan Nguyen',
    },
    areaServed: 'Worldwide',
    serviceType: [
      'Software Development',
      'Microservices Architecture',
      'Healthcare IT Solutions',
      'Cloud Computing',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  );
}
