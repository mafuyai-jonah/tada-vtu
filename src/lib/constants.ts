// Constants for TADA VTU

export const GREETING_MESSAGES = [
  "Ready to buy your data? 🚀",
  "Top up your airtime in seconds! ⚡",
  "Never run out of data again 📱",
  "Pay your bills with ease 💳",
  "Fast, secure, reliable VTU services 🔒",
  "Stay connected with affordable data 🌐",
  "Instant airtime recharge awaits! 💨",
  "Your one-stop VTU solution 🎯",
];

export const NETWORKS: Array<{ value: string; label: string; color: string }> =
  [
    { value: "MTN", label: "MTN", color: "#FFCC00" },
    { value: "Airtel", label: "Airtel", color: "#ED1C24" },
    { value: "Glo", label: "Glo", color: "#00A95C" },
    { value: "9mobile", label: "9mobile", color: "#00A650" },
  ];

export const SERVICE_TYPES = [
  { value: "airtime", label: "Airtime", icon: "Phone" },
  { value: "data", label: "Data", icon: "Wifi" },
  { value: "cable", label: "Cable TV", icon: "Tv" },
  { value: "electricity", label: "Electricity", icon: "Zap" },
  { value: "betting", label: "Betting", icon: "DollarSign" },
];

// Sample data plans (in production, fetch from API)
export const DATA_PLANS = {
  MTN: [
    // SME Plans
    {
      id: "1",
      name: "500MB",
      size: "500MB",
      validity: "30 days",
      price: 150,
      type: "sme",
    },
    {
      id: "2",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 280,
      type: "sme",
    },
    {
      id: "3",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 560,
      type: "sme",
    },
    {
      id: "4",
      name: "3GB",
      size: "3GB",
      validity: "30 days",
      price: 840,
      type: "sme",
    },
    {
      id: "5",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1400,
      type: "sme",
    },
    {
      id: "6",
      name: "10GB",
      size: "10GB",
      validity: "30 days",
      price: 2800,
      type: "sme",
    },
    // Gifting Plans
    {
      id: "7",
      name: "500MB",
      size: "500MB",
      validity: "30 days",
      price: 180,
      type: "gifting",
    },
    {
      id: "8",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 350,
      type: "gifting",
    },
    {
      id: "9",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 700,
      type: "gifting",
    },
    {
      id: "10",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1750,
      type: "gifting",
    },
    // Corporate Plans
    {
      id: "11",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1600,
      type: "corporate",
    },
    {
      id: "12",
      name: "10GB",
      size: "10GB",
      validity: "30 days",
      price: 3000,
      type: "corporate",
    },
    {
      id: "13",
      name: "20GB",
      size: "20GB",
      validity: "30 days",
      price: 5500,
      type: "corporate",
    },
  ],
  Airtel: [
    // SME Plans
    {
      id: "14",
      name: "500MB",
      size: "500MB",
      validity: "30 days",
      price: 145,
      type: "sme",
    },
    {
      id: "15",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 275,
      type: "sme",
    },
    {
      id: "16",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 550,
      type: "sme",
    },
    {
      id: "17",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1375,
      type: "sme",
    },
    // Gifting Plans
    {
      id: "18",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 300,
      type: "gifting",
    },
    {
      id: "19",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 600,
      type: "gifting",
    },
    {
      id: "20",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1500,
      type: "gifting",
    },
    {
      id: "21",
      name: "10GB",
      size: "10GB",
      validity: "30 days",
      price: 2750,
      type: "gifting",
    },
    // Corporate Plans
    {
      id: "22",
      name: "10GB",
      size: "10GB",
      validity: "30 days",
      price: 2900,
      type: "corporate",
    },
    {
      id: "23",
      name: "25GB",
      size: "25GB",
      validity: "30 days",
      price: 6500,
      type: "corporate",
    },
  ],
  Glo: [
    // SME Plans
    {
      id: "24",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 270,
      type: "sme",
    },
    {
      id: "25",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 540,
      type: "sme",
    },
    {
      id: "26",
      name: "3GB",
      size: "3GB",
      validity: "30 days",
      price: 810,
      type: "sme",
    },
    {
      id: "27",
      name: "5GB",
      size: "5GB",
      validity: "30 days",
      price: 1350,
      type: "sme",
    },
    // Gifting Plans
    {
      id: "28",
      name: "1.5GB",
      size: "1.5GB",
      validity: "30 days",
      price: 400,
      type: "gifting",
    },
    {
      id: "29",
      name: "3GB",
      size: "3GB",
      validity: "30 days",
      price: 900,
      type: "gifting",
    },
    {
      id: "30",
      name: "7GB",
      size: "7GB",
      validity: "30 days",
      price: 1900,
      type: "gifting",
    },
    {
      id: "31",
      name: "10GB",
      size: "10GB",
      validity: "30 days",
      price: 2700,
      type: "gifting",
    },
  ],
  "9mobile": [
    // SME Plans
    {
      id: "32",
      name: "500MB",
      size: "500MB",
      validity: "30 days",
      price: 140,
      type: "sme",
    },
    {
      id: "33",
      name: "1GB",
      size: "1GB",
      validity: "30 days",
      price: 280,
      type: "sme",
    },
    {
      id: "34",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 560,
      type: "sme",
    },
    // Gifting Plans
    {
      id: "35",
      name: "1.5GB",
      size: "1.5GB",
      validity: "30 days",
      price: 420,
      type: "gifting",
    },
    {
      id: "36",
      name: "2GB",
      size: "2GB",
      validity: "30 days",
      price: 560,
      type: "gifting",
    },
    {
      id: "37",
      name: "4.5GB",
      size: "4.5GB",
      validity: "30 days",
      price: 1260,
      type: "gifting",
    },
    {
      id: "38",
      name: "11GB",
      size: "11GB",
      validity: "30 days",
      price: 3080,
      type: "gifting",
    },
  ],
};

