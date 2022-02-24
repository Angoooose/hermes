
# hermes

Hermes is a truly temporary messenger built with React and Firebase. The accounts are deleted 48 hours after they are created. The idea was for it to be an easy way to communicate without disclosing personal information (like a Discord/Instagram account or a phone number). For example, when working with peers on a group project. However, it has a lot of flaws. None-the-less, it was fun to build.

## To use
A live demo can be found at: https://hermes.angoose.dev/. You can also run it locally. 

## Running Locally

### Requirements
- NodeJS & NPM
- Firebase account

### Steps 
1. Create a Firebase project
2. Create three Firestore collections: `chats`, `global`, and `users`.
3. Within the aforementioned project, create a new web app and copy the **Firebase SDK Snipet** as `config`. It should look like this:

	```ts
	const firebaseConfig = {
		apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		authDomain: "XXXX-XXXX.firebaseapp.com",
		databaseURL: "https://XXXX-XXXX.firebaseio.com",
		projectId: "XXXX-XXXX",
		storageBucket: "XXXX-XXXX.appspot.com",
		messagingSenderId: "XXXXXXXXXX",
		appId: "X:XXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXX"
	};
	```
  
4. Clone this repository to your local machine:

	```
	git clone https://github.com/Angoooose/hermes/
	```
  
5. Create a file called `firebase.config.ts` in the `src` directory. Copy the Firebase SDK Snipet from Step 3 into the file with `const firebaseConfig` replaced with `export default`. 
6. Execute `npm i` to install the needed packages.
7. Execute `npm start`, the app should then open on http://localhost:3000/.
## Thanks to
- [react-spinners](https://www.npmjs.com/package/react-spinners)
- [react-loading-skeleton](https://www.npmjs.com/package/react-loading-skeleton)
- [heroicons](https://heroicons.com/)
