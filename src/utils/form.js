// Form Fields:
export const contactFields = [
  // the fullname field is string at least 6 chars long only letters and alow spaces no special chars
  {
    required: true,
    type: "text",
    name: "fullname",
    placeholder: "Full Name",
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/,
    error: "Full Name must be at least 2 characters long and only letters and spaces",
  },
  {
    required: true,
    type: "email",
    name: "email",
    placeholder: "Email",
    regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    error: "Email must be a valid email address",
  },
  {
    required: true,
    type: "tel",
    name: "phone",
    placeholder: "Phone Number",
  },
  // the message field is string at least 2 chars long alow new lines and spaces
  {
    required: true,
    type: "textarea",
    name: "message",
    placeholder: "Message",
    regex: /^[\S\s]{2,}$/,
    error: "Message must be at least 2 characters long and only letters, numbers, spaces and new lines",
  },
];

export const bookNowFields = [
  // the fullname field is string at least 6 chars long only letters and alow spaces no special chars
  {
    required: true,
    type: "text",
    name: "fullname",
    placeholder: "Full Name",
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/,
    error: "Full Name must be at least 2 characters long and only letters and spaces",
  },
  {
    type: "email",
    name: "email",
    placeholder: "Email",
    regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    error: "Email must be a valid email address",
  },
  {
    required: true,
    type: "tel",
    name: "phone",
    placeholder: "Phone Number",
  },
  {
    type: "textarea",
    name: "interest",
    placeholder: "what are your interests in Yoga?",
    regex: /^[\S\s]{10,}$/,
    error: "Your interest must be at least 10 characters long and only letters, numbers, spaces and new lines",
  },
];

export const adminLoginFields = [
  // username
  {
    required: true,
    type: "text",
    name: "username",
    placeholder: "Username",
  },
  // password
  {
    required: true,
    type: "password",
    name: "password",
    placeholder: "Password",
  },
];

export const accountFields = [
  // username
  {
    required: true,
    type: "text",
    name: "username",
    placeholder: "Username",
    defaultValue: "admin",
    regex: /^[a-zA-Z]{5,16}$/,
    error: "Username must be between 5 to 16 characters long, only letters [A-Z], no spaces or special characters",
  },
  // password
  {
    required: true,
    type: "password",
    name: "password",
    placeholder: "Password",
    defaultValue: "admin",
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/,
    error: "Password must be between 8 and 16 characters, one uppercase letter, one lowercase letter, one number or one special character [!@#$%^&*]",
  },
];

export const reviewsFields = [
  // the fullname field is string at least 6 chars long only letters and alow spaces no special chars
  {
    type: "text",
    name: "fullname",
    placeholder: "Full Name",
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/,
    error: "Full Name must be at least 2 characters long and only letters and spaces",
  },
  // the message field is string at least 2 chars long alow new lines and spaces
  {
    required: true,
    type: "textarea",
    name: "review",
    placeholder: "Your Review",
    regex: /^[\S\s]{10,500}$/,
    maxChars: 500,
    error: "review must be at least 10 characters long",
  },
];

