export const LEAD_STAGES = ["New", "Site Visit", "Negotiation", "Closed"];

export const leads = [
  {
    id: "L-1001",
    name: "Karthik Subramaniam",
    phone: "+91 98765 43210",
    propertyId: "trinita-grand-symphony",
    stage: "New",
    source: "Website Inquiry",
    lastActivity: "2026-08-15",
    budget: "₹55L - ₹65L",
    agentId: "agent-priya",
  },
  {
    id: "L-1002",
    name: "Divya Ramesh",
    phone: "+91 98450 11223",
    propertyId: "casagrand-french-town",
    stage: "Site Visit",
    source: "Buyer Pass",
    lastActivity: "2026-08-14",
    budget: "₹70L - ₹80L",
    agentId: "agent-priya",
  },
  {
    id: "L-1003",
    name: "Mohammed Faizal",
    phone: "+91 90035 66778",
    propertyId: "trinita-grand-symphony",
    stage: "Negotiation",
    source: "Referral",
    lastActivity: "2026-08-12",
    budget: "₹58L - ₹62L",
    agentId: "agent-priya",
  },
  {
    id: "L-1004",
    name: "Anitha Krishnan",
    phone: "+91 99400 22334",
    propertyId: "harbor-view-heights",
    stage: "Closed",
    source: "Website Inquiry",
    lastActivity: "2026-08-05",
    budget: "₹1.9Cr - ₹2.1Cr",
    agentId: "agent-priya",
  },
  {
    id: "L-1005",
    name: "Suresh Babu",
    phone: "+91 91234 56789",
    propertyId: "alliance-humming-gardens",
    stage: "New",
    source: "Website Inquiry",
    lastActivity: "2026-08-16",
    budget: "₹1.4Cr - ₹1.5Cr",
    agentId: "agent-arjun",
  },
  {
    id: "L-1006",
    name: "Priyanka Iyer",
    phone: "+91 90000 12121",
    propertyId: "sunrise-meadows",
    stage: "Site Visit",
    source: "Buyer Pass",
    lastActivity: "2026-08-13",
    budget: "₹45L - ₹50L",
    agentId: "agent-arjun",
  },
];

export const siteVisits = [
  {
    id: "SV-501",
    leadId: "L-1002",
    leadName: "Divya Ramesh",
    propertyId: "casagrand-french-town",
    date: "2026-08-19",
    time: "11:00 AM",
    status: "Scheduled",
    agentId: "agent-priya",
  },
  {
    id: "SV-502",
    leadId: "L-1006",
    leadName: "Priyanka Iyer",
    propertyId: "sunrise-meadows",
    date: "2026-08-20",
    time: "4:30 PM",
    status: "Scheduled",
    agentId: "agent-arjun",
  },
  {
    id: "SV-503",
    leadId: "L-1004",
    leadName: "Anitha Krishnan",
    propertyId: "harbor-view-heights",
    date: "2026-08-04",
    time: "10:00 AM",
    status: "Completed",
    agentId: "agent-priya",
  },
  {
    id: "SV-504",
    leadId: "L-1003",
    leadName: "Mohammed Faizal",
    propertyId: "trinita-grand-symphony",
    date: "2026-08-10",
    time: "2:00 PM",
    status: "Completed",
    agentId: "agent-priya",
  },
];

export const agents = {
  "agent-priya": {
    id: "agent-priya",
    name: "Priya Narayanan",
    phone: "+91 98400 11111",
    email: "priya.n@trinta.properties",
    commissionRate: 0.02,
  },
  "agent-arjun": {
    id: "agent-arjun",
    name: "Arjun Mehta",
    phone: "+91 98400 22222",
    email: "arjun.m@trinta.properties",
    commissionRate: 0.02,
  },
};

export const owners = {
  "owner-ravi": {
    id: "owner-ravi",
    name: "Ravi Chandran",
    phone: "+91 98200 33333",
    email: "ravi.c@trinta.properties",
  },
  "owner-meena": {
    id: "owner-meena",
    name: "Meena Sundaram",
    phone: "+91 98200 44444",
    email: "meena.s@trinta.properties",
  },
};

export const computeCommission = (lead, properties) => {
  const property = properties.find((p) => p.id === lead.propertyId);
  const agent = agents[lead.agentId];
  if (!property || !agent) return 0;
  return property.priceFrom * agent.commissionRate;
};
