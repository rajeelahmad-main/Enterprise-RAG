import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../company_hr_rag_dataset');
if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR, { recursive: true });
}

const policies = [
  {
    filename: '01_sibau_introduction_and_vision.md',
    title: 'Sukkur IBA University Introduction and Vision',
    docId: 'SIBAU-SEC-01',
    owner: 'Office of the Vice Chancellor & Registrar',
    version: '2018.1',
    content: `# Sukkur IBA University Introduction and Vision
Document ID: SIBAU-SEC-01 | Owner: Office of the Vice Chancellor & Registrar | Version: 2018.1

## Introduction and History
The Sukkur IBA University (SIBAU) is a public sector degree-awarding University approved by the Higher Education Commission (HEC) and chartered by the Government of Sindh. It is located on Airport Road, Sukkur, Sindh, Pakistan.
In 1994, it was established as the Sukkur Institute of Business Administration for business education in a hired building of Public School, Sukkur. Initially, it was affiliated with IBA Karachi. It was granted a charter as a degree-awarding University through SINDH ACT NO: XVIII OF 2006. Later, on May 15, 2017, it was granted full university status by the Sindh Assembly through SINDH ACT NO. XXI OF 2017.
The Senate is the governing body of the University, and the Governor of Sindh serves as the Chancellor. The Vice Chancellor is the executive and administrative head of the University.

## Vision Statement
To become a world-class university in the fields of management science, social sciences, information technology, engineering, and education.

## Mission Statement
The mission of Sukkur IBA University is to contribute to and serve the community by imparting knowledge through innovative teaching and applied research at global levels of excellence. We aim to establish and sustain a competitive, meritorious environment by strengthening faculty and utilizing state-of-the-art technology to produce graduates equipped with analytical and creative thinking, leadership skills, and an entrepreneurial spirit, who possess a global outlook and are conscious of ethical values.

## Core Aims and Objectives
1. To produce world-class graduates who possess not only academic knowledge but are also equipped with practical skills, research capabilities, and critical thinking.
2. To inculcate ethical thinking and integrity in all graduates.
3. To prepare students and faculty to work for the betterment of society.`
  },
  {
    filename: '02_sibau_code_of_conduct.md',
    title: 'Sukkur IBA University Code of Conduct Policy',
    docId: 'SIBAU-SEC-02.1',
    owner: 'Registrar Office & HR Department',
    version: '2018.1',
    content: `# Sukkur IBA University Code of Conduct Policy
Document ID: SIBAU-SEC-02.1 | Owner: Registrar Office & HR Department | Version: 2018.1

## Purpose and Scope
Management requires all faculty and staff members to abide by the Sukkur IBA University Code of Conduct by maintaining the highest standards of work performance, integrity, and established rules. Compliance with local and international laws is an absolute requirement. Any violation shall lead to disciplinary consequences and may entail dismissal from service.

## Responsibility for University Reputation
The reputation of Sukkur IBA University is determined by the conduct and professionalism of every employee. Inappropriate behavior by an employee can cause significant institutional harm. Any damage or loss to the University's image shall result in formal disciplinary action.

## Respect for People and Anti-Discrimination
Each employee is entitled to fair, courteous, and respectful treatment by supervisors, subordinates, peers, students, and clients. Sukkur IBA University does not tolerate discrimination or harassment based on race, sex, religion, creed, regional or national origin, disability, age, or family status. Any suspected harassment or discrimination should be reported to the immediate supervisor, Head of Department (HoD), HR Department, or Registrar Office for impartial and confidential investigation.

## Plagiarism Policy
The University strictly enforces HEC plagiarism rules for faculty members in all publications, research papers, and case studies. Allegations of plagiarism are investigated confidentially under HEC regulations.

## Gifts, Advantages, and the University Gift Bank
No university employee may directly or indirectly offer or accept gifts, services, or entertainment for personal use in exchange for favorable business decisions or academic treatment.
Faculty and staff must politely decline gifts and explain that institutional policy prohibits acceptance. If a presenter insists, the employee must inform them that the gift cannot be retained personally and will be deposited into the University's official "Gift Bank".
All gifts received must immediately be reported in writing to the department head and handed over to the "Gift Bank" maintained by the Internal Audit Department. An annual stock report of the Gift Bank is submitted to the Competent Authority.

## Donation Management
Donations given on behalf of SIBAU must strictly adhere to the following rules:
1. No donations shall be made to political or religious parties.
2. Payments to private accounts are strictly inadmissible.
3. Grants shall never be made to individuals or entities that could harm University reputation.
4. All donations must be transparent, have documented actual use, and receive explicit approval from the Vice Chancellor.

## Handling of University Assets and Information
Assets such as vehicles, equipment, machinery, computers, and furniture must be used exclusively for University business. Personal use is prohibited and subject to disciplinary action.
Confidentiality of internal matters must be preserved during employment and continues after termination.
Official email on the domain \`@iba-suk.edu.pk\` is provided for official communication. Incidental personal use is permitted if legal and ethical, but employees have no expectation of privacy regarding official university email.`
  },
  {
    filename: '03_sibau_conflict_of_interest.md',
    title: 'Sukkur IBA University Conflict of Interest Policy',
    docId: 'SIBAU-SEC-02.2',
    owner: 'Registrar Office & Ethics Committee',
    version: '2018.1',
    content: `# Sukkur IBA University Conflict of Interest Policy (COI)
Document ID: SIBAU-SEC-02.2 | Owner: Registrar Office & Ethics Committee | Version: 2018.1

## Definition and Examples of Conflict of Interest
Employees must avoid situations where personal or financial interests conflict with their professional obligations to Sukkur IBA University. Examples of conflicts that must be declared include:
1. Having a family or financial interest in transactions with SIBAU or its suppliers.
2. Acting as an employee, advisor, consultant, or shareholder for any counterparty or supplier.
3. Hiring or influencing the hiring of relatives who do not qualify on merit.
4. Using the University name, letterhead, or logo without proper authorization.
5. Intending to begin paid sideline activities without prior written approval from the immediate supervisor.

## Outside Employment and Teaching Activities
Full-time faculty and staff of Sukkur IBA University are strictly prohibited from engaging in employment or holding financial/business interests with any other organization, even on a part-time basis.
A faculty member may participate in unpaid teaching or knowledge sharing during non-working hours at other academic institutions for professional development and societal contribution, but is not permitted to retain any form of remuneration.

## Employment and Supervision of Relatives
Having relatives (by blood, marriage, or adoption) employed at the University does not bar hiring or promotion based on merit. However:
1. No employee shall be under the direct supervision or administrative control of a relative.
2. Relatives are strictly prohibited from participating in peer review, hiring, evaluation, salary determination, or promotion committees affecting a relative.
3. In departments where an HoD or supervisor is related to a staff member, an alternate higher authority is designated to handle appraisals and decisions.`
  },
  {
    filename: '04_sibau_smoke_free_and_harassment_policy.md',
    title: 'Sukkur IBA University Smoke-Free and Sexual Harassment Policies',
    docId: 'SIBAU-SEC-02.3-4',
    owner: 'Registrar Office & Career Development Center',
    version: '2018.1',
    content: `# Sukkur IBA University Smoke-Free and Sexual Harassment Policies
Document ID: SIBAU-SEC-02.3-4 | Owner: Registrar Office & Career Development Center | Version: 2018.1

## Smoke-Free Campus Policy
Sukkur IBA University maintains a completely smoke-free campus environment 24 hours a day, 7 days a week.
Smoking and tobacco use—including cigarettes, electronic cigarettes, cigars, hookah, and smokeless/chew tobacco—is strictly prohibited:
1. In all buildings owned, occupied, or leased by SIBAU.
2. In all University vehicles.
3. In all outdoor campus areas, including parking lots, walkways, and congregate zones.
Complaints regarding employee violations should be lodged with the Registrar Office / HRM Section. Complaints regarding student violations should be directed to the Career Development Center (CDC).

## Sexual Harassment Policy (HEC Guidelines)
Sukkur IBA University strictly implements the Higher Education Commission (HEC) of Pakistan Policy Guidelines Against Sexual Harassment in Institutions of Higher Learning.
The University guarantees prompt, fair, judicious, and confidential handling of all complaints to ensure an educational and work environment free from intimidation, hostility, or offensive behavior. Complete guidelines and complaint redressal procedures comply with federal HEC mandates.`
  },
  {
    filename: '05_sibau_recruitment_and_selection.md',
    title: 'Recruitment, Selection, and Appointment Policy',
    docId: 'SIBAU-HR-03.1',
    owner: 'Human Resource Management / Registrar Office',
    version: '2018.1',
    content: `# Recruitment, Selection, and Appointment Policy
Document ID: SIBAU-HR-03.1 | Owner: Human Resource Management / Registrar Office | Version: 2018.1

## Appointment Rules and Merit
Sukkur IBA University provides equal employment opportunity regardless of sex, religion, race, caste, color, or domicile. Selection is based purely on merit, qualifications, and demonstrated competency.
- Minimum age for employment is 18 years.
- Possession of a valid Computerized National Identity Card (CNIC) is mandatory before an offer letter is issued.
- Retirement age is 60 years. In public interest, with the Vice Chancellor's consent and physical fitness certification, an employee may be re-employed beyond 60 for periods not exceeding 2 years at a time.
- Employees on Leave Preparatory to Retirement (LPR) or active service cannot accept salaried outside work without prior written permission from the Vice Chancellor.

## Faculty Cadres and Probation
Faculty positions comprise Professors, Associate Professors, Assistant Professors, Lecturers, and Lab Engineers.
- Initial appointment is on probation for 2 years. Upon satisfactory review by the Vice Chancellor, the appointment is confirmed, with service counted from the initial appointment date.
- The Vice Chancellor may extend probation by 1 additional year if needed.
- Fixed-term contract appointments cannot exceed 6 months without Senate-approved conditions.

## Professional and Non-Teaching Staff Cadres
Professional staff includes Statutory Officers (VC, Pro-VC, Deans, Directors, Registrar, Treasurer, Controller of Examinations, Internal Auditor, Chief Librarian) and other staff categorized into BPS-17 & above and BPS-16 & below.
- Initial appointment is on probation for 2 years prior to confirmation.
- The Vice Chancellor appoints employees in BPS 1 to 16.

## Selection Board and Selection Committee
Appointments for Faculty and Officers (BPS-17 and above) are recommended by the University Selection Board, chaired by the Vice Chancellor, and comprising the Chairman/Nominee of Sindh Public Service Commission, Secretary of Education, Senate nominees, and subject matter experts.
Appointments for BPS 1 to 16 are processed by the Selection Committee, chaired by the Vice Chancellor and including the Registrar, Senior Faculty members, and Section Heads.

## Contract Staff and Fixed Cadre Rules
1. Fixed Term Contracts (FTC) for new joiners begin from the joining date and end on November 30th of the current year to standardize annual performance reviews.
2. Fixed cadre employees receive a fixed salary with annual increments effective December 1st, provided they were appointed before July 1st (minimum 6 months of service in the calendar year).
3. Contract interns are engaged for a maximum period of 1 year without tenure extension.
4. Visiting faculty are hired based on department needs, formal CV evaluation, and teaching demonstration before the Selection Committee.`
  },
  {
    filename: '06_sibau_placement_and_working_hours.md',
    title: 'Placement Procedure and Working Hours Policy',
    docId: 'SIBAU-HR-03.2',
    owner: 'Human Resource Management / Registrar Office',
    version: '2018.1',
    content: `# Placement Procedure and Working Hours Policy
Document ID: SIBAU-HR-03.2 | Owner: Human Resource Management / Registrar Office | Version: 2018.1

## Placement and Onboarding Steps
1. **Offer and Contract**: Issued by the Registrar Office / HR Department with comprehensive appointment terms.
2. **Medical Fitness**: Candidates must undergo pre-employment physical examination addressed to the Senior Civil Surgeon.
3. **Clearance and Testimonials**: New hires must submit relieving letters/No Dues from previous employers and attested copies of educational certificates.
4. **Biometric Registration**: Employees must register their fingerprint on attendance terminals to obtain biometric and door access credentials.
5. **ID Card and Email**: Employees receive photo ID cards and official email accounts (\`xyz@iba-suk.edu.pk\`) for all official correspondence.
6. **New Employee Orientation (NEO)**: Arranged by HR to familiarize new joiners with university benefits, culture, and facilities.

## Standard Working Hours
- **Work Week**: 48 hours per week, 8 hours each day, Monday through Saturday.
- **Office Timings**: 9:00 A.M. to 5:00 P.M.
- **Prayer and Lunch Breaks**:
  * Monday to Thursday & Saturday: 30-minute break for Zohar prayer and lunch.
  * Friday: 2-hour break from 12:30 P.M. to 2:30 P.M. for Juma prayer and lunch.

## Flexible Working Hours (Flexi-Time)
With prior written approval of the Department Head and Registrar Office/HR Department:
- Morning start window: 7:30 A.M. to 8:00 A.M.
- Evening end window: 3:30 P.M. to 4:00 P.M.
Once flexi-time is selected, the employee cannot deviate from the approved band.`
  },
  {
    filename: '07_sibau_attendance_and_good_attendance_reward.md',
    title: 'Attendance Policy and Good Attendance Rewards',
    docId: 'SIBAU-HR-03.3',
    owner: 'Human Resource Management Section',
    version: '2018.1',
    content: `# Attendance Policy and Good Attendance Rewards
Document ID: SIBAU-HR-03.3 | Owner: Human Resource Management Section | Version: 2018.1

## Grace Period and Late Arrival Penalties
All staff must register their arrival and departure daily on the biometric attendance terminals.
- **15-Minute Grace**: Arrival within 15 minutes of scheduled start is permitted to accommodate occasional transit delays.
- **Late 15 Minutes to 2 Hours**: Deduct 1/4 day of Casual Leave. If casual leave balance is zero, deduct from Earned Leave; if earned leave is exhausted, deduct 1/4 day's basic salary.
- **Late 2 to 4 Hours**: Deduct 1/2 day of Casual or Earned Leave, or 1/2 day's salary.
- **Late Exceeding 4 Hours / Unnotified Absence**: Marked 'absent'; deduct 1 full day of casual leave, earned leave, or leave without pay.
- **Monthly Late Limit**: An employee can be marked late up to a maximum of 7 times per calendar month. Exceeding 7 late comings results in an official Explanation Call.
- **Sandwich Leaves**: Unauthorized leave immediately preceding or succeeding Sundays and Gazetted holidays is treated as absence.

## Good Attendance Monthly & Quarterly Reward Scheme
To motivate punctual workplace attendance, employees with zero absences and zero availed leave in a month earn reward points:
1. **Grades 1 to 15 (and contract equivalents)**:
   - Monthly: 1 point awarded, worth Rs. 150 cash reward.
   - Quarterly: If 3 points are earned in a quarter, an additional bonus of Rs. 450 is awarded (over and above monthly rewards).
2. **Grade 16 and Above**:
   - Monthly: 1 point awarded, worth Rs. 300 cash reward.
   - Quarterly: If 3 points are earned in a quarter, an additional bonus of Rs. 900 is awarded.`
  },
  {
    filename: '08_sibau_separation_and_resignation.md',
    title: 'Separation and Resignation Procedures',
    docId: 'SIBAU-HR-03.4',
    owner: 'HR Department / Payroll Section',
    version: '2018.1',
    content: `# Separation and Resignation Procedures
Document ID: SIBAU-HR-03.4 | Owner: HR Department / Payroll Section | Version: 2018.1

## Resignation Notice Period
- Confirmed employees and faculty who have completed probation must provide at least one (1) month's advance written notice of resignation, or forfeit one month's salary in lieu thereof.
- Employees can utilize their accrued Earned Leave balance to cover the notice period duration.
- If earned leave is insufficient and notice cannot be served, the employee must deposit an amount equivalent to the salary for the unserved notice duration.

## Handover and Clearance Process
1. The resigning employee must submit handover notes and transfer charge of records, keys, and university assets to the nominated colleague.
2. Obtain departmental clearance through the official No Dues Form (Library, Accounts, Store, IT, Department).
3. Complete the confidential Exit Interview Questionnaire with the HR Department.
4. The Registrar Office issues the Relieving Order and Experience Certificate. Settlement of final gratuity and dues is processed by Payroll upon complete clearance.

## Termination during Probation or for Disciplinary Cause
- Services during probation may be terminated by the University without prior notice or salary in lieu thereof.
- In cases of termination or dismissal based on Efficiency & Disciplinary inquiry or misconduct, experience letters are not provided.`
  },
  {
    filename: '09_sibau_lien_policy.md',
    title: 'Lien Acquisition, Retention, and Termination Policy',
    docId: 'SIBAU-HR-03.5',
    owner: 'Registrar Office / Senate',
    version: '2018.1',
    content: `# Lien Acquisition, Retention, and Termination Policy
Document ID: SIBAU-HR-03.5 | Owner: Registrar Office / Senate | Version: 2018.1

## Acquisition of Lien
Regular, confirmed employees with at least five (5) years of continuous satisfactory service at Sukkur IBA University may apply for a lien to take up higher or equivalent positions in public sector organizations.
- Initial lien period is one (1) year, extendable up to a maximum total of three (3) years.
- The applicant must have completed probation, have no pending disciplinary penalties, and apply through proper channels with Vice Chancellor approval.

## Retention and General Principles
1. An employee retains their lien while serving in an approved outside public organization, on approved leave, or during temporary suspensions.
2. Lien is treated as leave without pay; salary and internal university benefits are suspended during the lien duration.
3. The employee must continuously deposit their Provident Fund contributions into the University account. Any disruption or lump-sum catchup is disallowed.
4. Gratuity does not accrue during the lien period.
5. On completion of the lien, the employee must report back at least one (1) month prior to the expiry date. Failure to report results in disciplinary termination.`
  },
  {
    filename: '10_sibau_comprehensive_leave_policy.md',
    title: 'Comprehensive Leave Policy (Earned, Sick, Casual, Maternity, Sabbatical, LPR)',
    docId: 'SIBAU-HR-03.6',
    owner: 'People Operations / Registrar Office',
    version: '2018.1',
    content: `# Comprehensive Leave Policy
Document ID: SIBAU-HR-03.6 | Owner: People Operations / Registrar Office | Version: 2018.1

## 1. Earned Leave (Annual Leave)
- **Entitlement**: 30 calendar days per year, accruing at 2.5 days per month of service.
- **Eligibility**: Normally availed after 1 year of regular service.
- **Accumulation**: Accrues without limit and does not lapse.
- **Encashment (Non-Teaching Staff)**: Allowed up to a maximum of 345 days of accumulated leave at the time of retirement or resignation.
- **Teaching Staff Restrictions**: Regular faculty are not permitted to encash leave unless engaged by the University during semester breaks. Faculty may only take earned leave during semester breaks (except in medical emergencies).
- **Advance Leave**: Up to 30 days of unearned leave may be advanced at the Vice Chancellor's discretion.

## 2. Sick Leave
- **Entitlement**: 10 working days paid sick leave per calendar year. Pro-rated for employees joining mid-year.
- **Medical Certificate**: If sick leave exceeds 2 consecutive days, a medical certificate from a PMDC-registered physician must be submitted on the 3rd day.
- **Rules**: Cannot be encashed or accumulated; lapses at year-end.

## 3. Casual Leave
- **Entitlement**: 10 working days per year (accrues at 0.8 days per month).
- **Usage**: For sudden personal emergencies, family obligations, or severe weather conditions.
- **Limits**: Maximum 3 consecutive days at a time. Taking more than 3 consecutive days automatically converts the leave into annual earned leave. Lapses at year-end without encashment.

## 4. Maternity Leave
- **Entitlement**: 90 days with full pay without debiting annual leave (45 days prenatal, 45 days postnatal from delivery date).
- **Eligibility**: Female employees with at least 1 year of continuous service at SIBAU.
- **Frequency**: Granted up to a maximum of three (3) times during the entire service career. Subsequent maternity leaves are deducted from accrued annual leave.

## 5. Conference Leave
- Full-time faculty are entitled to up to 15 working days per year with full pay (inclusive of travel time) to present research papers, deliver invited lectures, or attend approved academic conferences.

## 6. Compensatory Leave
- Granted to staff not entitled to overtime who perform official work on public holidays or weekends. Must be availed within two (2) months. Cannot be accumulated or encashed.

## 7. Sabbatical Leave
- **Eligibility**: Full-time faculty at Assistant Professor rank and above with at least six (6) consecutive years of full-time service.
- **Duration and Pay**: Granted for up to one (1) academic year (spring, summer, fall semesters) with 75% of basic salary paid.
- **Frequency**: May be taken once every 6 years. Leave accrual pauses during sabbatical.

## 8. Leave Preparatory to Retirement (LPR)
- Maximum period is 365 days on full pay or half pay. Employees with qualifying service can opt to encash LPR up to a maximum of 180 days in lieu of taking leave.`
  },
  {
    filename: '11_sibau_housing_and_hostels.md',
    title: 'Residential Accommodation and Hostel Allotment Policy',
    docId: 'SIBAU-HR-03.7-8',
    owner: 'Provost Office / Estate Office',
    version: '2018.1',
    content: `# Residential Accommodation and Hostel Allotment Policy
Document ID: SIBAU-HR-03.7-8 | Owner: Provost Office / Estate Office | Version: 2018.1

## Housing Allotment in University Colony
Residential bungalows and quarters are allotted based on grade entitlement and merit points:
- **Grade 1 to 4**: "D" Type Quarter
- **Grade 5 to 10**: "C" Type Quarter
- **Grade 11 to 14**: "B" Type Quarter
- **Grade 15 to 16**: "A" Type Quarter
- **Grade 17**: "D" Type / Category-IV Bungalow
- **Grade 18 & 19**: "C" Type / Category-III Bungalow
- **Grade 20, 21 & Above**: "A" Type / Category-I Bungalow

### Merit Points Formula
1. One (1) point per Grade level.
2. One (1) point for each completed year of service at SIBAU.
3. One (1) point per year of colony residence (or per year since application date for non-residents).

### Rent and Utilities
- Allotted employees forfeit their monthly House Rent Allowance (HRA).
- No extra maintenance charges are deducted.
- Electricity is billed via individual sub-meters at standard WAPDA domestic tariffs.
- Sui Gas is billed via sub-meters at actual domestic consumption rates.

## Hostels Allotment Policy
Faculty and staff not belonging to Sukkur or its immediate suburbs are eligible for hostel rooms:
- **BPS-17 & Above**: Considered for Faculty/Staff and Family Hostels (subject to availability).
- **Below BPS-17**: Accommodated in Staff Hostels. Single/bachelor employees share double rooms.
- Merit formula evaluates grade, length of service, and distance of native hometown from Sukkur.

## House Acquisition Rental Ceilings (Table 3.5)
For employees living outside in rented accommodation with approval:
- BPS 1-2: Rs. 3,254 | BPS 3-6: Rs. 5,083 | BPS 7-10: Rs. 7,594
- BPS 11-13: Rs. 11,455 | BPS 14-16: Rs. 14,391
- BPS 17-18: Rs. 19,049 | BPS 19: Rs. 25,326 | BPS 20: Rs. 31,806
- BPS 21: Rs. 38,084 | BPS 22: Rs. 45,576`
  },
  {
    filename: '12_sibau_loans_and_financial_advances.md',
    title: 'Vehicle, Laptop, and Employee Loan Policies',
    docId: 'SIBAU-HR-03.9-10-25',
    owner: 'Treasurer / Finance Department',
    version: '2018.1',
    content: `# Vehicle, Laptop, and Employee Loan Policies
Document ID: SIBAU-HR-03.9-10-25 | Owner: Treasurer / Finance Department | Version: 2018.1

## 1. Employees Vehicle Loan Scheme (Grade 17+)
- **Eligibility**: All academic and non-academic officers in Grade 17 and above with at least 3 continuous years of satisfactory service and a gross salary not less than Rs. 30,000/month.
- **Conditions**: Applicable only for the purchase of New Vehicles.
- **Loan Pool Allocation**: Total fund of Rs. 5.0 Million (Grade 17-18: Rs. 1.0M; Grade 19: Rs. 2.0M; Grade 20+: Rs. 2.0M).
- **Repayment Terms**: Principal amount plus 5% service charges compounded annually, recoverable in 48 equal monthly installments deducted from salary.
- **Installment Cap**: Each installment cannot exceed 25% of the employee's monthly take-home pay.
- **Repayment Start**: First installment becomes due on the 61st day following loan disbursement.

## 2. Laptop Loan Policy (Faculty)
- **Eligibility**: All regular full-time faculty members.
- **Entitlement**: Interest-free loan of Rs. 60,000 (Sixty Thousand Rupees) provided one-time during service.
- **Repayment**: Recoverable in twelve (12) equal monthly salary installments. Purchase is facilitated through the University Purchase Department with receipt verification.

## 3. General Employee Loan Policy (3 Gross Salaries)
- **Eligibility**: Regular employees and contractual staff with at least two (2) years of continuous service.
- **Entitlement**: Loan amount up to three (3) Gross Salaries.
- **Repayment**: Recoverable in twenty-four (24) equal monthly deductions from payroll. Application is endorsed by the HoD and approved by the Vice Chancellor.`
  },
  {
    filename: '13_sibau_provident_fund_and_gratuity.md',
    title: 'Contributory Provident Fund and Gratuity Statutes',
    docId: 'SIBAU-HR-03.11-19',
    owner: 'Provident Fund Foundation & Finance Department',
    version: '2018.1',
    content: `# Contributory Provident Fund and Gratuity Statutes
Document ID: SIBAU-HR-03.11-19 | Owner: Provident Fund Foundation & Finance Department | Version: 2018.1

## Contributory Provident Fund (CPF)
- **Subscription Rate**: A mandatory deduction of 10% of running basic pay is made monthly from each subscriber.
- **University Matching Contribution**: Sukkur IBA University matches 100% of the employee's contribution (equal 10% amount) monthly.
- **Vesting**: The employee becomes entitled to the University's matching contribution after completing one (1) year of service without disciplinary removal.
- **Advances from PF**:
  1. For medical treatment, children's education, or marriage/funeral: up to 50% of personal contribution, recoverable in up to 24 equal installments.
  2. For house construction or plot purchase: up to 80% of total balance (personal + employer contribution), recoverable in up to 36 equal installments.
  3. No new advance is permitted until 6 months after full settlement of a previous advance.
- **Annual Statement**: Each subscriber receives an official statement of accounts by August 31st each year.

## Employees Gratuity Scheme
- **Eligibility**: All regular and long-term contract employees with a minimum of two (2) years continuous service. Continuous service requirement is waived in case of death, medical incapacitation, or marriage of female employees.
- **Gratuity Rate**: One (1) month's Gross Salary for each completed year of service (pro-rated monthly).
- **Gross Salary Components**: Basic Pay + House Rent Allowance + Utilities (excludes conditional allowances like overtime or conveyance).
- **Nomination**: Employees submit a Gratuity Nomination Form upon joining to designate beneficiaries.`
  },
  {
    filename: '14_sibau_salary_benefits_and_tuition_fee.md',
    title: 'Salary, Overtime, Allowances, and Tuition Fee Concessions',
    docId: 'SIBAU-HR-03.13-24-26',
    owner: 'Payroll Section / People Operations',
    version: '2018.1',
    content: `# Salary, Overtime, Allowances, and Tuition Fee Concessions
Document ID: SIBAU-HR-03.13-24-26 | Owner: Payroll Section / People Operations | Version: 2018.1

## Salary Payment and Annual Increments
- Salaries are disbursed via direct bank transfer before the final working day of each calendar month.
- **Annual Increment**: Effective December 1st each year. To qualify, newly appointed employees must join on or before June 1st of that year (minimum 6 months continuous service).
- Fixed-term staff may receive up to a 10% annual increment based on budget and performance.

## Overtime Allowance Formula (Grades 1 to 16)
Employees up to Grade 16 authorized in writing by their HoD to work beyond regular hours are compensated:
- **Regular Staff**: Hourly Rate = \`(2 * Basic Salary) / 150 hours\`
- **Contract Staff**: Hourly Rate = \`Monthly Gross Salary / 150 hours\`
- Maximum overtime: 2 hours per day and 48 hours per month (with VC approval).
- If working beyond 4 overtime hours on a single day, dinner and transport/taxi fare are provided.

## Qualification and Teaching Allowances
- **PhD Allowance**: Rs. 10,000/- per month for employees holding a recognized PhD degree.
- **MS / MPhil / M.E Allowance**: Rs. 2,500/- per month for professional staff holding an 18-year master's degree in their field of specialization.
- Allowances are admissible for one degree only (not cumulative) and pause during study leave.
- **Teaching Allowance**: Rs. 10,000/- per month for regular Lab Engineers (BPS-17) after 1 year of service.

## Tuition Fee Waiver Policies
1. **Full-Time Employees, Spouses, and Children (Admitted to SIBAU)**:
   - 100% tuition fee waiver granted after completing at least one (1) year of service at SIBAU.
2. **Employees Enrolling in Degree Programs at SIBAU**:
   - 50% tuition waiver after completing probation.
   - 100% tuition waiver after completing three (3) years of full-time service.
   - Part-time master's students may enroll in up to 2 courses per semester during work hours.
3. **Siblings of Employees**:
   - 50% tuition fee waiver in regular semester programs for brothers/sisters of active faculty and staff.`
  },
  {
    filename: '15_sibau_travel_and_accommodation_tada.md',
    title: 'Travelling and Daily Allowance (TA/DA) Policy',
    docId: 'SIBAU-HR-03.12',
    owner: 'Finance & Accounts Department',
    version: '2018.1',
    content: `# Travelling and Daily Allowance (TA/DA) Policy
Document ID: SIBAU-HR-03.12 | Owner: Finance & Accounts Department | Version: 2018.1

## Entitlements for Officers (BPS-17 and Above)
Applicable for official university travel outside Sukkur within Pakistan or abroad:
- **Grade 22 (Dean & Vice Chancellor)**: Domestic Air (Economy Plus), International Air (Business Class), 5-Star Hotel, Per Diem: Actual expenses (including mini-bar) OR Rs. 3,500 Daily Allowance (DA).
- **Grade 21 (Professors / Officers)**: Economy Plus domestic/intl, 5-Star domestic / 4-Star intl hotel, Actual Per Diem OR Rs. 3,500 DA.
- **Grade 19 & 20 (Associate & Assistant Professors)**: Economy air travel, 4-Star domestic / 3-Star intl hotel, Actual Per Diem OR Rs. 3,100 DA.
- **Grade 17 & 18 (Lecturers, Lab Engineers, Admin Officers)**: Economy air travel, 4-Star domestic / 3-Star intl hotel, Actual Per Diem OR Rs. 2,500 DA.
*Per Diem at actual covers breakfast plus two meals a day for the employee against original bills.

## Entitlements for Staff Below Grade 17
- **BPS 12–16**: Daily Allowance Rs. 1,400 | Lodging Allowance (Private) Rs. 1,400 | Hotel Reimbursement up to Rs. 2,800/night.
- **BPS 7–11**: Daily Allowance Rs. 1,000 | Lodging Allowance Rs. 1,000 | Hotel Reimbursement up to Rs. 2,000/night.
- **BPS 5–6**: Daily Allowance Rs. 780 | Lodging Allowance Rs. 780 | Hotel Reimbursement up to Rs. 1,560/night.
- **Below Grade 5**: Daily Allowance Rs. 620 | Lodging Allowance Rs. 620 | Hotel Reimbursement up to Rs. 1,240/night.

## Travel Modes and Transport SOPs
- **Train Travel**: BPS-17 & above travel in AC Sleeper; BPS-16 & below travel in Lower AC.
- **Road Travel**: BPS-17 & above may use rent-a-car (up to 1300cc) with VC approval; BPS-16 & below use AC Bus (Daewoo).
- **Airport / Railway Transfers in Sukkur**: Arranged directly by University transport.
- **Advances**: Cash advances must be submitted on advance forms; unadjusted balances outstanding beyond 90 days are deducted directly from salary.`
  },
  {
    filename: '16_sibau_training_and_study_leave.md',
    title: 'Training, Development, and Study Leave Policy',
    docId: 'SIBAU-HR-03.15-22',
    owner: 'Registrar Office / Executive Development Center',
    version: '2018.1',
    content: `# Training, Development, and Study Leave Policy
Document ID: SIBAU-HR-03.15-22 | Owner: Registrar Office / Executive Development Center | Version: 2018.1

## Training and Development
- Annual Training Needs Assessment (TNA) is conducted by the HR Department for all staff cadres.
- **Replica Presentation Obligation**: Any employee returning from external training must submit a comprehensive training report and deliver a replica training presentation to university colleagues within three (3) days of return.

## Study Leave and Service Surety Bonds
Full-time regular employees may be granted study leave for up to a maximum of four (4) years with prior Vice Chancellor approval:
- **Faculty Eligibility**:
  * Minimum 3 years regular service: study leave granted with **full pay**.
  * Less than 3 years service: study leave granted **without pay** (converts to leave with pay after completing 3 years total service).
- **Non-Teaching Staff Eligibility**:
  * Minimum 5 years regular service: study leave with **full pay**.
  * Less than 5 years service: study leave **without pay**.

### Mandatory Service Surety Bond Schedule
Employees proceeding on study leave with pay must sign a legal surety bond to serve Sukkur IBA University upon completion:
- **1-Year Study Leave**: 1 year and 6 months bond.
- **2-Year Study Leave**: 2 years and 6 months bond.
- **3-Year Study Leave**: 4 years bond.
- **4-Year Study Leave**: 5 years bond.
Breach of the surety bond obligates the employee to refund all salaries, tuition fees, stipends, and airfares paid by the University. Priority destinations focus on Top 100 QS-ranked universities (US Knowledge Corridor & Fulbright schemes).`
  },
  {
    filename: '17_sibau_promotion_policy_non_teaching.md',
    title: 'Non-Teaching Staff Promotion Statutes and Seniority',
    docId: 'SIBAU-HR-03.21',
    owner: 'Registrar Office / Promotion Committee',
    version: '2018.1',
    content: `# Non-Teaching Staff Promotion Statutes and Seniority
Document ID: SIBAU-HR-03.21 | Owner: Registrar Office / Promotion Committee | Version: 2018.1

## Promotion Structure and Evaluation Weightages
Covers non-teaching management staff in BPS-16 through BPS-22. The Promotion Committee (PC), chaired by the Vice Chancellor, convenes twice annually in March and September.
Evaluation scoring uses the following criteria:
1. **Performance Record (PERs)**: 60% weightage (average of annual performance appraisals).
2. **Potential and Demonstrated Skills**: 20% weightage.
3. **Advanced Qualifications and Trainings**: 20% weightage.

## Schedule-II Minimum Length of Service for Promotion
- **Promotion from BPS-16 to BPS-17**: Minimum 5 years continuous service in BPS-16.
- **Promotion from BPS-17 to BPS-18**: Minimum 5 years continuous service in BPS-17.
- **Promotion from BPS-18 to BPS-19**: 7 years continuous service in BPS-18, or 12 years continuous service in BPS-17 & above.
- **Promotion from BPS-19 to BPS-20**: 5 years continuous service in BPS-19, or 17 years in BPS-17 & above.
- **Promotion from BPS-20 to BPS-21**: 5 years continuous service in BPS-20, or 22 years in BPS-17 & above.
- **Promotion from BPS-21 to BPS-22**: 5 years continuous service in BPS-21, or 25 years in BPS-17 & above.

## Promotion Salary Increase Formula
Promoted staff receive a salary increase equal to the difference between their current salary and the minimum of the new pay scale, OR a promotional increment of **5% of current gross salary**, whichever is higher.`
  },
  {
    filename: '18_sibau_grievance_handling_procedure.md',
    title: 'Employee Grievance Handling Procedure',
    docId: 'SIBAU-HR-03.17',
    owner: 'Grievance Committee / Registrar Office',
    version: '2018.1',
    content: `# Employee Grievance Handling Procedure
Document ID: SIBAU-HR-03.17 | Owner: Grievance Committee / Registrar Office | Version: 2018.1

## Purpose and Scope
Provides every employee the right to an internal review regarding unsatisfactory working conditions, alleged victimization, code of conduct issues, or interpersonal disputes. Matters of established University policy cannot be grieved.

## Grievance Committee Composition
Constituted by notification, comprising:
1. Registrar (Convener)
2. Vice Chancellor QEC (Member)
3. HoD Electrical Engineering (Member)
4. HoD Business Administration (Member)

## Procedure and Timelines
1. Employees are encouraged to seek informal resolution with their HoD or Registrar first.
2. If unresolved, a formal written petition is lodged with the Grievance Committee.
3. The Committee reviews documents, interviews involved parties, and submits recommendations to the Vice Chancellor within three (3) months.
4. Final settlement by the Vice Chancellor is completed within one (1) month of receiving recommendations.
5. Strict anti-retaliation protection is enforced for all employees who initiate grievances in good faith.`
  },
  {
    filename: '19_sibau_general_procedures_advances_procurement.md',
    title: 'Financial Advances, Procurement, and Petty Cash Procedures',
    docId: 'SIBAU-FIN-04.1-4',
    owner: 'Procurement & Finance Departments',
    version: '2018.1',
    content: `# Financial Advances, Procurement, and Petty Cash Procedures
Document ID: SIBAU-FIN-04.1-4 | Owner: Procurement & Finance Departments | Version: 2018.1

## Advances Acquisition and Settlement
- Maximum advance amount for an official activity is Rs. 100,000/- (exceptions require special VC approval).
- Advances must be settled within two (2) weeks of activity completion on the Settlement of Advance (SoA) proforma.
- Mandatory annual rule: All outstanding advances must be cleared before the close of the financial year on June 30th; failure to settle results in salary withholding.

## Expense Reimbursements
- Claims must be submitted on Request for Reimbursement (RR) forms with original vouchers within one (1) week of completing an activity. Claims older than 30 days are not entertained.

## Procurement Guidelines (Purchases > Rs. 25,000)
- Purchases exceeding Rs. 25,000 for equipment, consumables, or civil works must be routed through the Procurement Department in compliance with Sindh Public Procurement Regulatory Authority (SPPRA) rules.
- Signed comparative statements from 4–5 Purchase Committee members and VC approval are mandatory.

## Petty Cash Payments
- Payments up to Rs. 5,000/- may be made via Petty Cash against printed, stamped cash memos.
- Handwritten ("Kacha") bills are discouraged and permitted only up to Rs. 500/- with HoD counter-approval.`
  },
  {
    filename: '20_sibau_transport_sops_and_point_buses.md',
    title: 'Transport SOPs, Night Emergency Bolan, and Point Buses',
    docId: 'SIBAU-TRN-04.7',
    owner: 'Transport Section / Registrar Office',
    version: '2018.1',
    content: `# Transport SOPs, Night Emergency Bolan, and Point Buses
Document ID: SIBAU-TRN-04.7 | Owner: Transport Section / Registrar Office | Version: 2018.1

## Official Duty Requisitions
Staff requiring university vehicles for pre-planned official duties during office hours (9:00 AM to 5:00 PM) must intimate the Transport In-charge at least 24 hours in advance.

## Night Emergent Transport (Carry Bolan Facility)
- To assist students and residential staff in emergency medical situations at night, a dedicated Suzuki Carry Bolan ambulance/vehicle operates from 7:00 P.M. to 7:00 A.M.
- Two drivers remain on duty throughout the night. Hostel students contact their warden, who coordinates with the Transport In-charge.

## Non-Emergent Point Bus City Schedule
Scheduled point buses run to Sukkur city for shopping and personal errands:
1. **Point Bus for Employees & Staff**: Every Wednesday and Sunday from 6:00 P.M. to 9:00 P.M.
2. **Point Bus for Girl Students**: Every Thursday from 6:00 P.M. to 9:00 P.M.
Private personal vehicle use is strongly discouraged and permitted only under exceptional justified circumstances.`
  },
  {
    filename: '21_sibau_research_policy_and_case_studies.md',
    title: 'ORIC Research Policy, Publication Cash Rewards, and Case Studies',
    docId: 'SIBAU-RES-04.8-9',
    owner: 'Office of Research, Innovation and Commercialization (ORIC)',
    version: '2018.1',
    content: `# ORIC Research Policy, Publication Cash Rewards, and Case Studies
Document ID: SIBAU-RES-04.8-9 | Owner: Office of Research, Innovation and Commercialization (ORIC) | Version: 2018.1

## ORIC Research Mandate
The Office of Research, Innovation and Commercialization (ORIC) manages university R&D. Faculty members (Professors, Associate Professors, Assistant Professors) must submit at least one (1) research funding proposal per calendar year.
Failure to submit proposals leads to advisory notes in year 1, stopping of annual increments in year 2, and service review in year 3.
External consultancy earnings: 80% to Principal Investigator (PI) & team; 20% to University R&D Fund.

## Journal Publication Cash Rewards
Sukkur IBA University awards cash prizes for research papers published in recognized journals under the university affiliation:
- **Category 'A' Journal (Impact Factor / ISI Indexed listed in JCR)**: Rs. 150,000 cash reward.
- **Category 'B' Journal (HEC recognized listed in JCR without IF)**: Rs. 100,000 cash reward.
- **Category 'C' Journal (HEC X & Y categories, Scopus Indexed)**: Rs. 30,000 cash reward.
- **Best Researcher of the Year Award**: Annual cash prize of Rs. 200,000 and VC certificate of honor.
- **Conference Travel Grants**: Applications must be submitted to ORIC at least 8 weeks prior to conference dates.

## Case Study Research Center & Rewards
SIBAU is a pioneer in case-method teaching (second in Pakistan after LUMS). Case studies are recognized for promotion to Assistant Professor, Associate Professor, and Professor.
Publication cash prizes for Case Studies:
- **Tier-I Case Journals (ISI / Impact Factor, NACRA, Asian Case Research Journal, etc.)**: Rs. 100,000 cash reward.
- **Tier-II Case Journals (Peer-reviewed from Taylor & Francis, Sage, Emerald, Wiley, Elsevier)**: Rs. 70,000 cash reward.
- **Tier-III Case Journals (HEC recognized Pakistani journals)**: Rs. 30,000 cash reward.
- Case consultancy earnings: 60% to PI & team; 40% to SIBAU R&D Fund.`
  }
];

policies.forEach((p) => {
  const filePath = path.join(DATASET_DIR, p.filename);
  fs.writeFileSync(filePath, p.content.trim(), 'utf-8');
  console.log(`Created: ${p.filename}`);
});

console.log(`\n✅ Successfully generated ${policies.length} Sukkur IBA University Employee Handbook policy documents in ${DATASET_DIR}`);