export const userFields = [
  // separator title --------------------------------------------------------
  { type: "separator", title: "Personal Information" },
  {
    required: true,
    type: "text",
    name: "firstname",
    placeholder: "First Name",
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/,
    error: "First Name must be at least 2 characters long and only letters and spaces",
  },
  {
    required: true,
    type: "text",
    name: "lastname",
    placeholder: "Last Name",
    regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/,
    error: "Last Name must be at least 2 characters long and only letters and spaces",
  },
  // sex field
  {
    required: true,
    type: "singleSelect",
    name: "sex",
    options: ["male", "female"],
    defaultValue: "female",
  },
  // birthdate field
  {
    required: true,
    type: "date",
    name: "birthdate",
    placeholder: "Birthdate",
    regex: /^[\S\s]{2,}$/,
    error: "Birthdate Field is required",
  },
  // phone field
  {
    required: true,
    type: "tel",
    name: "phone",
    placeholder: "Phone Number",
  },
  // mail field
  {
    required: true,
    type: "email",
    name: "email",
    placeholder: "Email",
    regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    error: "Email must be a valid email address",
  },
  // job field
  {
    required: true,
    type: "text",
    name: "job",
    placeholder: "Job / Occupation",
    regex: /^[a-zA-Z\s]{2,}$/,
    error: "Job Field is required",
  },
  // address field
  {
    required: true,
    type: "textarea",
    name: "address",
    placeholder: "Address",
    regex: /^[\S\s]{2,}$/,
    error: "Address Field is required",
  },
  // separator title --------------------------------------------------------
  { type: "separator", title: "Medical Information", name: "medicalhistory" },
  // current care field
  {
    required: true,
    type: "select",
    name: "currentcare",
    options: [
      "No Current Medical Care",
      "Home Remedies/Self-care",
      "Medicines/Prescription Drugs",
      "Psychotherapy/Counseling",
      "Phytotherapy/Herbal Remedies",
      "Nutritional Supplements/Vitamins",
      "Physical Therapy/Rehabilitation",
      "Surgery/Procedures",
      "Alternative Medicine/Complementary Therapies",
      "Medical Devices/Appliances",
    ],
    defaultValue: "No Current Medical Care",
    placeholder: "current medical care",
    for: "medicalhistory",
  },
  {
    type: "textarea",
    name: "currentcareinfo",
    placeholder: "current medical care info",
    for: "medicalhistory",
  },
  // medical history field
  {
    required: true,
    type: "select",
    name: "record",
    options: [
      "No Medical History",
      "Osteoarticular",
      "Cardiac",
      "Metabolic",
      "Respiratory",
      "Digestive",
      "Urinary",
      "Gyneco-obstetrics",
      "Neurological",
      "Immunological (Infectious / allergies)",
      "Endocrine",
      "Sanguines",
    ],
    defaultValue: "No Medical History",
    placeholder: "medical history",
    for: "medicalhistory",
  },
  {
    type: "textarea",
    name: "recordinfo",
    placeholder: "medical history info",
    for: "medicalhistory",
  },
  // separator title --------------------------------------------------------
  { type: "separator", title: "Physical / Mental Health", name: "physentalstate" },
  // physical state field
  {
    required: true,
    type: "text",
    name: "physical",
    placeholder: "physical state",
    regex: /^[a-zA-Z\s,]{3,}$/,
    note: "For more than one state, separate them with a comma ','",
    error: "Physical state must be at least 3 characters long, like: 'Agility, Athletic,...'",
    for: "physentalstate",
    valueFormatter: (value) => value.split(","),
  },
  // mental state field
  {
    required: true,
    type: "text",
    name: "mental",
    placeholder: "mental state",
    regex: /^[a-zA-Z\s,]{3,}$/,
    note: "For more than one state, separate them with a comma ','",
    error: "Mental state must be at least 3 characters long, like: 'Anxious, Energetic,...'",
    for: "physentalstate",
    valueFormatter: (value) => value.split(","),
  },
  // separator title --------------------------------------------------------
  { type: "separator", title: "Life Rhythm", name: "liferhythm" },
  // sleep field
  {
    required: true,
    type: "singleSelect",
    name: "sleep",
    options: ["good", "bad"],
    placeholder: "sleep rhythm",
    for: "liferhythm",
  },
  // nutrition field
  {
    required: true,
    type: "singleSelect",
    name: "nutrition",
    options: ["good", "bad"],
    placeholder: "nutrition rhythm",
    for: "liferhythm",
  },
  // sport field
  {
    required: true,
    type: "singleSelect",
    name: "sport",
    options: ["regularly", "sometimes", "never"],
    placeholder: "sport rhythm",
    for: "liferhythm",
  },
  // meditation field
  {
    required: true,
    type: "singleSelect",
    name: "meditation",
    options: ["regularly", "sometimes", "never"],
    placeholder: "meditation rhythm",
    for: "liferhythm",
  },
  // separator title --------------------------------------------------------
  { type: "separator", title: "Consultaion Reason" },
  // consultation reason field
  {
    type: "textarea",
    name: "consultationreason",
    placeholder: "Reason For The Consultation",
  },
];
