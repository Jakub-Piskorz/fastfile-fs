# FastFile

### Cloud storage app

[Link to app (if my PC is turned on)](https://jakubpiskorz.dev/fastfile)

Landing Page:

- Design by Jakub Piskorz, Frontend by Mateusz Szczykutowicz

App:

- Design and Frontend by Jakub Piskorz, Backend initially by Mateusz Szczykutowicz in node/express, since 2025 by Jakub
  Piskorz in Java/Spring Boot/Postgres

## How to run?

1. Make sure `node` and `npm` are installed.
2. Run `npm install` in the project root.
3. Fastfile Frontend runs on HTTPS locally. Install `mkcert` and run:
   ```bash
   mkcert -install
   mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
   ```
   Place the generated `localhost.pem` and `localhost-key.pem` files in the project root.
4. Run `npm start` to start the development server.
5. For production, run `npm run build` and copy the generated `/dist` folder to your web server.

https://user-images.githubusercontent.com/54907055/162797478-d0f0fd15-cf51-427e-b670-c0a4334209e1.mp4

![image](https://user-images.githubusercontent.com/54907055/162795091-e40d429b-b4cb-4120-93f0-fdde7053a545.png)

![image](https://user-images.githubusercontent.com/54907055/162795836-64827be8-ef62-4a35-8e3c-07131c463bfe.png)

![image](https://user-images.githubusercontent.com/54907055/162796212-e4601b2a-6abb-43a0-84ea-0767286aeaaf.png)
