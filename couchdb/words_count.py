#!/usr/bin/python
from collections import Counter
import nltk, string

def file_to_list(path):
	return [line.rstrip('\n') for line in open(path)]

def words_count(taglines):

	stop_words = set(nltk.corpus.stopwords.words('english')) | {"n't", "..."} | set(string.punctuation)
	tokenization_pattern = r'''(?x)
		([A-Z]\.)+
		| \w+(-\w+)*
		| \$?\d+(\.\d+)?%?
		| \w+[\x90-\xff]
		| [][.,;"'?():-_`]
		'''

	text = ' '.join(taglines)
	text = text.replace('(','').replace(')','').replace('+','').replace('/',' ').replace("'",' ').lower()

	tokens = nltk.tokenize.regexp.regexp_tokenize(text, tokenization_pattern)
	tokens = nltk.pos_tag(tokens)
	tokens = [s for s in tokens if s[1][0]=='V' or s[1][:2]=='NN' or s[1][:2]=='JJ']

	wordnet_lemmatizer = nltk.stem.WordNetLemmatizer()
	irrelevant_words = file_to_list('irrelevant_words')
	word_counter = Counter()

	not_change = ['ios']
	change = {'apps': 'app','yoapp': 'yo', 'ebooks': 'ebook'}

	for token in tokens:
		token = token[0]
		if token in stop_words or token.startswith("'") or len(set(token)) < 2 or token in irrelevant_words:
			continue

		if token in not_change:
			pass

		else:
			if len(token) == 3:
				token_test = wordnet_lemmatizer.lemmatize(token)
				if len(token_test) != len(token):
					continue
			else:
				if token in change:
					token =  wordnet_lemmatizer.lemmatize(change[token])
				token = wordnet_lemmatizer.lemmatize(token)
		word_counter[token] += 1
	word_counter = word_counter.most_common()
	dict_word_counter = {}
	for word, count in word_counter:
		if count >= 2:
			dict_word_counter[word] = count
	return dict_word_counter
