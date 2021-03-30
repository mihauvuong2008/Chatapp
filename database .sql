
	
use githubideanodejswebapp;


//=============DROP==============
	
use githubideanodejswebapp;


delete from unread_groups;
delete from say_to_groups;
delete from say_to_friends;
delete from unknow_stories;
delete from make_storytrends;
delete from build_stories;
delete from part_of_reals;
delete from member_of_chat_groups;
delete from chat_groups;
delete from unhide_userminds;
delete from friend_relates;
delete from users;

drop table unread_groups;
drop table say_to_groups;
drop table say_to_friends;
drop table unknow_stories;
drop table make_storytrends;
drop table build_stories;
drop table part_of_reals;
drop table member_of_chat_groups;
drop table chat_groups;
drop table unhide_userminds;
drop table friend_relates;
drop table users;
//==========================================

show tables;



SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
	userid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	lasttimelogin DATETIME,
	status BOOLEAN
);

CREATE TABLE IF NOT EXISTS friend_relates (
	userid INT NOT NULL,
	friendid INT NOT NULL,
	datetime_makefriend DATETIME,
 FOREIGN KEY (userid) REFERENCES users(userid),
 FOREIGN KEY (friendid) REFERENCES users(userid),
 primary key (userid, friendid)
);

CREATE TABLE IF NOT EXISTS unhide_userminds (
	unhide_usermindid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	userid INT NOT NULL,
	message_data MEDIUMTEXT,
	datetime_unhide DATETIME,
 FOREIGN KEY (userid) REFERENCES users (userid)
);

