import dotenv from 'dotenv'
import { TwitterApi } from 'twitter-api-v2'
import parse from 'parse-url'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import filter from 'lodash/fp/filter'
import flow from 'lodash/fp/flow'
import flatten from 'lodash/fp/flatten'
import uniq from 'lodash/fp/uniq'
import countBy from 'lodash/fp/countBy'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
import slice from 'lodash/fp/slice'
import identity from 'lodash/fp/identity'
import groupBy from 'lodash/fp/groupBy'
import {
	format,
	sub,
	isAfter,
	differenceInDays,
	formatDistanceToNow,
	formatDistance,
	formatISO
} from 'date-fns'
//import predict from './tensorflow.js'
import compromise from './compromise.js'
import {
	chartData,
	mostActiveHour,
	mostActiveDay,
	longestStreak
} from './chartData.js'
dotenv.config({ path: '../../.env' })

const client = new TwitterApi({
	appKey: process.env.CONSUMER_KEY,
	appSecret: process.env.CONSUMER_SECRET,
	accessToken: process.env.ACCESS_KEY,
	accessSecret: process.env.ACCESS_SECRET
})

const roClient = client.readOnly

const summarise = async (user) => {
	try {
		//let user = roClient.v2.userByUsername(username)
		//	let tweets = await getSevenDaysTweets(user.id_str)
		let tweets = await getTweetsV2(user.id)
		if (!tweets) throw new Error('No tweets in the last 7 days')
		let f = filterSevenDays(tweets)
		if (!f.length > 0) throw new Error('No tweets in the last 7 days')
		f = addCategories(f)
		//let toxicTweets = await predict(f)
		//let { hashTags, emojis, topics } = compromise(f)
		// let { topics } = compromise(f)
		let { average, limitExceeded } = calculateAverage(f)
		let latestTweet = f[0]
		let oldestTweet = f.pop()
		return {
			urls: listUrls(f),
			media: media(f),
			accountCreated: accountCreated(user.created_at),
			timeSinceCreation: timeSinceCreation(user.created_at),
			averageTweetsPerDay: average,
			limitExceeded,
			likesToReplyTo: likesToReplyTo(f, user.username),
			likesToRetweet: likesToRetweet(f, user.username),
			longestStreak: longestStreak(f),
			totalTweets: f.length,
			chartData: chartData(f),
			mostTweetsPerHour: mostActiveHour(f),
			mostActiveDay: mostActiveDay(f),
			hashTags: hashTags(f),
			//toxicTweets,
			tweetSplit: tweetSplit(f),
			// toxicPercentage: Math.round((toxicTweets.length / 100) * 100),
			// emojis,
			// topics,
			timePeriod: timePeriod(oldestTweet, latestTweet)
		}
	} catch (e) {
		throw e
	}
}

const filterSevenDays = (tweets) => {
	return tweets.filter((t) => {
		return checkIfWithinTimePeriod(t, sevenDaysAgo)
	})
}

const timePeriod = (oldestTweet, latestTweet, dateFormat = 'd MMMM yyyy') => {
	let endDate = format(new Date(latestTweet.created_at), dateFormat)
	let startDate = format(new Date(oldestTweet.created_at), dateFormat)
	return `${startDate} - ${endDate}`
}

const sevenDaysAgo = sub(new Date(), { days: 7 })

const sevenDaysAgoInIso = formatISO(sevenDaysAgo)

const checkIfWithinTimePeriod = (tweet, startTime) => {
	return isAfter(new Date(tweet.created_at), startTime)
}

const getTweetsV2 = async (id) => {
	const userTimeline = await roClient.v2.userTimeline(id, {
		start_time: sevenDaysAgoInIso,
		max_results: 10,
		'tweet.fields': [
			'created_at',
			'entities',
			'geo',
			'id',
			'in_reply_to_user_id',
			'lang',
			'possibly_sensitive',
			'referenced_tweets',
			'reply_settings',
			'source',
			'text'
		]
	})
	let full = await userTimeline.fetchLast(1000)
	return full.tweets
}

