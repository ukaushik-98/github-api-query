Project: 
- Connect to the Github API and fetch all public repos from Google. 
- Includes 2 routes:
    1. GET '/v1/google/repositories': retrieves data and displays on page as JSON.
    2. PUT '/v1/google/repositories/to_file': retrieves data and dumps into 'tmp/knock_interview.json.gz'.

Tools Used:
- Environment: Ubuntu via WSL (Windows subsystem for Linux)
- Postman: to run routes + test backend

Design Ideas:
- Create a simple Vanilla NodeJS REST server that fetches the required data.
- No need to authenticate for initial creation - just need the project up and running.
- Query for number of repos from entity (Google) and then execute loop over the paginated data. 


Potential Points of Faliures:
- API Rate Limit: without authentication there is a ceiling for how many calls allowed.
- Bady query: malformed query results in errors overall.
- File Deletion: possible that route failed but file still deleted. Causes future calls to PUT to fail.
    - Proposed solution: Transactions!
- Pagination: Hard limit of 100 per page


Optimizations:
- Introduce child threads when shooting calls API calls for repo.
    - Order will not be mantained but the parrallel requests will increase run time.
    - Still O(n) complexity logically but parallel execution enables slightly faster results
    - Drawbacks/Concerns:
        - Bad promise handling could cause faliures
        - Bandwith limit


Future Additional Features:
- As scale of project increases introduce framework such as Express to manage routes.
- Use tools such as node-fetch to simplify http requests.
- Authenticate user to allow greater API Rate Limit.
- Abstract entity of who the query should be fetching info for to expand from just Google.
- Introduce something like transactions where faliure reverts the project back to previous state. 