CREATE TABLE IF NOT EXISTS chat_groups(
	groupid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	group_name VARCHAR(511) NOT NULL,
	creator INT NOT NULL,
	datetime_create DATETIME,
 FOREIGN KEY (creator) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS member_of_chat_groups(
	groupid INT NOT NULL,
	userid INT NOT NULL,
	datetime_join DATETIME,
 FOREIGN KEY (groupid) REFERENCES chat_groups(groupid),
 FOREIGN KEY (userid) REFERENCES users(userid),
 primary key (groupid, userid)
);



CREATE TABLE IF NOT EXISTS part_of_reals (
	part_of_realid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	datetime_split DATETIME
);

CREATE TABLE IF NOT EXISTS build_stories (
	userid INT NOT NULL,
	unhide_usermindid INT,
	part_of_realid INT NOT NULL,
	datetime_join DATETIME,
	FOREIGN KEY (userid) REFERENCES users (userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_userminds(Unhide_usermindid),
	FOREIGN KEY (part_of_realid) REFERENCES part_of_reals (Part_of_realid),
	PRIMARY KEY (userid, unhide_usermindid, part_of_realid)
);


CREATE TABLE IF NOT EXISTS make_storytrends (
	maketter INT NOT NULL,
	sheep INT NOT NULL,
	storyid INT NOT NULL,
	datetime_maketrend DATETIME,
	FOREIGN KEY (maketter) REFERENCES users(userid),
	FOREIGN KEY (sheep) REFERENCES users(userid),
	FOREIGN KEY (storyid) REFERENCES part_of_reals (part_of_realid),
	PRIMARY KEY (maketter, sheep, storyid , createdAt, updatedAt )
);

CREATE TABLE IF NOT EXISTS unknow_stories (
	userid INT NOT NULL,
	part_of_realid INT NOT NULL,
	datetime_read DATETIME,
	FOREIGN KEY (userid) REFERENCES users(userid),
	FOREIGN KEY (part_of_realid) REFERENCES part_of_reals (part_of_realid),
	PRIMARY KEY (userid, part_of_realid)
);

CREATE TABLE IF NOT EXISTS say_to_friends (
	receiverid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	datetime_tell DATETIME,
	datetime_read DATETIME,
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_userminds(unhide_usermindid),
	FOREIGN KEY (receiverid) REFERENCES users(userid),
	PRIMARY KEY (receiverid, unhide_usermindid)
);

CREATE TABLE IF NOT EXISTS say_to_groups (
	tellerid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	groupid INT NOT NULL,
	datetime_tell DATETIME,
	FOREIGN KEY (tellerid) REFERENCES users(userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_userminds(unhide_usermindid),
	FOREIGN KEY (groupid) REFERENCES chat_groups(groupid),
	FOREIGN KEY (groupid, tellerid) REFERENCES member_of_chat_groups (groupid, userid),
	PRIMARY KEY (tellerid, unhide_usermindid)
);

CREATE TABLE IF NOT EXISTS unread_groups (
	readerid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	groupid INT NOT NULL,
	datetime_read DATETIME,
	FOREIGN KEY (readerid) REFERENCES users(userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_userminds(unhide_usermindid),
	FOREIGN KEY (groupid) REFERENCES chat_groups(groupid),
	FOREIGN KEY (groupid, readerid) REFERENCES member_of_chat_groups (groupid, userid),
	PRIMARY KEY (readerid, unhide_usermindid)
);


use githubideanodejswebapp;

select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login
 FROM unhide_userminds c, member_of_chat_groups m, users ca, chat_groups cg, say_to_groups s
 WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='1' AND m.userid = '1')
 ORDER BY c.datetime_unhide DESC, c.unhide_usermindid DESC limit 30;

select distinct a.unhide_usermindid, a.userid, a.message_data, a.datetime_unhide, a.username, a.login, u.datetime_read,u.readerid FROM (select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login 
FROM unhide_userminds c, member_of_chat_groups m, users ca, chat_groups cg, say_to_groups s 
WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='1' AND m.userid = '1') 
ORDER BY c.datetime_unhide DESC, c.unhide_usermindid DESC) a
LEFT JOIN unread_groups u ON u.readerid='1' AND (u.unhide_usermindid = a.unhide_usermindid OR u.unhide_usermindid is NULL) ORDER BY a.unhide_usermindid DESC LIMIT 30;


select count(groupid) from (select u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_userminds c, unread_groups u, users ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC LIMIT 100) a,
(
) b WHERE a.groupid = b.groupid;

select distinct groupid from (select u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_userminds c, unread_groups u, users ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC LIMIT 100) z

select count(groupid), groupid from (select u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_userminds c, unread_groups u, users ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC LIMIT 100) a;

GROUP BY
UNION
//== get notify
select COUNT(u.groupid), u.groupid 
FROM unhide_userminds c, unread_groups u, users ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' GROUP BY u.groupid ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC LIMIT 100


INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username1', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username2', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username3', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username4', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username5', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username6', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username7', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username8', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username9', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username10', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username11', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username12', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username13', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username14', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username15', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username16', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username17', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username18', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username19', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username20', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username21', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username22', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username23', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username24', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username25', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );
INSERT INTO users ( username, password, email, createdAt, updatedAt ) value ('username26', '123456', "abc@abc", '2021-03-02 08:08:49', '2021-03-02 08:08:49' );


INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('3', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('4', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('5', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('5', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('7', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('8', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('9', '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('10', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('3', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('4', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('5', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('6', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('7', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('8', '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('9', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('10', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relatess ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('1', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '11', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '12', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '13', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '14', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '15', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '16', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '17', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '18', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '19', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '20', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '21', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('27', '22', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '11', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '12', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '13', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '14', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '15', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '16', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '17', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '18', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '18', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '19', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '20', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO friend_relates ( userid, friendid, datetime_makefriend, createdAt, updatedAt ) value ('2', '21', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unhide_userminds (userid, message_data, datetime_unhide , createdAt, updatedAt ) value ('1', 'bla bla bla', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name3', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name4', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name7', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name8', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name9', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name10', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name11', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name12', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name13', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name14', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name15', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name16', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name17', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name18', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name19', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name20', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name21', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name22', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name23', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name24', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name25', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name26', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name27', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name28', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name29', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name30', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name31', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name32', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name33', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name34', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name35', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name36', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name37', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name38', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name39', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO chat_groups (group_name, creator, datetime_create , createdAt, updatedAt )  value ( 'group name40', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '3', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '4', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '5', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '6', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '7', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '8', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '1', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '2', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '3', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '4', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '5', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '6', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '7', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '8', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '1', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '2', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '3', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '4', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '5', '', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '6', '71', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '7', '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '8', '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '1', '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '2', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '3', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '4', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '5', '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '6', '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '7', '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '8', '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '11', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '12', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '13', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '14', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '15', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '16', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '17', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '18', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '19', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '20', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '21', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '22', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '23', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '24', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '25', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '26', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '27', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '28', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '29', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '11', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '12', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '13', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '14', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '15', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '16', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '17', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '18', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '19', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '20', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '21', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '22', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '23', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '24', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '25', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '26', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '27', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '28', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '29', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '30', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '31', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '32', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '33', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '34', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '35', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '36', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '37', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '38', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '39', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '40', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');

INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '11', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '12', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '13', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '14', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '15', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '16', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '17', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '18', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '19', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '20', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '21', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '22', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '23', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '24', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '25', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '26', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '27', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '28', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '29', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '30', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '31', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '32', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '33', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '34', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '35', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '36', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '37', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '38', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '39', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO member_of_chat_groups (groupid, userid, datetime_join , createdAt, updatedAt )value ( '40', '27', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '4', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '5', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '6', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '7', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '8', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '9', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '10', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '11', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '12', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '13', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO part_of_reals (part_of_realid, datetime_split , createdAt, updatedAt ) value ( '14', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '1', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '2', '2', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '3', '3', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '3', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '2', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '1', '4', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '2', '4', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '3', '4', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '4', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '3', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '2', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '1', '6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '2', '6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO build_stories (userid, unhide_usermindid, part_of_realid, datetime_join , createdAt, updatedAt ) value ( '3', '8', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
	

INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '2', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '3', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '4', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '6', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '7', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '8', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '1', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '3', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '4', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '5', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '2', '6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '2', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO make_storytrends (maketter, sheep, storyid , createdAt, updatedAt ) value ( '1', '4', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '2', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '3', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '1', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '3', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '4', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unknow_stories (userid, part_of_realid, datetime_read  , createdAt, updatedAt )value ( '5', '3', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');



INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '1', '1','2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '2', '2', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '3', '1', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '4', '3', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '5', '3', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '1', '2', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '2', '2', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '3', '3', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '4', '1', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '5', '2', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '1', '3', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '2', '1', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell, datetime_read  , createdAt, updatedAt )value ( '3', '2', '2021-03-02 08:08:49', NULL, '2021-03-02 08:08:49', '2021-03-02 08:08:49');

INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '3', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '4', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '7', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '8', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '9', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '11', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell , createdAt, updatedAt ) value ( '1', '10', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');	
	
	
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '1', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '2', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '3', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '4', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '5', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '6', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '7', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '8', '2', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');
INSERT INTO unread_groups (readerid, unhide_usermindid, groupid, datetime_read , createdAt, updatedAt ) value ( '1', '9', '1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');












//=============DROP==============
	
use githubideanodejswebapp;


delete from unread_groups;
delete from say_to_groups;
delete from say_to_friends;
delete from unknow_stories;
delete from make_storytrends;
delete from build_stories;
delete from part_of_reals ;
delete from member_of_chat_groups;
delete from chat_groups;
delete from unhide_userminds;
delete from friend_relates;
delete from users;

drop table unread_groups;
drop table say_to_groups;
drop table say_to_friends;
drop table unknow_stories;
drop table make_storytrends;
drop table build_stories;
drop table part_of_reals ;
drop table member_of_chat_groups;
drop table chat_groups;
drop table unhide_userminds;
drop table friend_relates;
drop table users;


///////////////////////=============================
delete from private_message_data;
delete from chat_groups_message_data;
delete from member_of_chat_groups;
delete from chat_groups;
delete from friend_relates;
delete from users;



drop table chat_groups_message_unread;
drop table private_message_data;
drop table chat_groups_message_data;
drop table member_of_chat_groups;
drop table chat_groups;
drop table friend_relates;
drop table users;



INSERT INTO ckeditordata ( doc_name, content, creatdate ) value ('name1', 'data1', '2021-03-02 08:08:49', '2021-03-02 08:08:49', '2021-03-02 08:08:49');


drop table customers;
drop table ckeditordata;



CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255));

CREATE TABLE IF NOT EXISTS ckeditordata (
	id_doc INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	doc_name VARCHAR(255) NOT NULL,
	content MEDIUMTEXT,
	link VARCHAR (511),
	creatdate DATETIME
	);
	
CREATE TABLE IF NOT EXISTS chat_groups_message_data(
	id_message INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	id_group INT,
	sender INT,
	message_data MEDIUMTEXT,
	datetime_send DATETIME,
 FOREIGN KEY (id_group) REFERENCES chat_groups(id_group),
 FOREIGN KEY (sender) REFERENCES users(userid),
 CONSTRAINT member_have_chat_groups_ct FOREIGN KEY (id_group, sender)
 REFERENCES member_of_chat_groups(id_group, userid)
);


CREATE TABLE IF NOT EXISTS private_message_data(
	id_message INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	sender INT,
	receiver INT,
	message_data MEDIUMTEXT,
	datetime_send DATETIME,
 FOREIGN KEY (sender) REFERENCES users(userid),
 FOREIGN KEY (receiver) REFERENCES users(userid)
);

