/**
 *
 *  @revision    $Id: test.js 2013-10-08 04:54:16 Aleksey $
 *  @created     2013-10-08 04:54:16
 *  @category    Express Helpers
 *  @package     connect-caminte
 *  @version     0.0.4
 *  @copyright   Copyright (c) 2009-2013 - All rights reserved.
 *  @license     MIT License
 *  @author      Alexey Gordeyev IK <aleksej@gordejev.lv>
 *  @link        http://www.gordejev.lv/
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 */
var driver = process.env.CAMINTE_DRIVER || 'memory';
var session = require('express-session');
var fs = require('fs');
var database = require('./database');
var caminte = require("./../lib/connect-caminte");
var CaminteStore = caminte(session);
var sid = 'uyv6r4djvbu7ubi8708uyuby' + new Date().getTime();
var maxAge = 300000; // 3 min
var db = database[driver];
var dbDir = './db';

/* create dir for sqlite */
var dstat, tstat;
try {
    dstat = fs.statSync(dbDir);
} catch(err) {}
if(!dstat) { fs.mkdirSync(dbDir,'0755'); }
try {
    tstat = fs.statSync(dbDir + '/test');
} catch(err) {}
if(!tstat) { fs.mkdirSync(dbDir + '/test','0755'); }

var store = new CaminteStore({
    driver: driver,
    collection: 'session',
    db: db,
    secret: "feb722690aeccfa92ca9ee6fdf06e55a",
    maxAge: maxAge
});

exports['Create and store session '] = function(test) {
    store.set(sid, {
        cookie: {ssid: sid, maxAge: maxAge}
    }, function(err, session) {
        test.equal(err, null);
        test.ok(session.sid, sid);
        test.ok(session.session_data.cookie.ssid, sid);
        test.equal(session.session_data.cookie.maxAge, maxAge);
        test.equal(session.expireAfterSeconds, maxAge / 1000);
        test.ok(session.ip, 'localhost');
        test.ok(session.user, 'guest');
        test.equal(session.loggedIn, 0);
        test.done();
    });
};

exports['Find stored session '] = function(test) {
    store.get(sid, function(err, session) {
        test.equal(err, null);
        test.ok(session.cookie.ssid, sid);
        test.done();
    });
};

exports['Count sessions '] = function(test) {
    store.length(function(err, count) {
        test.equal(err, null);
        test.ok(typeof count, 'number');
        test.equal(count, 1);
        test.done();
    });
};

exports['Select all sessions '] = function(test) {
    store.all(function(err, sessions) {
        test.equal(err, null);
        test.equal(sessions.length, 1);
        test.done();
    });
};

exports['Destroy session '] = function(test) {
    store.destroy(sid, function(err) {
        test.equal(err, null);
        store.get(sid, function(err, session) {
            test.equal(err, null);
            test.equal(session, null);
            test.done();
        });
    });
};