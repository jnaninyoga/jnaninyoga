export default function userHP({age, sex, medicalhistory, currentcare, liferhythm}) {
  const BASEHP = 70; // Base HP for all users
  const ACCCoifficient = 10; // ACC Coefficient
  const MHCoifficient = 5; // MH Coefficient
  const CCCoifficient = 5; // CC Coefficient
  const LRCoifficient = 10; // LR Coefficient

  // * Calculate ACC (Age Category Coefficient) based on age and gender
  let ACC = 1;
  // children category
  if (age >= 6 && age <= 16) {
    ACC = 1.5;
  // youths category
  } else if (age >= 17 && age <= 25) {
    ACC = 1;
  // young adults/ Mid Age category
  } else if (age >= 26 && age <= 35) {
    ACC = 1.25;
  // adults category
  } else if (age >= 36 && age <= 50) {
    ACC = 1.5;
  // infirmes category
  } else if (age >= 51 && age <= 70) {
    ACC = 2;
  }

  if (sex.toLowerCase() === "female") {
    ACC += 0.2; // Increase ACC by 0.2 for females
  }

  // Calculate MH_Coefficient based on medical history
  const MH_Coefficient = {
    "No Medical History": 0,
    "Osteoarticular": 2,
    "Cardiac": 2,
    "Metabolic": 1,
    "Respiratory": 2,
    "Digestive": 1,
    "Urinary": 1,
    "Gyneco-obstetrics": sex.toLowerCase() === "female" ? 2 : 0,
    "Neurological": 2,
    "Immunological (Infectious/allergies)": 1,
    "Endocrine": 1,
    "Sanguines": 1,
  }[medicalhistory.record] || 0;

  // Calculate CC_Coefficient based on current care
  const CC_Coefficient = {
    "No Current Medical Care": 0,
    "Home Remedies/Self-care": 1,
    "Medicines/Prescription Drugs": 2,
    "Psychotherapy/Counseling": 1,
    "Phytotherapy/Herbal Remedies": 1,
    "Nutritional Supplements/Vitamins": 1,
    "Physical Therapy/Rehabilitation": 2,
    "Surgery/Procedures": 2,
    "Alternative Medicine/Complementary Therapies": 1,
    "Medical Devices/Appliances": 2,
  }[currentcare] || 0;

  // Calculate LR based on liferhythm data
  const liferhythmData = liferhythm || {};
  const { sleep, sport, nutrition, meditation } = liferhythmData;

  const LR = (
    (sleep === "good" ? 1 : 0) +
    (sport === "regularly" ? 1 : sport === "sometimes" ? 0.5 : 0) +
    (nutrition === "good" ? 1 : 0) +
    (meditation === "regularly" ? 1 : meditation === "sometimes" ? 0.5 : 0)
  );

  // Calculate HP using the formula
  const HP = BASEHP - (ACC * ACCCoifficient) - (MH_Coefficient * MHCoifficient) - (CC_Coefficient * CCCoifficient) + (LR * LRCoifficient);

  return HP;
}

