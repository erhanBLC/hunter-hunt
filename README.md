# Hunter Hunt
Own a great product and need a hunter to feature it?
[HunterHunt](http://www.hunterhunt.co) lets you hunt Hunters!

----------

## Setup
### Grunt & Bower
Install Grunt & Bower
```
npm install -g grunt-cli bower
```
Install dependencies
```
npm install
```
Run `grunt` for building and `grunt serve` for preview.

### CouchDB
![CouchDB](http://kan.so/static/img/couchdb-logo.png)
```
sudo apt-get -y install couchdb
```
[See more here](https://wiki.apache.org/couchdb/Installation)

Make sure it's installed
```
curl http://127.0.0.1:5984
# {"couchdb":"Welcome","version":"1.X"}
```

#### Install CouchDB for Python
```
sudo pip install couchdb
```

#### Relax
* Put CouchDB url, login & password in `config.py`
* Execute `initiate_couch_db()` in `couchdb_functions.py` to create the database and views.

### Natural Language Toolkit
Install nltk & numpy
```
sudo pip install -U nltk numpy
```
Install a few nltk packages
```
>>> import nltk
>>> nltk.download()
```
* stopwords
* wordnets
* words
* maxent_treeback_pos_tagger

### Product Hunt API
Create an application [here](http://www.producthunt.com/v1/oauth/applications) and put your developer token in `config.py`
