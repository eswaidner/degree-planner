# Degree Planner
Degree Planner is a web application designed to make degree planning easier for University of Colorado Colorado Springs (UCCS) students. The app combines publicly available information from the UCCS course catalog and degree requirements listings to create a unified interface for exploring and planning course loads semester-by-semester. For convenience, students can upload their UCCS degree audit HTML files, which will automatically fill out the degree plan with the student’s completed and in-progress classes.

## Development Environment
Degree Planner is a ReactJS frontend web application managed with the Vite build tool. The program is written in TypeScript and uses Vite CSS modules for layout and styling.

The repo contains a GitHub Action to automatically build and deploy the application to GitHub pages when a pull request is merged into the prod branch. The live application is hosted at https://eswaidner.github.io/degree-planner/. The prod branch is protected and can only be modified through pull requests, not direct commits.

### Environment Setup
Degree Planner depends on the NodeJS npm ecosystem. Development was done using versions of NodeJS at or above v22.13.1, but older versions may be adequate. For dependency versions (which includes React, Vite, and TypeScript), refer to the `package.json` file.

After installing NodeJS, clone the GitHub repo to a local directory. Run the command `npm install` from within the project directory to install the dependencies at the versions specified in the `package.json` file. Once installation completes, you can run the command `npm run dev` to launch the development server. The Vite development server locally hosts the application at http://localhost:5173, and will automatically refresh the web page when source files are modified.

To build the application, run `npm run build` from within the project directory. This will invoke the TypeScript compiler and Vite build system to generate a bundle of assets in the dist directory. This asset bundle is what is served to clients when the app is loaded. Manual builds should only be performed to verify that the build succeeds, builds for production deployments are automated.

To deploy updates to the application, first develop and test the new functionality within the main branch. After changes have been validated, create a pull request to merge the main branch into the prod branch. Do not squash commits when merging the pull request. After the pull request is merged, a GitHub Actions workflow will automatically build and deploy the application to GitHub pages.

### Project Structure
Degree Planner uses a global state store React architecture. The graphical user interface is described declaratively using a tree of React functional components. Each functional component uses a combination of TypeScript and the TSX HTML templating language to dynamically render HTML/CSS content to the web browser.

For state that is component-local and does not persist between app reloads, Degree Planner uses React features such as useState and useRef and passes state/callbacks from parents to children through component properties. An example of this kind of state is the value of the class search bar.

For state that is global and/or persistent between app reloads, we use the React Zustand library to implement a global reactive state store. The state store is a global object which includes a collection of state fields and functions for updating those fields. Components throughout the component tree can subscribe to state store fields and are automatically re-rendered when state changes. Fields within the state store can be marked persistent, which automatically saves and loads the field value using browser local storage. Persistent fields keep their value between app reloads unless the browser storage for the app is cleared. An example of persistent global state is the values of the class slots within the degree plan.

### Naming Conventions
In general, we follow the standard naming conventions for TypeScript and React. Files use snake_case naming except for components and their CSS modules, which use PascalCase. Additionally, we use camelCase for CSS rules due to how CSS modules work (the typical kebab-case convention for CSS rules is not legal TypeScript syntax).

### Files
| File | Description |
|---|---|
| src/index.html | Application HTML entrypoint, runs main.tsx. |
| src/index.css | Global CSS rules and default style resets. |
| src/state.ts | Global state store and state modification actions. |
| src/utils.ts | General app utility functions. |
| src/main.tsx | React entry point, renders App component. |
| src/App.tsx | Root of the React component tree. |
| src/styles/App.module.css | CSS rules for the App component. |
| src/containers/DegreePlanner.tsx | Container for the ButtonBar and YearSchedule. |
| src/styles/DegreePlanner.module.css | CSS rules for the degree plan components. |
| src/containers/ButtonBar.tsx | The button bar at the top of the screen. |
| src/containers/UploadFileBtn.tsx | The upload file button for degree audit uploading. |
| src/containers/ResetButton.tsx | The reset button for degree plan resetting. |
| src/containers/YearSchedule.tsx | The degree plan display of academic years/semesters. |
| src/containers/ClassBrowser.tsx | Container for the class search, filters, and display. |
| src/styles/ClassBrowser.module.css | CSS rules for the class search, filters, and display. |
| src/containers/ClassSearch.tsx | List of classes and search bar to find classes by name. |
| src/containers/ClassFilters.tsx | List of degree requirement filters to down-select classes. |
| src/containers/ClassDisplay.tsx | Displays selected class description and metadata. |
| src/containers/Modal.tsx | Utility to display content on top of the main interface. |
| src/containers/Modal.module.css | CSS rules for the Modal system. |




### Licensing
This project is distributed under the MIT permissive open source license. See [LICENSE](./LICENSE) for details.

### Current State
Degree Planner is currently a proof-of-concept. At the moment, the program supports exploring the full undergraduate UCCS course catalog (as of Fall 2025) through a fuzzy search interface. Courses can also be filtered by Computer Science B.S. general track degree requirements. The user can add classes to class slots within semesters in the degree plan interface. The user can also add and remove academic years from the degree plan. The app performs basic validation of class placements, warning the user when a class has been added more than once or if a class is placed in a semester during which it is not typically offered.

The user can optionally upload an HTML-format degree audit from UCCS’s self-serve degree audit tool available in the student portal. Uploading a degree audit will automatically set up the degree plan with the years and classes specified in the degree audit. This makes it easy for a student to import their current degree state and build a plan from there.

### Future State
While the current version of the application can technically be used to plan degrees in a more convenient way than manually collecting information from several sources, this app has the potential to do so much more. The functionality of the current system is limited by its lack of access to UCCS data. Features like automatic prerequisite validation, class session selection, and even automatic registration would be possible through this application if it was integrated into the UCCS web infrastructure.

In particular, access to the UCCS course database would enable more rigorous validation of class placements and also ensure that the app is always using the most up-to-date course information available. Database integration would also make it feasible for the app to support any degree and major, rather than just the CS B.S. that we implemented for the proof of concept. During development, we learned first-hand that the relationships between courses, degree requirements, pre/corequisites, and other types of course-related data at UCCS are complex. Utilizing the relations likely present in the existing database would simplify the implementation of Degree Planner and bring many valuable features into the realm of possibilities.

### Known Issues
- **Inaccurate class credit allocation**
  - Due to a lack of degree requirements data, Degree Planner is currently not able to allocate classes to degree requirements in a way that matches how UCCS allocates classes. The app currently assigns the class to the first requirement that it can satisfy, not taking into account if the requirement is already satisfied or if the class is able to be counted multiple times under different degree requirement categories.

- **Class search performance issues**
  - The current implementation of the class search renders all 4000+ classes when no search query is provided. While this works reasonably well, it can cause performance hangs when a large number of class search results are being instantiated at once. Pagination or virtual scrolling can solve this.

- **GUI layout does not adapt well to browser zooming and mobile devices**
  - Our CSS layout only works for traditional desktop/laptop aspect ratios and struggles to adapt correctly to browsers with a high zoom level (above ~125%) or mobile devices. This app is designed to be used through a desktop/laptop, but a more robust layout would be good to have.

- **Current modal system is not the best practice** (should use HTML dialogs)
  - Our implementation of modals technically works, but is not in line with web development best practices. Using the HTML dialog element is a better solution that correctly integrates with tab navigation, screen readers, and other accessibility features.

