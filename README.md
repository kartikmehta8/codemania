<p align="center">
  <img src="https://user-images.githubusercontent.com/77505989/208352809-10d99024-404c-4ac0-a5c7-36094354c5e8.png" alt="BANNER" />
</p>

## Codemania - The compilation is reborn 🖥️

There is no place for newbies where they can run their code, seek help to resolve doubts, and keep a check on their programming activities. We always have to visit various websites & it happens that the solution provided isn't legitimate. **Codemania** is a one-stop solution for tackling this problem.

### Codemania is an online compiler that provides the following features
- Code completion using ChatGPT - users can search for questions and generate code using artificial intelligence.
- Analyze results and statistics using the "tremor.so" dashboard using bar chart.
- YouTube video recommendation at a one-stop place with user authentication.
- Compile your code in C, C++, and Python and get the output with an easy-to-use interface.

## How do we build it?
#### CLIENT SIDE
- We have used **ReactJS** to built the structure of the frontend along with **TailwindCSS** for styling the website.
- We care about our website into production, so we have configured the tests using **Jest** testing framework.
- The history records of the users are stored in **Supabase Database** for rapid-fast accessibility.
- The authentication of our website is handled by **Firebase Auth**. Users can sign up and sign in. For the better user experience, we have implemented forgot passowrd feature where users can reset their password.
- The **YouTube API** is configured alongside the ChatGPT to recommend the best possible videos.
- To create an analytics dashboard, we have used **Tremor.so**.

#### SERVER SIDE
- We have used **NodeJS** and **ExpressJS** to build our backend API.
- The **Openai's ChatGPT API** is configured at the backend to send and retrieve the results.
- We have also used **MongoDB Database** to schedule our jobs that users have may/may not send concurrently.
- We have used packages like `child-process` to access the shell so that we can compile the C/C++/Python code.
- The secrets of the website are stored in an environment file `.env` to follow the best practices.
- The functionality of the API are tested using **Postman Tool**.

## Technologies
<p align="center">
  <img src="https://user-images.githubusercontent.com/77505989/208357762-405c98de-2272-49a4-bf5c-30e38d230ed4.png" alt="BANNER" />
</p>

## Major Accomplishments
- User cannot access Dashboard and Analytics unless and until they sign in. We handled **private routes** with care so that we can match a production ready authentication in the given time frame.
- The data for the analytics is fetched from **Supabase Database**. We are successful in integrating the Supabase Database Service. `Thanks to the documentation!`
#### Code Snippet
```javascript
const { data, error } = await supabase
            .from("comment")
            .select()
            .eq("email", currentUser.email);
            // Data is stored in an array
        if (data) setComments(data);
        if (error) {
            console.log(error);
            return;
        }
```
- We are storing all the code along with the language code in **MongoDB Database**. We are ensuring that if we encounter concurrent requests, we handle them using their respective jobIDs.
- The **ChatGPT's API** code completions are up to the mark along with our recommended YouTube videos.

## Foresight
- Support for **more languages** like Ruby & Javascript.
- Implementing a **console** where user can enter the input.
- Improving **UI/UX** of the website.
- Integrating **StackOverFlow API** for direct user query.
- Migrating the authentication service **from Firebase Auth to Supabase Auth**.

<h3 align="center">
Programmer: A machine that turns coffee into code.
</h3>
