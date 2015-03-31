import tornado.ioloop
import tornado.web
from TwitterSearch import TwitterSearchOrder
import indicoio
from pprint import pprint
import json

from twitter_demo.twitter import TwitterClient
import twitter_demo.settings as settings


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler)
        ]
        config = {
            "template_path": settings.TEMPLATE_PATH,
            "static_path": settings.STATIC_PATH,
        }
        tornado.web.Application.__init__(self, handlers, **config)


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')

    def post(self):
        query_string = self.request.body_arguments.get('query')
        query = TwitterSearchOrder()
        query.set_keywords(query_string)
        query.set_language('en')
        query.set_include_entities(False)
        results = TwitterClient.search_tweets(query)

        tweets = [tweet['text'] for tweet in results['content']['statuses']]
        sentiment = indicoio.batch_sentiment(tweets)
        pairs = sorted(zip(sentiment, tweets))
        n_tweets = float(len(pairs))

        top_n = 5
        most_negative = pairs[:top_n]
        most_positive = pairs[-top_n:]

        data = {
            'most_positive': most_positive,
            'most_negative': most_negative,
            'average': sum(sentiment)/n_tweets
        }
        
        self.write(json.dumps(pairs))

application = Application()

if __name__ == "__main__":
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
