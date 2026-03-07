
# Product Requirements: lighthouse

## Functional Requirements

### **Essential (Must-Have)**

* Users can log in via Google OAuth.   
* Users can upload and update their personal profiles (such as resumes, courses taken, and research focus preferences).  
  * Users can manually enter relevant courses; resumes will be uploaded as a PDF, and relevant information will be extracted using an LLM  
* The system will conduct a semantic search by web scraping through Hopkins’ official Computer Science department websites for Computer Science and LCSR department websites for Robotics research opportunities, storing them in a database.   
* The system maintains up-to-date information about Hopkins' research opportunities.  
* Users can perform personalized searches for opportunities and use a chat interface to refine search results.  
* The system can sort and list up to 10 opportunities, with explanations of why each opportunity matches, skill gap identification, and Hopkins course suggestions to increase compatibility.  
* The system extracts features from a user’s resume, including projects, work experience, technical and soft skills, college grade level, and extracurricular activities. This information, along with user-specified interests and saved preferences, is used to match users to research opportunities.  
* When a user performs a search, the system categorizes opportunities that closely match the user’s interests, resume data, and prior experience as strong matches.  
* Users can view their saved opportunities on a saved searches page  
* Users can view information about research labs, including professors, required background, research focus, etc.  
* Users can view an overview of 3 saved opportunities and 3 matching labs/opportunities on a dashboard upon logging in.  
* The system will maintain a long-term memory of relevant resume data, courses, chat history, and preferences across sessions, and leverage this data to rank and generate personalized search results.

### **Non-Essential (Nice-to-Have)**

* Email-writing assistance for reaching out to labs.  
* Dashboard notification/search result label about new related opportunities.  
* Expand the scope of finding research opportunities in Hopkins departments other than Computer Science and Robotics.

### **Out of Scope (Won’t Have)**

* In-app applications for labs and jobs  
* Major-specific course planning agent   
* Email notifications when new labs appear  
* Mobile native application 

## Non-Functional Requirements

### **Performance**

* For information already stored in the system, the AI agent should respond to user prompts within 15 seconds. For information that requires the agent to perform a new web scrape, the AI agent should respond within a minute. Users will be notified that search results may be delayed.  
* Spotlight dashboard loads within 3 seconds.   
* Users will not experience disruptions if the user prompts the chatbot while the system is webscraping for new data.

### **Security**

* Users authenticate via OAuth 2.0 with Gmail.  
* API keys will be stored securely.

### **Privacy**

* Personal information presented on the user’s resume, such as personal home address, phone number, and grades, will go through chaining or evaluation loops to ensure that personal data is not stored.  
  * Sensitive personal information extracted from the user’s resume (e.g., home address, email, phone number, GPA) will be redacted before storage and will not be persisted in the system’s long-term memory.   
* Users can delete their accounts permanently. 

### **Usability**

* Users can use the web-app on both desktop and mobile browsers.  
* Users can start searching for research opportunities once they upload their resume. The rest of the onboarding process (inputting completed courses, adding user interests, etc) is optional and can be completed at the user’s discretion.   
* Undergraduate and Graduate students, including non-JHU affiliates who are interested in finding research opportunities at Hopkins, can use the app.

## Technology Stack

* **Frontend:** Typescript, React, TailwindCSS  
* **Backend:** Typescript, Convex, Vercel AI SDK  
* **Auth:** Google OAuth 2.0  
* **AI Services:** OpenAI API, Claude API  
* **External:** Puppeteer with Chrome MCP (Puppeteer-based MCP server for browser automation and debugging)  
* **Deployment:** Vercel or AWS  
* **Testing:** Vitest 
