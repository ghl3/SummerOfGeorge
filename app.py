#!/usr/bin/env python

import os

from flask import Flask
from flask import url_for
from flask import render_template

import pymongo

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', title="SummerOfGeorge")


@app.route('/activities')
def activities():
    return render_template('activities.html', title="ActivitiesOfGeorge", 
                           activity_list=activity_list())


@app.route('/map')
def map():
    return render_template('map.html', title="MapOfGeorge")


def connectToDatabase():
    """ Get a handle on the db object

    """
    connection = pymongo.Connection()
    db = connection['summer_of_george']
    return db


def addActivityToDatabase( activity ):
    """ Add an activity (dict) to the database

    """
    db = connectToDatabase()
    activities = db['activities']
    activities.insert( activity )
    return


def getActivityList( num_activities=10 ):
    """ Get a list of activities (at most num_activities)

    """
    db = connectToDatabase()
    activities = db['activities']
    activity_list = activities.find().sort({_id:1}).limit( num_activities );
    return activity_list


def activity_list():
    list = []
    activity = { "name" : "bob", "borough" : "manhattan",
                 "address" : "123 fake street", "type" : "bar",
                 "map_link" : "bob.com" }
    list.append( activity)
    list.append( activity)
    list.append( activity)
    return list


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.debug = True
    app.run(host='0.0.0.0', port=port)
    

