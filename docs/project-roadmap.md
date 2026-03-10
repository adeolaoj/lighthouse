
# Product Roadmap: lighthouse

## Iteration 1:

**Dates:** Weeks 5-6  
**Goal:** Complete an AI workflow for web-scraping of Hopkins’ CS websites, and build a page for viewing the results of the web scrape.   
**Must-Have Features:** 

- A **results page** that allows users to **view research opportunities** scraped from Hopkins’ official Computer Science and LCSR department websites.  
  - Each opportunity in this tab should include relevant information about the lab, including professors, required background, research focus, etc.  
- An AI system that chunks, embeds, and stores web-scraped data in a database.  
- Google OAuth login.

**Nice-To-Have Features:** 

## Iteration 2:

**Dates:** Weeks 7-8
**Goal:** Complete the periodic scraping and data freshness system carried over from Iteration 1, migrate to an agentic Playwright scraping workflow, and build out the profile creation process.
**Must-Have Features:**

- Migrate the web scraping pipeline from Puppeteer to **Playwright**. The scraper should agentically decide which internal links to follow and which paths to skip based on relevance, given a starting URL. Scraped data is stored directly in Convex.
- A **scheduler** that periodically re-runs the scraping pipeline at a defined interval (e.g., monthly). Each scheduled run should be verifiable via logs.
- **Stale opportunity handling**: opportunities from source pages that no longer exist are removed or flagged after a scheduled run.
- An **onboarding screen** where users can create a personal profile (i.e., upload information such as resumes, courses taken, and research focus preferences) after logging in.
  - The extracted user data will be displayed to users for verification and modification before it is saved in the system.
  - Users will have the option to enter/adjust information manually.
- A **personal profile screen** that can be viewed and edited after the initial onboarding process.
- An agent that semantically extracts features from a user’s resume, including projects, work experience, technical and soft skills, college grade level, and extracurricular activities. The user’s data will be chunked and embedded into the AI’s long-term memory.
- The AI system **categorizes, matches, and sorts** opportunities that closely align with the user’s interests, resume data, and prior experience.

**Nice-To-Have Features:**

## Iteration 3:

**Dates:** Weeks 10-11  
**Goal:** A now personalized results page that takes information stored by the AI agent to display customized opportunities to the user, as well as options to save opportunities  
**Must-Have Features:** 

- A **results page** where users can view the sorted list of 10 recommended research opportunities obtained from the web scraping database.  
- A **saved opportunities** page that displays opportunities the user has manually saved from the results page.  
- A **dashboard** where users can view an overview of 3 saved opportunities and 3 matching opportunities.

**Nice-To-Have Features:** 

- Dashboard notification/search result label for new related opportunities from the most recent web scraping.

## Iteration 4:

**Dates:** Weeks 12-13  
**Goal:** A chatbot interface that allows users to converse with an agent to find relevant opportunities while saving and referencing chat history through long-term memory.  
**Must-Have Features:** 

- A chatbot interface where users can **personalize their search** results by conversing with an agent.   
- Users can **save and reference** their chat history.  
- AI agent enhanced to chunk and embed users' desired chat history (i.e., users manually click on a button to confirm saving chat history) into long-term memory.

**Nice-To-Have Features:** 

- Email-writing assistance for reaching out to labs.  
- Expand the scope of finding research opportunities in Hopkins departments other than Computer Science and Robotics.
