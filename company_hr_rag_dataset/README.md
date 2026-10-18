# Company HR RAG Dataset (20 documents)

This is a fictional training corpus created for RAG experiments. It is not an authentic policy set from a real company and must not be used as legal or HR guidance.

## Files
- 20 individual Markdown policy documents (`.md`)
- `ALL_20_COMPANY_HR_POLICIES.txt`, a combined text file for simple ingestion
- Topics include employee handbook, annual leave, sick leave, remote work, conduct, harassment, onboarding, performance, payroll, expenses, security, privacy, learning, travel, grievances, conflicts, feedback, assets, recruitment, and offboarding.

## Suggested RAG test questions
1. How many annual leave days are provided each year?
2. How far in advance should I request four consecutive days off?
3. Who should I notify about a suspected phishing email?
4. Can I upload company files to an unapproved AI tool?
5. What is the expected payroll date?
6. What information should an expense claim include?
7. How do I report a conflict of interest?
8. What should happen before an employee's last day?
9. How many remote days may an eligible employee request?
10. What should I do if I accidentally send personal data to the wrong recipient?
11. Is a performance rating a guarantee of a salary increase?
12. How quickly should People Operations acknowledge a routine concern?

## Usage
Upload the individual `.md` files or the combined `.txt` file to your RAG ingestion interface. If your loader supports metadata, keep the source filename and document ID for citations.
