# Mini LinkedIn-Style Community Platform

This project was built as a full-stack development challenge for CIAAN Cyber Tech Pvt Ltd. It's a small-scale social media platform where users can sign up, create posts, and view each other's profiles. It was a fun and challenging project to build from the ground up!

### Tech Stack

I decided to use a modern and robust tech stack for this project:

* **Frontend:** Next.js (React) with TypeScript & Tailwind CSS
* **Backend:** Node.js with Express
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Tokens) with secure `httpOnly` cookies, Google OAuth 2.0

---

### Live Demo URL



---

### Setup and Run Locally

To get this project running on your own machine, you'll need to set up both the backend and frontend servers.

**Prerequisites:**
* Node.js installed
* A MongoDB Atlas account (or a local MongoDB instance)

**1. Clone the repository:**
```bash
git clone https://github.com/Yatin12527/Ciaan-Assesment.git
cd Ciaan-Assesment
```

**2. Setup the Backend:**

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create an environment file
touch .env
```
Now, open the `.env` file and add the following variables. You'll need to get these from your MongoDB Atlas dashboard and Google Cloud Console for OAuth.

```
PORT=4000
DB_STRING=your_mongodb_connection_string
JWTSECRET=a_super_long_and_random_secret_key_for_your_tokens

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/users/callback/google
TOKEN_URI=https://oauth2.googleapis.com/token

# The URL of your frontend (for redirects)
FRONTEND_SERVICE=http://localhost:3000
```

**3. Setup the Frontend:**

```bash
# Navigate to the frontend folder from the root directory
cd frontend

# Install dependencies
npm install

# Create an environment file
touch .env.local
```
Open the `.env.local` file and add the URL of your backend server:
```
NEXT_PUBLIC_SERVER=http://localhost:4000/api
```

**4. Run the Application:**
You'll need two separate terminals for this.

* In the first terminal (in the `backend` folder), run: `npm run dev`
* In the second terminal (in the `frontend` folder), run: `npm run dev`

Your application should now be running, with the frontend at `http://localhost:3000` and the backend at `http://localhost:4000`.

---

### Features

Here's a breakdown of the features I built, in the order I developed them:

**1. Secure User Authentication**
The foundation of the app. I implemented a full authentication system from scratch.
* Users can sign up with their name, email, and a password. Passwords are never stored in plain text; they are securely hashed using `bcrypt`.
* Users can log in using their email and password.
* For a better user experience, I also integrated **Google OAuth 2.0**, allowing users to sign up or log in with their Google account in a single click.
* Session management is handled securely using **`httpOnly` cookies**, which protects the user's session token from being accessed by client-side scripts.

**2. Public Post Feed**
The core of the community experience.
* Once logged in, a user can create a new text-only post from the home page.
* The home page displays a public feed of all posts from all users, sorted with the newest posts at the top.
* The feed updates in real-time when a new post is created, without needing a full page reload.

**3. Personal Profile Pages**
Every user gets their own space.
* Clicking on any user's name or profile picture anywhere in the app takes you to their dedicated profile page.
* This page displays the user's profile information (picture, name, email, and bio) and a feed containing **only the posts written by that user**.

**4. Profile Editing**
Users have control over their own profiles.
* If you are viewing your own profile, an "Edit Profile" button appears.
* Clicking this opens a modal where you can update your name, bio, and profile picture URL. The changes are reflected instantly on the page without a reload.

**5. Post Deletion**
To give users full control over their content, I added a secure delete feature.
* When viewing your own profile, a small delete icon appears on each of your posts.
* Clicking this icon allows you to permanently delete the post. This action is protected on the backend to ensure users can only delete their own content.

---
**Note :- In case you are using brave browser plase turn on your "allow third party cookies" in order to sign in and out with google Oauth**

