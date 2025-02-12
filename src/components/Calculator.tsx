import React, { useState } from 'react';

type PrincipalCanadaWork = "Working in Canada" | "LMIA Job Offer" | "No Job or LMIA";
type Education = 
    "None" |
    "Canadian certificate equivalent or a program lasting at least two semesters but less than two years" |
    "Canadian diploma that's equivalent to studies lasting between two to less than three years" |
    "Bachelor's degree OR a minimum of a three-year degree from a university or college" |
    "Trade certification" |
    "Master's or Doctorate(PhD) degree (Canadian equivalency)";
type YesNo = "Yes" | "No";
type LanguageScore = "Below Average" | "Average" | "Above Average" | "Excellent";
type LanguageProficiency = "Less than high basic (CLB3-, IELTS 2.5-3)" | "High basic (CLB4, IELTS 3.5)" | "Initial intermediate (CLB5, IELTS 4-4.5)" | "Developing intermediate (CLB6, IELTS 5-5.5)" | "Adequate intermediate (CLB7, IELTS 6)" | "High intermediate (CLB8, IELTS 6.5)" | "Initial Advanced (CLB9, IELTS 7)" | "Advanced (CLB10+, IELTS 8+)";
type SecondLanguage = "Yes" | "No";

function getAgePoints(age: number): number {
    if (age < 18) return 0;
    if (age < 22 && age > 17) return 8;
    if (age < 35 && age > 21) return 12;
    if (age < 46 && age > 34) return 10;
    if (age < 51 && age > 45) return 8;
    return 0;
}

function getEducationPoints(education: Education): number {
    switch (education) {
      case "Canadian certificate equivalent or a program lasting at least two semesters but less than two years": return 12;
      case "Canadian diploma that's equivalent to studies lasting between two to less than three years": return 15;
      case "Bachelor's degree OR a minimum of a three-year degree from a university or college": return 20;
      case "Trade certification": return 20;
      case "Master's or Doctorate(PhD) degree (Canadian equivalency)": return 23;
      default: return 0;
  }
}

function getWorkExperiencePoints(type: PrincipalCanadaWork): number {
    if (type === "Working in Canada" || type === "LMIA Job Offer") return 10;
  return 0;
}

function getWorkYearsPoints(years: number): number {
    if (years === 1) return 9;
    if (years === 2 || years === 3) return 11;
    if (years === 4 || years === 5) return 13;
    if (years > 5) return 15;
    return 0;
}

function getAdaptabilityPoints(
  principalCanadaWork: YesNo,
  principalPreviousStudy: YesNo,
  // spousePreviousStudy: YesNo,
  previousSaskatchewanWork: YesNo,
  // spouseLanguage: YesNo,
  saskatchewanRelative: YesNo
): number {
    let points = 0;

  //  Saskachewan Job Offer
  if (principalCanadaWork === "Yes") points += 30;

  // Principal Previous Study Points
  if (principalPreviousStudy === "Yes") points += 5;

  // Previous Saskatchewan Work
  if (previousSaskatchewanWork === "Yes") points += 5;


  // Saskatechwan Relative Points
  if (saskatchewanRelative === "Yes") points += 20;

  // Return the minimum between the calculated points and 10 (as per the provided formula)
  return Math.min(30, points);
}

function getLanguagePoints(score: LanguageScore): number {
  switch (score) {
      case "Below Average": return 0;
      case "Average": return 16;
      case "Above Average": return 20;
      case "Excellent": return 24;
      default: return 0;
  }
}


function getProficiencyPoints(score: LanguageProficiency): number {
  switch (score) {
      case "Less than high basic (CLB3-, IELTS 2.5-3)": return 0;
      case "High basic (CLB4, IELTS 3.5)": return 16;
      case "Initial intermediate (CLB5, IELTS 4-4.5)": return 20;
      case "Developing intermediate (CLB6, IELTS 5-5.5)": return 24;
      case "Adequate intermediate (CLB7, IELTS 6)": return 24;
      case "High intermediate (CLB8, IELTS 6.5)": return 24;
      case "Initial Advanced (CLB9, IELTS 7)": return 24;
      case "Advanced (CLB10+, IELTS 8+)": return 24;
      default: return 0;
  }
}


function getSecondLanguagePoints(hasSecondLanguage: SecondLanguage): number {
  return hasSecondLanguage === "Yes" ? 4 : 0;
}

