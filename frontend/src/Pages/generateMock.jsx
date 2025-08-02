const generateMockIssues = () => {
    
  const categories = ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
  const statuses = ['Reported', 'In Progress', 'Resolved'];
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sunita Devi', 'Vikash Yadav',
    'Meera Patel', 'Ravi Gupta', 'Anita Verma', 'Suresh Pandey', 'Kavita Jain',
    'Deepak Tiwari', 'Sushma Rao', 'Manish Agarwal', 'Rekha Mishra', 'Ajay Thakur',
    'Neha Dubey', 'Rohit Shukla', 'Pooja Tripathi', 'Santosh Kumar', 'Geeta Singh'
  ];
  
  const roads = [
    'Main Street', 'Gandhi Road', 'Park Road', 'Civil Lines', 'Station Road',
    'Jail Road', 'Collectorate Road', 'Ring Road No. 1', 'VIP Road', 'Telibandha Road',
    'Shankar Nagar', 'Pandri Road', 'Devendra Nagar', 'Sector 1', 'Sector 2',
    'Vidhan Sabha Road', 'Dhamtari Road', 'Bilaspur Road', 'Abhanpur Road', 'Moudhapara',
    'Kota', 'Gudhiyari', 'Tatibandh', 'Sarona', 'Mowa'
  ];

  const areas = [
    'Civil Lines', 'Shankar Nagar', 'Pandri', 'Telibandha', 'Devendra Nagar',
    'Sector 1', 'Sector 2', 'Kota', 'Gudhiyari', 'Tatibandh', 'Sarona',
    'Moudhapara', 'Mowa', 'Abhanpur', 'Raipur City', 'New Raipur'
  ];

  const issueTemplates = {
    'Roads': [
      'Large pothole causing traffic issues',
      'Road surface damaged after rain',
      'Deep crater in the middle of road',
      'Uneven road surface',
      'Road cracks expanding rapidly',
      'Broken speed breaker',
      'Missing road divider',
      'Damaged pedestrian crossing'
    ],
    'Lighting': [
      'Street light not working',
      'Flickering street light',
      'Broken lamp post',
      'Insufficient lighting in area',
      'Street light bulb blown out',
      'Electrical wire exposed from pole',
      'Multiple lights not working',
      'Solar street light damaged'
    ],
    'Water Supply': [
      'Water pipeline burst',
      'No water supply for days',
      'Contaminated water supply',
      'Low water pressure',
      'Water leakage from main pipe',
      'Sewage overflow',
      'Broken water meter',
      'Illegal water connection'
    ],
    'Cleanliness': [
      'Garbage not collected',
      'Overflowing dustbin',
      'Illegal dumping of waste',
      'Stray animals creating mess',
      'Public toilet not cleaned',
      'Dead animal on road',
      'Medical waste disposal issue',
      'Plastic waste accumulation'
    ],
    'Public Safety': [
      'Broken footpath',
      'Open manhole cover',
      'Dangerous construction work',
      'Stray dogs causing problems',
      'Inadequate security lighting',
      'Vandalized public property',
      'Unsafe playground equipment',
      'Accident-prone intersection'
    ],
    'Obstructions': [
      'Illegal parking blocking road',
      'Construction material on road',
      'Vendor encroachment',
      'Fallen tree blocking path',
      'Abandoned vehicle',
      'Illegal shop on footpath',
      'Advertisement board blocking view',
      'Electric pole in wrong place'
    ]
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const getRandomDate = (daysBack) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString();
  };
  
  const getRandomLocation = () => {
    // Generate coordinates around Raipur area
    const baseLat = 21.2514;
    const baseLng = 81.6296;
    const radius = 0.05; // Roughly 5km radius
    
    const lat = baseLat + (Math.random() - 0.5) * radius;
    const lng = baseLng + (Math.random() - 0.5) * radius;
    
    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6))
    };
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const generateStatusHistory = (currentStatus, reportedAt) => {
    const history = [
      { 
        status: 'Reported', 
        timestamp: reportedAt, 
        note: 'Issue reported by citizen' 
      }
    ];

    if (currentStatus === 'In Progress' || currentStatus === 'Resolved') {
      const progressDate = new Date(reportedAt);
      progressDate.setDate(progressDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      history.push({
        status: 'In Progress',
        timestamp: progressDate.toISOString(),
        note: Math.random() > 0.5 ? 'Work order assigned to maintenance team' : 'Issue under investigation'
      });
    }

    if (currentStatus === 'Resolved') {
      const resolvedDate = new Date(history[history.length - 1].timestamp);
      resolvedDate.setDate(resolvedDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      history.push({
        status: 'Resolved',
        timestamp: resolvedDate.toISOString(),
        note: 'Issue resolved successfully'
      });
    }

    return history;
  };

  const issues = [];
  const userLocation = { lat: 21.2514, lng: 81.6296 }; // Raipur center

  for (let i = 1; i <= 100; i++) {
    const category = getRandomElement(categories);
    const status = getRandomElement(statuses);
    const isAnonymous = Math.random() > 0.7; // 30% anonymous reports
    const reportedBy = isAnonymous ? 'Anonymous' : getRandomElement(names);
    const road = getRandomElement(roads);
    const area = getRandomElement(areas);
    const location = getRandomLocation();
    const reportedAt = getRandomDate(30); // Within last 30 days
    const template = getRandomElement(issueTemplates[category]);
    
    const issue = {
      id: i,
      title: `${template} on ${road}`,
      description: `${template.toLowerCase()} reported in ${area} area. ${
        Math.random() > 0.5 
          ? 'Requires immediate attention from concerned authorities.' 
          : 'Local residents are facing inconvenience due to this issue.'
      }`,
      category,
      status,
      location,
      latitude: location.lat,
      longitude: location.lng,
      address: `${road}, ${area}, Raipur`,
      reportedBy,
      reportedAt,
      createdAt: reportedAt,
      photos: [
        `https://via.placeholder.com/300x200?text=${encodeURIComponent(category + ' Issue')}&bg=${
          status === 'Reported' ? 'ff4444' : status === 'In Progress' ? 'ff8800' : '00aa00'
        }&color=ffffff`
      ],
      distance: parseFloat(calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        location.lat, 
        location.lng
      ).toFixed(1)),
      statusHistory: generateStatusHistory(status, reportedAt),
      flagCount: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0, // 10% chance of being flagged
      priority: Math.random() > 0.8 ? 'High' : Math.random() > 0.6 ? 'Medium' : 'Low',
      isAnonymous
    };

    issues.push(issue);
  }

  // Sort by most recent first
  return issues.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
};

