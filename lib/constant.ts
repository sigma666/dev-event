export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO 8601 so it can be parsed/sorted easily
  startTime: string;
  endTime: string;
  price: string;
  type: 'Conference' | 'Hackathon' | 'Meetup';
  image: string; // path under public/
  url: string;
};

// These are real / popular recurring developer events with plausible upcoming dates.
// Image paths assume files exist under public/images.
export const events: Event[] = [
  {
    id: 'nextjs-conf-2025',
    title: 'Next.js Conf 2025',
    description:
      'A full‑day conference focused on the latest in Next.js, React, and the modern web stack. Learn from the team behind Next.js and the community building on it.',
    location: 'San Francisco, CA · USA',
    date: '2025-10-21',
    startTime: '09:00',
    endTime: '18:00',
    price: 'From $299',
    type: 'Conference',
    image: '/images/event1.png',
    url: 'https://nextjs.org/conf',
  },
  {
    id: 'jsconf-eu-2025',
    title: 'JSConf EU 2025',
    description:
      'One of the most influential JavaScript conferences, featuring talks on web performance, tooling, TypeScript, and the future of the JavaScript ecosystem.',
    location: 'Berlin · Germany',
    date: '2025-06-12',
    startTime: '10:00',
    endTime: '17:30',
    price: 'From €350',
    type: 'Conference',
    image: '/images/event2.png',
    url: 'https://jsconf.com',
  },
  {
    id: 'aws-reinvent-2025',
    title: 'AWS re:Invent 2025',
    description:
      'The flagship AWS cloud conference with deep‑dive sessions, hands‑on labs, and announcements across serverless, containers, AI/ML, and more.',
    location: 'Las Vegas, NV · USA',
    date: '2025-12-01',
    startTime: '08:30',
    endTime: '19:00',
    price: 'From $1,799',
    type: 'Conference',
    image: '/images/event3.png',
    url: 'https://reinvent.awsevents.com',
  },
  {
    id: 'eth-global-hackathon-2025',
    title: 'ETHGlobal Online Hackathon 2025',
    description:
      'A global, online‑first web3 hackathon where developers build decentralized apps, tooling, and infrastructure with mentorship from leading ecosystem teams.',
    location: 'Online',
    date: '2025-04-04',
    startTime: '00:00',
    endTime: '23:59',
    price: 'Free',
    type: 'Hackathon',
    image: '/images/event4.png',
    url: 'https://ethglobal.com',
  },
  {
    id: 'global-game-jam-2025',
    title: 'Global Game Jam 2025',
    description:
      'A 48‑hour worldwide hackathon where developers, designers, and artists collaborate to build games around a central theme.',
    location: 'Multiple locations · Worldwide',
    date: '2025-01-24',
    startTime: '18:00',
    endTime: '18:00',
    price: 'Free / Local fees may apply',
    type: 'Hackathon',
    image: '/images/event5.png',
    url: 'https://globalgamejam.org',
  },
  {
    id: 'react-london-meetup-2025-03',
    title: 'React London Meetup – Modern Frontend Patterns',
    description:
      'Monthly community meetup featuring lightning talks and deep‑dives into React Server Components, performance optimization, and testing strategies.',
    location: 'London · United Kingdom',
    date: '2025-03-18',
    startTime: '18:30',
    endTime: '21:00',
    price: 'Free',
    type: 'Meetup',
    image: '/images/event6.png',
    url: 'https://www.meetup.com/react-london',
  },
  {
    id: 'sf-typescript-meetup-2025-02',
    title: 'SF TypeScript & Node.js Meetup',
    description:
      'A casual evening meetup for engineers working with TypeScript, Node.js, and modern backend tooling. Includes short talks, demos, and networking.',
    location: 'San Francisco, CA · USA',
    date: '2025-02-11',
    startTime: '19:00',
    endTime: '21:30',
    price: 'Free',
    type: 'Meetup',
    image: '/images/event-full.png',
    url: 'https://www.meetup.com/sf-node-ts',
  },
];
