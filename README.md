After you clone the project, run the command below to install dependencies
```bash
npm i
```

Command to start project local

```bash
npm run start
```

Command to run test using jest

```bash
npm run test:jest
```

Command to run e2e test

```bash
npm run cypress:run
```


For this project, the hardest part was handling the authentication. The first time I installed the project, I accidentally enabled SSR. As a result, when I tried to store the token in localStorage, the app couldn’t read the value (it said localStorage was undefined). I had to remove the project and reinstall it with SSR turned off.

When dealing with tokens, I also had to implement logic to obtain a new access token using a refresh token when the old one expired.

Another challenge was writing tests. Honestly, testing is not my strength, so I had to rely on AI to help me a bit. Additionally, setting up NGXS took a lot of time due to the amount of boilerplate code required.