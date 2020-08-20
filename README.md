This is a project to help people analyse people's tweets

## Getting Started

Make a copy of the code on your computer
`git clone https://github.com/grabbeh/tweeter-analyser`

Change to the directory
`cd tweeter-analyser`

Install all the third party dependencies
`npm install`

Add Twitter API credentials and DynamoDB credentials in .env matching the following format:

```
  CONSUMER_KEY
  CONSUMER_SECRET
  ACCESS_KEY
  ACCESS_SECRET
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
```

Run the development server:
`npm start dev`

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

### Deployments

Make a production build (optimized for speed etc)

`npm run build`

Start the production server - it uses `Forever` to main uptime in a rudimentary way

`npm run start-next`
