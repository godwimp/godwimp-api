import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const projects = [
    {
      slug: 'haas-microservices',
      title: 'Honeypot-as-a-Service (Security Microservice)',
      description:
        'A deception-based security microservice that detects and logs reconnaissance attempts by intercepting requests to non-existent endpoints, capturing attacker fingerprints and behavior patterns.',
      highlights: [
        'Architected and developed a deception-based security microservice that detects and logs reconnaissance attempts by intercepting requests to non-existent endpoints, capturing attacker fingerprints and behavior patterns.',
        'Implemented a global middleware-based trap system with Redis caching for low-latency path matching, integrated IP geolocation enrichment, VPN detection, and dynamic risk scoring to classify threat levels in real-time.',
        'Built asynchronous background processing using BullMQ for scalable logging and alerting, with configurable fake response generation to mimic legitimate server errors and delay attacker enumeration attempts.',
      ],
      tech_stack: ['TypeScript', 'NestJS', 'PostgreSQL', 'Redis', 'BullMQ', 'Prisma'],
      category: 'security',
      is_featured: true,
      github_url: 'https://github.com/godwimp/haas-microservices',
      live_url: null,
      npm_url: null,
      order_index: 1,
    },
    {
      slug: 'reusable-backend-core-package',
      title: 'Reusable Backend Core Package (NPM)',
      description:
        'A reusable backend core package published to NPM to standardize authentication, authorization (JWT-based RBAC), guards, decorators, and common utilities across multiple services.',
      highlights: [
        'Developed and maintained a reusable backend core package published to NPM to standardize authentication, authorization (JWT-based RBAC), guards, decorators, and common utilities across multiple services.',
        'Implemented permission-based access control using custom decorators and guards, integrated with PostgreSQL and Prisma for dynamic permission resolution at runtime.',
        'Managed package versioning, bug fixes, and backward-compatible updates following semantic versioning, with Git-based release and patch workflows.',
      ],
      tech_stack: ['TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'JWT'],
      category: 'package',
      is_featured: true,
      github_url: null,
      live_url: null,
      npm_url: 'https://www.npmjs.com/package/@urbansolv/create-nestjs-app',
      order_index: 2,
    },
    {
      slug: 'cabutkost-web',
      title: 'CabutKost (Website)',
      description:
        'A group project for a kost (boarding house) rental website, contributing to authentication logic, backend routing architecture, and security testing.',
      highlights: [
        'Work as a group member for the CabutKost website project.',
        'Implemented authentication logic and backend routing architecture supporting core transactional workflows.',
        'Also worked as part of the pentester team for the website, writing test cases for both backend and frontend modules.',
      ],
      tech_stack: ['Laravel', 'MySQL', 'HTML', 'React.js', 'Inertia'],
      category: 'web',
      is_featured: false,
      github_url: 'https://github.com/godwimp/cabutkost-web',
      live_url: null,
      npm_url: null,
      order_index: 3,
    },
    {
      slug: 'catcation',
      title: 'CatCation (Website & Mobile)',
      description:
        'A group project for Website Programming and Mobile Programming courses, involving database design, Firebase integration, and backend development for a cat boarding service app.',
      highlights: [
        'Work as a group member for the Website Programming and Mobile Programming course.',
        'Designing the business model and database, simplifying the database prototype created by other group members, developing database from scratch and translating the structures into Firebase oriented so that can be used on the mobile app of CatCation.',
        'Implementing logic for user login page and bypass prevention as a backend developer.',
      ],
      tech_stack: ['Laravel', 'MySQL', 'HTML', 'JavaScript', 'Flutter', 'Firebase'],
      category: 'web',
      is_featured: false,
      github_url: 'https://github.com/godwimp/catcation-mobile',
      live_url: null,
      npm_url: null,
      order_index: 4,
    },
    {
      slug: 'angkot-bandung-mapping',
      title: 'Angkot Bandung Mapping (Data Engineering)',
      description:
        'A data engineering project combining Angkot Bandung route data from Satudata Bandung with fleet statistics from BPS Kota Bandung, including geospatial analysis using PostgreSQL, PostGIS, and QGIS.',
      highlights: [
        'Contributed on Advanced Database Course (5th Semester) to combine data of Angkot Bandung Route accessed from "Satudata Bandung" with "Jumlah Armada Angkot Bandung" from "BPS Kota Bandung".',
        'Performed data preprocessing and cleaning, and created a tutorial to combine the data for classmates, along with geospatial analysis.',
        'Used ogr2ogr from QGIS to convert .geojson data to be combined with the statistic data.',
      ],
      tech_stack: ['PostgreSQL', 'QGIS', 'PostGIS'],
      category: 'data',
      is_featured: false,
      github_url: 'https://github.com/godwimp/angkot-bandung-mapping',
      live_url: null,
      npm_url: null,
      order_index: 5,
    },
  ];

  for (const project of projects) {
    await prisma.projects.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`Seeded: ${project.title}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
