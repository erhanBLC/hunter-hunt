#!/usr/bin/python
# -*- coding: utf-8 -*-
from couchdb import *
from couchdb.design import ViewDefinition
import time, datetime, config

def connect_to_db():
	couch = Server(config.COUCHDB_SERVER)
	if config.COUCHDB_USER and config.COUCHDB_PASSWORD:
		couch.resource.credentials = (config.COUCHDB_USER, config.COUCHDB_PASSWORD)
	return couch

def create_or_load_db( couch, database_name ): 
	try: 
		return couch[ database_name ]
	except ResourceNotFound:
		return couch.create( database_name )
	
def initiate_couch_db():
	couch = connect_to_db()
	db_hunters = create_or_load_db( couch, 'hunters' )
	create_views_in_db_hunters( db_hunters )


def create_views_in_db_hunters( db ):
	view = ViewDefinition(
		'words',
		'random',
		'''function( doc ) {
			emit( Math.random(), doc.words );
		}''')
	view.sync( db )
	
	view2 = ViewDefinition(
		'words',
		'all_occurrences',
		'''function( doc ) {
			var words = doc.words;
			for(word in words){
			   emit( [word, words[word]], words[word] );
			}
		}''')
	view2.sync( db )
	
	view3 = ViewDefinition(
		'list',
		'by_username',
		'''function( doc ) {
			emit( doc.username, doc );
		}''')
	view3.sync( db )
	
	view4 = ViewDefinition(
		'list',
		'by_votes_count',
		'''function( doc ) {
			emit( doc.votes_count, [doc.username, doc.image_url["120px"] ] );
		}''')
	view4.sync( db )
	
	view5 = ViewDefinition(
		'list',
		'by_posts_count',
		'''function( doc ) {
			emit( doc.posts_count, [doc.username, doc.image_url["120px"] ] );
		}''')
	view5.sync( db )
	
	view6 = ViewDefinition(
		'list',
		'by_average_votes',
		'''function( doc ) {
			var average = doc.votes_count/doc.posts_count;
			emit( Math.round(average), [doc.username, doc.image_url["120px"] ] );
		}''')
	view6.sync( db )
	

def add_hunter(hunter):
	couch = connect_to_db()
	db = create_or_load_db(couch, 'hunters')
	try:
		hunter = db[ str(hunter['id']) ]
		print "[COUCHDB] Already in the database"
	except ResourceNotFound:
	
		dict_field_values = {
			'_id'   	: 	str(hunter['id']),
			'name'  	:	hunter['name'],
			'username'  :	hunter['username'],
			'headline'	: 	hunter['headline'],
			'posts_count':	hunter['posts_count'],
			'votes_count':	hunter['votes_count'],
			'image_url'	:	hunter['image_url'],
			'words'		:	hunter['words'],
			'last_posts':	hunter['last_posts'],	
			'last_update': 	(datetime.datetime.fromtimestamp( time.time() )).strftime('%Y-%m-%d %H:%M:%S')
		}
		return db.create( dict_field_values )
		
