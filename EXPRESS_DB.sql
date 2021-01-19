select * from users_login;

select * from users;

select * from todos;

select * from reply;

select * from post_file;

select * from users;

select * from todos WHERE content LIKE '%test%';

select * into users from todos;

select * from reply;

INSERT INTO reply (`idx`,`p_id`,`levels`,`bbs_eq`,`user_eq`,`create_at`,`title`,`content`,`del_yn`) 
VALUES (DEFAULT,1+1,0,241,2100826,now(),'rere123','rere123','n');


SELECT CONCAT( REPEAT( ' ', (COUNT(parent.name) - 1) ), node.name) AS name
FROM nav_map2 AS node,
     nav_map2 AS parent
WHERE node.lft BETWEEN parent.lft AND parent.rgt
GROUP BY node.name
ORDER BY node.lft;

