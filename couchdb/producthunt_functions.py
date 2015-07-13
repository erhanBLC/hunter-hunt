#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests, json, config

# >> Some functions to retrieve data 
def get_user_details(username):
	url = '%s/v1/users/%s' % (config.PH_HOST, username)
	response = requests.get(url, headers=config.PH_HEAD)
	response = response.json()
	return response


def retrieve_last_posts(id, per_page):
	url = '%s/v1/users/%s/posts' % (config.PH_HOST, id)
	params = {'order': 'desc', 'per_page': per_page}
	last_posts = []

	response = requests.get(url, headers=config.PH_HEAD, data=params)
	response = response.json()

	for post in response['posts']:
		last_posts.append({
			'id'			:	post['id'],
			'name'			:	post['name'],
			'tagline'		:	post['tagline'],
			'votes_count'	: 	post['votes_count'],
			'discussion_url':	post['discussion_url'],
			'screenshot_url':	post['screenshot_url']
		})
	return last_posts


def get_total_taglines_and_votes(id, posts_count):
	url = '%s/v1/users/%s/posts' % (config.PH_HOST, id)
	params = {'order': 'asc'}

	i = 0
	total_taglines = []
	total_votes = 0

	while posts_count > i:
		if i != 0: params['newer'] = last_id
		response = requests.get(url, headers=config.PH_HEAD, data=params)
		response = response.json()

		for post in response['posts']:
			total_taglines.append(post['tagline'])
			total_votes += post['votes_count']
			last_id = post['id']
			i+=1
	return {
		'taglines': total_taglines,
		'votes': total_votes
	}
