<!-- GETTING STARTED -->
<a name="readme-top"></a>
## Getting Started

Set up this project locally and get it up and running by following these steps.


### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* mongodb database
    * Creat cluster in MongoDB cloud
    * Create database user
    * Copy connection string from MongoDB to connect this application to the MongoDB cluster
    * Path in mongoDB to get connection string : Databases > Connect > Connect your application . Copy the connection string.

* REST API testing
    * Install Visual Studio code extension "REST Client" by Huachao Mao. It is required to run the REST API test found in `tests/rest` folder

### Installation

Install and set up this app as given below.

1. Clone the repo
   ```sh
   git clone https://github.com/anushashettyj/eshop-backend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter following variables in `.env`
   ```env
   PORT=8080
   MONGODB_URL = mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.t7rquix.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority
   JWT_SECRET = 'Enter your secret Key'
   ```
4. Bring up the app
   ```js
   npm run dev
   ```


<!-- ROADMAP -->
## Roadmap

- [ ] Add Payment feature using Stripe


<!-- CONTACT -->
## Contact

Anusha Shetty - [Linkedin](https://www.linkedin.com/in/anusha-shetty-17a97589)

Project Link: [https://github.com/anushashettyj/eshop-backend](https://github.com/anushashettyj/eshop-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>