// Pre-generated data for immediate use
const mockIssuesData = [
  {
    id: 1,
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing traffic issues near the market area',
    category: 'Roads',
    status: 'Reported',
    location: { lat: 21.2504, lng: 81.6286 },
    latitude: 21.2504,
    longitude: 81.6286,
    address: 'Main Street, Raipur',
    reportedBy: 'Anonymous',
    reportedAt: '2025-08-01T10:30:00Z',
    createdAt: '2025-08-01T10:30:00Z',
    photos: ['https://imgs.search.brave.com/JDa8HBB71mOVHIC5RDUzMETUy07IYPBm8Pe3mIA8Gkw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzEwL05ld3BvcnRf/V2hpdGVwaXRfTGFu/ZV9wb3RfaG9sZS5K/UEc'],
    distance: 1.2,
    statusHistory: [
      { status: 'Reported', timestamp: '2025-08-01T10:30:00Z', note: 'Issue reported by citizen' }
    ],
    flagCount: 0,
    priority: 'Medium',
    isAnonymous: true
  },
  {
    id: 2,
    title: 'Broken streetlight on Park Road',
    description: 'Street light not working for past 3 days',
    category: 'Lighting',
    status: 'In Progress',
    location: { lat: 21.2524, lng: 81.6306 },
    latitude: 21.2524,
    longitude: 81.6306,
    address: 'Park Road, Raipur',
    reportedBy: 'Rajesh Kumar',
    reportedAt: '2025-07-30T14:20:00Z',
    createdAt: '2025-07-30T14:20:00Z',
    photos: ['https://imgs.search.brave.com/N14X5jcV7OWyLduEz_QpOPzAlHljqbRBtvBIdQXcwGE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9i/L2IxL0JhbmJ1cnkn/c19CcmV0Y2hfSGls/bF9Qb3Rob2xlLF8y/MDEwLnBuZw'],
    distance: 2.1,
    statusHistory: [
      { status: 'Reported', timestamp: '2025-07-30T14:20:00Z', note: 'Issue reported by citizen' },
      { status: 'In Progress', timestamp: '2025-08-01T09:15:00Z', note: 'Work order assigned to maintenance team' }
    ],
    flagCount: 0,
    priority: 'High',
    isAnonymous: false
  },
  {
    id: 3,
    title: 'Water leak on Gandhi Road',
    description: 'Major water leak causing road flooding',
    category: 'Water Supply',
    status: 'Resolved',
    location: { lat: 21.2494, lng: 81.6276 },
    latitude: 21.2494,
    longitude: 81.6276,
    address: 'Gandhi Road, Raipur',
    reportedBy: 'Priya Sharma',
    reportedAt: '2025-07-28T08:45:00Z',
    createdAt: '2025-07-28T08:45:00Z',
    photos: ['https://via.placeholder.com/300x200?text=Water+Leak&bg=00aa00&color=ffffff'],
    distance: 2.8,
    statusHistory: [
      { status: 'Reported', timestamp: '2025-07-28T08:45:00Z', note: 'Issue reported by citizen' },
      { status: 'In Progress', timestamp: '2025-07-29T11:30:00Z', note: 'Repair team dispatched' },
      { status: 'Resolved', timestamp: '2025-07-30T16:20:00Z', note: 'Leak repaired and road cleaned' }
    ],
    flagCount: 0,
    priority: 'Low',
    isAnonymous: false
  }
];

export { generateMockIssues, mockIssuesData };
export default generateMockIssues;