export const CABLE_PROVIDERS = [
  { value: "dstv", label: "DSTV", icon: "tv" },
  { value: "gotv", label: "GOTV", icon: "tv" },
  { value: "startimes", label: "Startimes", icon: "tv" },
  { value: "showmax", label: "Showmax", icon: "play-circle" },
];

export const CABLE_PLANS = {
  dstv: [
    { id: "dstv-padi", name: "Padi", price: 2950, code: "dstv-padi" },
    { id: "dstv-yanga", name: "Yanga", price: 4200, code: "dstv-yanga" },
    { id: "dstv-confam", name: "Confam", price: 7400, code: "dstv-confam" },
    { id: "dstv-compact", name: "Compact", price: 12500, code: "dstv-compact" },
    {
      id: "dstv-compact-plus",
      name: "Compact Plus",
      price: 19800,
      code: "dstv-compact-plus",
    },
    { id: "dstv-premium", name: "Premium", price: 29500, code: "dstv-premium" },
  ],
  gotv: [
    { id: "gotv-smallie", name: "Smallie", price: 1300, code: "gotv-smallie" },
    { id: "gotv-jinja", name: "Jinja", price: 2700, code: "gotv-jinja" },
    { id: "gotv-jolli", name: "Jolli", price: 3950, code: "gotv-jolli" },
    { id: "gotv-max", name: "Max", price: 5700, code: "gotv-max" },
    { id: "gotv-supa", name: "Supa", price: 7600, code: "gotv-supa" },
  ],
  startimes: [
    { id: "startimes-nova", name: "Nova", price: 1200, code: "startimes-nova" },
    {
      id: "startimes-basic",
      name: "Basic",
      price: 2100,
      code: "startimes-basic",
    },
    {
      id: "startimes-smart",
      name: "Smart",
      price: 3500,
      code: "startimes-smart",
    },
    {
      id: "startimes-classic",
      name: "Classic",
      price: 3800,
      code: "startimes-classic",
    },
    {
      id: "startimes-super",
      name: "Super",
      price: 5300,
      code: "startimes-super",
    },
  ],
  showmax: [
    {
      id: "showmax-mobile",
      name: "Mobile",
      price: 1200,
      code: "showmax-mobile",
    },
    {
      id: "showmax-pro-mobile",
      name: "Pro Mobile",
      price: 2100,
      code: "showmax-pro-mobile",
    },
    {
      id: "showmax-standard",
      name: "Standard",
      price: 2900,
      code: "showmax-standard",
    },
    { id: "showmax-pro", name: "Pro", price: 6300, code: "showmax-pro" },
  ],
};

export const ELECTRICITY_PROVIDERS = [
  { value: "ikeja-electric", label: "Ikeja Electric (IKEDC)", icon: "zap" },
  { value: "eko-electric", label: "Eko Electric (EKEDC)", icon: "zap" },
  { value: "abuja-electric", label: "Abuja Electric (AEDC)", icon: "zap" },
  { value: "ibadan-electric", label: "Ibadan Electric (IBEDC)", icon: "zap" },
  { value: "kano-electric", label: "Kano Electric (KEDCO)", icon: "zap" },
  { value: "enugu-electric", label: "Enugu Electric (EEDC)", icon: "zap" },
  {
    value: "port-harcourt-electric",
    label: "Port Harcourt Electric (PHED)",
    icon: "zap",
  },
  { value: "jos-electric", label: "Jos Electric (JED)", icon: "zap" },
  { value: "benin-electric", label: "Benin Electric (BEDC)", icon: "zap" },
];