const Calculator: React.FC = () => {
  const [age, setAge] = useState<number>(0);
  const [workYears, setWorkYears] = useState<number>(0);
  const [education, setEducation] = useState<Education>("None");
  const [principalCanadaWork, setPrincipalCanadaWork] = useState<YesNo>("No");
  const [principalPreviousStudy, setPrincipalPreviousStudy] = useState<YesNo>("No");
  const [previousSaskatchewanWork, setpreviousSaskatchewanWork] = useState<YesNo>("No");
  const [saskatchewanRelative, setCanadianRelative] = useState<YesNo>("No");
  // const [languageScore, setLanguageScore] = useState<LanguageScore>("Below Average");
  const [languageScore, setLanguageProficiency] = useState<LanguageProficiency>("Less than high basic (CLB3-, IELTS 2.5-3)");
  const [secondLanguage, setSecondLanguage] = useState<SecondLanguage>("No");
  const [eligibilityMessage, setEligibilityMessage] = useState<string>("");

  const handleSubmit = () => {
    const totalPoints = getAgePoints(age) + getWorkYearsPoints(workYears) + getEducationPoints(education);
    const adaptabilityPoints = getAdaptabilityPoints(principalCanadaWork, principalPreviousStudy, previousSaskatchewanWork, saskatchewanRelative);
    // const languagePoints = getLanguagePoints(languageScore);
    const languagePoints = getProficiencyPoints(languageScore);
    const secondLangPoints = getSecondLanguagePoints(secondLanguage);
    const finalPoints = totalPoints + adaptabilityPoints + languagePoints + secondLangPoints;

    if (finalPoints < 60) {
        setEligibilityMessage(`You do not have enough points to be eligible. You currently have ${finalPoints} points and you need 60 out of 110 points.`);
    } else {
        setEligibilityMessage(`You have ${finalPoints} points so you are eligible.`);
    }
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-x-4">
      {/* Column 1 */}
      <div className="">
        {/* Age Input */}
        <label className="font-bold block mb-4">
          Age:
          <input type="number" value={age <= 0 ? "" : age.toString()} onChange={(e) => setAge(Number(e.target.value))} placeholder="" className="mt-4 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
        </label>

        {/* Education Dropdown */}
        <label className="font-bold block mb-4">
          Education:
          <select value={education} onChange={(e) => setEducation(e.target.value as Education)} className="mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <option value="None">None</option>
            <option value="Canadian certificate equivalent or a program lasting at least two semesters but less than two years">Canadian certificate equivalent or a program lasting at least two semesters but less than two years</option>
            <option value="Canadian diploma that's equivalent to studies lasting between two to less than three years">Canadian diploma that's equivalent to studies lasting between two to less than three years</option>
            <option value="Bachelor's degree OR a minimum of a three-year degree from a university or college">Bachelor's degree OR a minimum of a three-year degree from a university or college</option>
            <option value="Trade certification">Trade certification</option>
            <option value="Master's or Doctorate(PhD) degree (Canadian equivalency)">Master's or Doctorate(PhD) degree (Canadian equivalency)</option>
          </select>
        </label>

        {/* Work Years Input */}
        <label className="font-bold block mb-4">
          Work Years:
          <input type="number" value={workYears <=0 ? "" :workYears} onChange={(e) => setWorkYears(Number(e.target.value))} className=" mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
        </label>

        
        </div>

        {/* Column 2 */}
        {/*... [Rest of the column 2 content]*/}
        <div>
        {/* Principal Canada Work Dropdown */}
        <label className="font-bold block mb-4">
          Saskatchewan Job Offer:
          <select value={principalCanadaWork} onChange={(e) => setPrincipalCanadaWork(e.target.value as YesNo)} className="mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <option value="Yes">Yes</option>
              <option value="No">No</option>
          </select>
        </label>

        {/* Language Score Dropdown */}
        <label className="font-bold block mb-4">
          First Language Score:
          <select value={languageScore} onChange={(e) => setLanguageProficiency(e.target.value as LanguageProficiency)} className="mt-4 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            <option value="Less than high basic (CLB3-, IELTS 2.5-3)">Less than high basic (CLB3-, IELTS 2.5-3)</option>
            <option value="High basic (CLB4, IELTS 3.5)">High basic (CLB4, IELTS 3.5)</option>
            <option value="Initial intermediate (CLB5, IELTS 4-4.5)">Initial intermediate (CLB5, IELTS 4-4.5)</option>
            <option value="Developing intermediate (CLB6, IELTS 5-5.5)">Developing intermediate (CLB6, IELTS 5-5.5)</option>
            <option value="Adequate intermediate (CLB7, IELTS 6)">Adequate intermediate (CLB7, IELTS 6)</option>
            <option value="High intermediate (CLB8, IELTS 6.5)">High intermediate (CLB8, IELTS 6.5)</option>
            <option value="Initial Advanced (CLB9, IELTS 7)">Initial Advanced (CLB9, IELTS 7)</option>
            <option value="Advanced (CLB10+, IELTS 8+)">Advanced (CLB10+, IELTS 8+)</option>
          </select>
        </label>

        {/* Second Language Dropdown and Note */}
        <label className="font-bold block mb-4">
            Second Language Ability:
            <select value={secondLanguage} onChange={(e) => setSecondLanguage(e.target.value as SecondLanguage)} className="mt-4 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          </div>

          {/* Column 3 */}
          <div>
            {/* Principal Previous Study in Canada Dropdown */}
            <label className="font-bold block mb-4">
            Previous Study in Saskatchewan:
            <select value={principalPreviousStudy} onChange={(e) => setPrincipalPreviousStudy(e.target.value as YesNo)} className="mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </label>

            {/* Previous Saskatchewan Work Experience Dropdown */}
            <label className="font-bold block mb-4">
            Previous Saskatchewan Work Experience:
            <select value={previousSaskatchewanWork} onChange={(e) => setpreviousSaskatchewanWork(e.target.value as YesNo)} className="mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </label>

            {/* Canadian Relative Dropdown */}
            <label className="font-bold block mb-4">
            Saskatchewan Relative:
            <select value={saskatchewanRelative} onChange={(e) => setCanadianRelative(e.target.value as YesNo)} className="mt-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </label>
          
        </div>

        <button onClick={handleSubmit} className="px-8 font-bold bg-blue-500 text-white px-4 py-2 rounded-full mt-4 col-span-3 justify-self-center">Calculate</button>

{/* Display Eligibility Message */}
{eligibilityMessage && (
    <div className="mt-4 col-span-3 text-center">
        {eligibilityMessage}
    </div>
)}

{/* Display Required Language Score based on Selection */}
{/* {languageScore && (
    <div className="mt-4 col-span-3 text-center">
        {languageScore === "Below Average" && "Required Language Score: IELTS (Speaking - 5.0, Reading - 5.5, Writing - 5.5, Listening - 5.5), CELPIP (Speaking - 6, Reading - 6, Writing - 6, Listening - 6)"}
        {languageScore === "Average" && "Required Language Score: IELTS (Speaking - 6.0, Reading - 6.0, Writing - 6.0, Listening - 6.0), CELPIP (Speaking - 7, Reading - 7, Writing - 7, Listening - 7)"}
        {languageScore === "Above Average" && "Required Language Score: IELTS (Speaking - 6.5, Reading - 6.5, Writing - 6.5, Listening - 6.5), CELPIP (Speaking - 8, Reading - 8, Writing - 8, Listening - 8)"}
        {languageScore === "Excellent" && "Required Language Score: IELTS (Speaking - 7.0, Reading - 7.0, Writing - 8.0, Listening - 7.0), CELPIP (Speaking - 9, Reading - 9, Writing - 9, Listening - 9)"}
    </div>
)} */}

{/* Display Required Second Language Score if Second Language is Yes */}
{secondLanguage === "Yes" && (
    <div className="mt-4 col-span-3 text-center">
        Required Second Language Scores: 
        <br />
        CELPIP: CLB Level 5 and above (Speaking 5–12, Listening 5–12, Reading 5–12, Writing 5–12)
        <br />
        IELTS: CLB Level 5 and above (Speaking 5.0–9.0, Listening 5.0–9.0, Reading 4.0–9.0, Writing 5.0–9.0)
        <br />
        TEF Canada: (Speaking 226–371+, Listening 181–298+, Reading 151–248+, Writing 226–371+)
        <br />
        TCF Canada: (Speaking 6+, Listening 369–397+, Reading 375–405+, Writing 6+)
    </div>
)}

{/* Note for Second Language */}
{secondLanguage === "Yes" && (
    <div className="col-span-3 text-center mt-2">
        <strong>Note:</strong> At least CLB 5 in all of the 4 abilities
    </div>
)}
</div>
  );
};

export default Calculator;
