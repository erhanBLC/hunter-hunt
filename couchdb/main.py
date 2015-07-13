#!/usr/bin/python
# -*- coding: utf-8 -*-
from couchdb_functions import *
from producthunt_functions import *
from words_count import *
   
if __name__ == '__main__':
	print "[COUCHDB] Initiation..."
	initiate_couch_db()
	hunters = file_to_list('hunters.txt')
	
	for hunter in hunters:
		user = get_user_details(hunter)['user']
		
		taglines_votes = get_total_taglines_and_votes(user['id'], user['posts_count'])
		votes_count = taglines_votes['votes']
		taglines = taglines_votes['taglines']
		print ">> Taglines & votes: Check!"
		
		words = words_count(taglines)
		print ">> Words Count: Check!"
		
		last_posts = retrieve_last_posts(user['id'], 5)
		print ">> Last Posts: Check!"
		
		add_hunter({
			'id': user['id'],
			'name': user['name'],
			'username': user['username'],
			'headline': user['headline'],
			'posts_count': user['posts_count'],
			'votes_count': votes_count,
			'image_url': user['image_url'],
			'words': words,
			'last_posts': last_posts,
		})
		print ">> %s added\n====================== " % hunter