const getSevenDaysTweets = async (id, maximumId) => {
	try {
		let fragment = await getTweetsBatch(id, maximumId)
		let earliestTweet = fragment.data.pop()
		if (
			fragment &&
			fragment.nextId &&
			earliestTweet &&
			checkIfWithinTimePeriod(earliestTweet, sevenDaysAgo)
		) {
			return fragment.data.concat(await getSevenDaysTweets(id, fragment.nextId))
		} else {
			return fragment.data
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

// Twitter client called
const getTweetsBatch = async (id, maximumId) => {
	try {
		let data = await client.get('statuses/user_timeline', {
			user_id: id,
			max_id: maximumId,
			count: 200
		})

		let oldest = data.pop()
		let nextId
		// sometimes gives error message "cannot find id of undefined"
		if (oldest) {
			nextId = oldest.id
			return { data, nextId }
		} else {
			return { data: data.filter((d) => d) }
		}
	} catch (e) {
		console.log(e)
		throw new Error(e)
	}
}

const getBatch = async (id) => {
	try {
		return await client.get('statuses/user_timeline', {
			screen_name: id,
			count: 200
		})
	} catch (e) {
		throw new Error(e)
	}
}

const getUserById = async (id) => {
	try {
		return roClient.v2.userById(id, {
			'user.fields': ['created_at', 'profile_image_url']
		})
	} catch (e) {
		throw new Error(e)
	}
}

const getUser = async (username) => {
	try {
		return roClient.v2.userByUsername(username, {
			'user.fields': ['created_at', 'profile_image_url']
		})
	} catch (e) {
		throw new Error(e)
	}
}

const calculateAverage = (tweets) => {
	let latest = tweets[0]
	let oldest = tweets.pop()
	let difference = calculateDuration(oldest, latest)
	if (difference < 1) difference = 1
	let average = Math.round(tweets.length / difference)
	let limitExceeded = !!difference < 7 && !!tweets.length > 3000
	return { average, difference, limitExceeded }
}

const calculateDuration = (oldest, latest) => {
	let latestDate = new Date(latest.created_at)
	let oldestDate = new Date(oldest.created_at)
	return differenceInDays(latestDate, oldestDate)
}

const addCategory = (tweet) => {
	let category
	let firstTwo = tweet.text.slice(0, 2)
	if (tweet.text.charAt(0) === '@') {
		category = 'REPLY'
	} else if (firstTwo === 'RT') {
		category = 'RETWEET'
	} else {
		category = 'TWEET'
	}
	return category
}

const addCategories = (tweets) => {
	return tweets.map((t) => {
		return { ...t, category: addCategory(t) }
	})
}

const tweetSplit = (tweets) => {
	return flow(
		groupBy('category'),
		entries,
		map(([k, v]) => {
			return { id: k, label: k, value: v.length }
		})
	)(tweets)
}

const likesToReplyTo = (tweets, screenName) => {
	let replies = groupBy('category')(tweets).REPLY
	if (replies) {
		return flow(
			// previously was user name but now ID
			map((r) => r.in_reply_to_user_id),
			filter((i) => i !== screenName),
			countBy(identity),
			entries,
			map(([k, v]) => {
				return { screen_name: `@${k}`, value: v }
			}),
			sortBy((o) => o.value),
			reverse,
			slice(0, 10)
		)(replies)
	} else {
		return false
	}
}

const extractFirstScreenname = (str) => {
	let removeFirstPart = str.slice(3)
	let nextSpace = removeFirstPart.indexOf(' ')
	let screenName = removeFirstPart.slice(0, nextSpace)
	let removeColon = screenName.slice(0, screenName.length - 1)
	return removeColon
}

const likesToRetweet = (tweets, screenName) => {
	let retweets = groupBy('category')(tweets).RETWEET
	if (retweets) {
		return flow(
			map((r) => extractFirstScreenname(r.text)),
			filter((i) => i !== `@${screenName}`),
			countBy(identity),
			entries,
			map(([k, v]) => {
				return { screen_name: k, value: v }
			}),
			sortBy((o) => o.value),
			reverse,
			slice(0, 10)
		)(retweets)
	} else {
		return false
	}
}

const accountCreated = (createdAt) => {
	return format(new Date(createdAt), 'd LLLL y')
}

const timeSinceCreation = (createdAt) => {
	return formatDistanceToNow(new Date(createdAt))
}

const timePeriodBetweenTwo = (older, earlier) => {
	let old = new Date(older)
	let early = new Date(earlier)
	return formatDistance(old, early)
}

const listUrls = (tweets) => {
	return flow(
		map((r) => r?.entities?.urls),
		filter((r) => r?.length > 0),
		flatten,
		map((r) => r.expanded_url),
		map((r) => parse(r)),
		map((r) => r.resource),
		filter((r) => r !== 'twitter.com'),
		countBy((r) => r),
		entries,
		sortBy(1),
		reverse
	)(tweets)
}

const hashTags = (tweets) => {
	return flow(
		map((r) => r?.entities?.hashtags),
		filter((r) => r?.length > 0),
		flatten,
		map((r) => r.tag),
		uniq
	)(tweets)
}

const media = (tweets) => {
	return flow(
		filter((r) => r.category == 'TWEET'),
		filter((r) => r.extended_entities),
		map((r) => r.extended_entities.media),
		flatten,
		map((r) => {
			return {
				width: r.sizes.thumb.w,
				height: r.sizes.thumb.h,
				imgUrl: r.media_url_https,
				tweetUrl: r.expanded_url
			}
		})
	)(tweets)
}

const iter = (value) => console.log(value)

export {
	summarise,
	calculateAverage,
	getSevenDaysTweets,
	getBatch,
	filterSevenDays,
	getUser,
	getUserById,
	tweetSplit,
	likesToReplyTo,
	likesToRetweet,
	accountCreated,
	timeSinceCreation,
	timePeriod,
	timePeriodBetweenTwo,
	checkIfWithinTimePeriod
}
