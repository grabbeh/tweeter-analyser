## Tweeter analyser

This is a project to help people analyse people's tweets. It is built using Next.js, Twitter's API, and DynamoDB. It does some basic analysis of tweets to discover common themes, including using NLP and a pre-trained model to detect toxicity in tweets.

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

## To do

- Fix issue where if 500 error returned, user has to manually refresh page to submit another username
- Create a homepage
- Understand how sort keys work in DynamoDB for more efficient sorting to access most active tweeters
- Get Twitter bot working
  - work out how to get import/export working in Node to avoid using Babel

## Structure

- Pages accessible to users are in `/pages`.
- The same folder has a sub-folder `/api`. This contains API routes used to get data for the pages
- The `/components` folder has the building blocks for pages
- The root `/api` folder has files that the above `/api` subfolder uses to get content
- The `/bot` folder has the Twitterbot content

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/).

### Deployments

Make a production build (optimized for speed etc)

`npm run build`

Start the production server - it uses `Forever` to main uptime in a rudimentary way

`npm run start-next`

# BOT

You'll also find a code for a Twitter bot in ```/server/bot```.

### Steps to engage with a relentless spammer

1. Reply to every tweet they post advising people they're a bot
2. Get block
3. Search for references to their username on Twitter and reply to all those tweets with the same message
4. Get account temporarily suspended
5. Update to select different template replies for variety
6. Consider time limiting API calls for sending tweets so less obvious account spamming
