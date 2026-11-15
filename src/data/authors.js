export const AUTHORS = [
  {
    name: 'Karthikeyan Sadayamuthu',
    role: 'Founder & Principal Author',
    authoredFrameworks: true,
    title: 'Principal Software Engineer · Cybersecurity, Trust Engineering & Cloud Security',
    url: 'https://sadayamuthu.com',
    links: [
      { label: 'Website', href: 'https://sadayamuthu.com' },
      { label: 'ORCID', href: 'https://orcid.org/0009-0008-3539-6048' },
      { label: 'GitHub', href: 'https://github.com/sadayamuthu' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sadayamuthu' },
    ],
    bio: [
      'Karthikeyan designs and builds every OpenAstra framework. He has spent more than fifteen years in software engineering, the last several focused on trust engineering: making security and compliance evidence measurable, automated, and auditable in FedRAMP and commercial cloud environments.',
      'As a Principal Software Engineer at Autodesk, he is lead architect for the Trust Data Platform and Trust Dashboard, which normalize real-time signals from tools such as Snyk, Qualys, CrowdStrike, Orca, and Twistlock into risk models aligned with NIST SP 800-53, FedRAMP, and Zero Trust principles. He also built a consent and permission platform for GDPR, CCPA, and FedRAMP privacy compliance.',
    ],
    research: [
      { area: 'Compliance as code', detail: 'Machine-readable NIST SP 800-53 and FedRAMP control catalogs (OCBC), CVE exposure baselines enriched with EPSS and CISA KEV (OEBC), and pre-commit compliance gates (ControlGate).' },
      { area: 'Governing AI agents', detail: 'Declarative policy for what generative AI agents can access and produce (OpenGPL), and tooling that catches unrequested or conflicting changes from coding agents (unasked, mergelock).' },
      { area: 'Private & observable AI', detail: 'Offline, local-model development environments (ZeroEgress) and SQL analytics over LLM responses, agent traces, and RAG pipelines (anySQL).' },
    ],
    service: [
      'Peer reviewer, Cloud Security Alliance AI Safety Working Group: “Designing the AI-First Security Organization”',
      'Peer reviewer, Cloud Security Alliance IAM Working Group: “Navigating Identity and Access Management (IAM): Standards and Protocols” (2026)',
    ],
    expertise: ['FedRAMP', 'NIST SP 800-53', 'Zero Trust', 'AI agent governance', 'GDPR / CCPA', 'AWS & Azure security', 'Identity & access', 'Security data pipelines', 'Observability'],
    experience: [
      { org: 'Autodesk', role: 'Principal Software Engineer', dates: '2022 – present' },
      { org: 'Comcast', role: 'Senior Software Development Engineer', dates: '2016 – 2022' },
      { org: 'The Home Depot', role: 'Senior Java Developer', dates: '2013 – 2016' },
      { org: 'Tata Consultancy Services', role: 'IT Analyst', dates: '2011 – 2013' },
      { org: 'BNY Mellon', role: 'Application Developer', dates: '2010 – 2011' },
    ],
    credentials: [
      'Trusted AI Safety Expert (TAISE), CSA',
      'Certificate of Cloud Security Knowledge (CCSK), CSA',
      'Certificate of Competence in Zero Trust (CCZT), CSA',
      'SailPoint Identity Security Leader',
    ],
  },
  {
    name: 'Vinodh Kannan Sadayamuthu',
    role: 'Contributor',
    url: 'https://www.linkedin.com/in/vinodh-aws/',
    placeholder: true,
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinodh-aws/' }],
  },
  {
    name: 'Kartic Narayanan',
    role: 'Contributor',
    url: 'https://www.linkedin.com/in/karticnarayanan/',
    placeholder: true,
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/karticnarayanan/' }],
  },
  {
    name: 'Manjulata Singh',
    role: 'Contributor',
    url: 'https://www.linkedin.com/in/manjulatasingh/',
    placeholder: true,
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/manjulatasingh/' }],
  },
  {
    name: 'Chakkaravarthi Kannan',
    role: 'Contributor',
    url: 'https://www.linkedin.com/in/chakkaravarthi-kannan/',
    placeholder: true,
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/chakkaravarthi-kannan/' }],
  },
  {
    name: 'Vibha Nair',
    role: 'Contributor',
    url: 'https://www.linkedin.com/in/vibhanair/',
    placeholder: true,
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vibhanair/' }],
  },
]

export const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const authorPath = (a) => `/about/${slugify(a.name)}`
export const getAuthor = (slug) => AUTHORS.find((a) => slugify(a.name) === slug)
