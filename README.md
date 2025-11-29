# PortManage

![Dashboard](./doc/images/dash.png)

A port management tool to help you track your server's port status..

## Deployment

1. Clone the repo
    ```bash
    git clone https://github.com/Motues/PortManage.git
    ```
2. Install dependencies
    ```
    cd PortManage
    pnpm install
    ```
3. Setup environment variables
    Create a `.env` file in the root directory and add the following variables
    ```bash
    NODE_ENV=development                    # development or production
    PORT=13000                              # server port
    ALLOW_ORIGIN="https://port.example.com" # allow origin, multiple origins separated by comma(,)
    DATABASE_URL=./data/server.json         # database path
    ADMIN_NAME="Admin"                      # admin name
    ADMIN_PASSWORD="123456"                 # admin password
    ```
    Note: If database path is not exist, the server will create a new database file in the `data` directory.
4. Start the server
    ```
    pnpm build
    pnpm start
    ```
    then open http://localhost:13000

## Suggestions

- The key will expire in 10 minutes and requires re-login.
- Use HTTPS to protect your data during transmission.

