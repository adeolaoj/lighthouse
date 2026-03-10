## What Went Well?

* Team communication was strong throughout the iteration   
  * Our Slack group chat was very active, with team members regularly asking questions, answering questions, and sharing important information. This kept us all on the same page throughout the iteration.  
* We held multiple in-person collaborative meetings throughout the two-week iteration  
  * These sprints were at least 2 hours long (sometimes upwards of ten hours) and allowed us to work on the project together, which minimized miscommunication and streamlined GitHub issues that had dependencies or needed to be integrated   
  * Our meetings were especially helpful for debugging code and solving more complex technical issues as a group  
* The database schema is well-aligned with the frontend and backend code. (i.e. web-scraped data’s schema and the schema stored in the backend in Convex are well-aligned, allowing the transition of data from web-scraping to Convex to be relatively smooth)


## What Was Frustrating or Slow?

* Some GitHub issues felt repetitive or seemed like they should have been part of other existing issues.  
* We underestimated the scope of Iteration 1 in our initial planning. While we created issues for core features, we overlooked infrastructure requirements like deployment and CI/CD setup, causing us to work to the last minute.   
  * In retrospect, we should have set and followed a team deadline that was two days before the official deadline. This would allow for completing bug fixes and deployment.  
* Often, we did not fully understand how another member’s part of the project was implemented until we began debugging or integrating the code during our work sessions.  
* We will need to shift our tool usage from one to another after some parts of the project is already built (e.g. using puppeteer for iteration1 but will decide to switch to playwright instead for iteration 2\) due to some lack of research on tools functionalities before we start writing the code  
  * The Agile Workflow allows for such changes, but they can be stressful.   
  * In retrospect, we should’ve written short research documents comparing the pros and cons of each tool/framework we would be using before starting to code.  
* Initially, some artifacts (e.g. `/node\_modules`) that shouldn’t have been pushed to git were pushed, causing the need for manual deletion of repetitive artifacts before other team members started working on a new branch.   
  * In retrospect, when we were adding commands to package.json files to install things that shouldn’t be pushed, we should have updated the `.gitignore` in the same pull request to avoid confusion.  
* We underestimated both the scope and timing of testing. Rather than building tests incrementally alongside features, we added testing to the iteration plan as an afterthought. This resulted in a rushed testing phase at the end that revealed many bugs that we could have been caught weeks earlier. We need to shift testing earlier in our development cycle and treat it as concurrent work.  
* We also feel like we took on too much, mostly because we underestimated the amount of work each feature and task required.  
  * For example, webscraping with Puppeteer took the entire two weeks to implement, and we had to delay implementing our periodic scrapping functionality to iteration two. 
  * Similarly, we underestimated how much work was required to deploy our project using GitHub issues. 


## What Specific Changes Will We Try in the Next iteration? 

* Improve code transparency during in-person work sessions to ensure the team understands not just what each person is building, but how they are implementing each feature or task  
  * At the start and end of each in-person work session, each person will give a brief code walkthrough covering what they're currently implementing, key design decisions they've made, and where they need help. This ensures the team understands not just what is being built but how, reducing integration surprises later.  
* Review GitHub issues more carefully before creating them to reduce duplicate or overlapping tasks; this involves setting aside more time to review our roadmap at the beginning of each iteration and fully communicating on what each member is focusing on.   
  * We will spend 30 minutes to 60 minutes on the first day of each iteration creating our GitHub issues together and reviewing any potential redundant issues before anyone starts work. 
