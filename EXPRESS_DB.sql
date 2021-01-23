select * from users_login;

select * from users;

select * from todos;

SELECT *, IF(p_id <= 1, 'A', IF(p_id <=3,  'B', 'c')) AS levels FROM todos;

UPDATE todos SET idx = idx + 1  WHERE idx >= 99999 order by idx DESC;

UPDATE todos SET idx = idx + 1 WHERE idx >= 250 order by idx DESC;
INSERT INTO `database_development`.`todos` (`idx`,`idx_key`,`p_id`, `levels`, `up_idx`, `bbs_eq`, `title`, `content`, `del_yn`, `user_eq`, `board_type`, `create_at`) VALUES ('250','123', '1', '1', '209', '80', '123111sd', 'dfsfd', 'n', '2100826', 'reply', '2021-01-21 06:42:15');


INSERT INTO todos (`idx`,`idx_key`,`p_id`, `levels`, `up_idx`, `bbs_eq`, `title`, `content`, `del_yn`, `user_eq`, `board_type`, `create_at`) VALUES ('250','123', '1', '1', '209', '80', '123111sd', 'dfsfd', 'n', '2100826', 'reply', '2021-01-21 06:42:15') ON DUPLICATE KEY UPDATE name='tez', email='tezpark@tez.kr';


출처: https://tez.kr/161 [Tez's Programming & IT]
INSERT INTO `database_development`.`todos` (`idx`,`idx_key`,`p_id`, `levels`, `up_idx`, `bbs_eq`, `title`, `content`, `del_yn`, `user_eq`, `board_type`, `create_at`) VALUES ('2524','123', '1', '1', '209', '80', '123111sd', 'dfsfd', 'n', '2100826', 'reply', '2021-01-21 06:42:15');

INSERT INTO `database_development`.`todos` (`idx`, `idx_key`, `p_id`, `levels`, `up_idx`, `bbs_eq`, `title`, `content`, `del_yn`, `user_eq`, `board_type`, `create_at`) 
VALUES
('2530', '123', '1', '1', '209', '80', '123111sd', 'dfsfd', 'n', '2100826', 'reply', '2021-01-21 06:42:15'),
('2531', '123', '1', '1', '209', '80', '123111sd', 'dfsfd', 'n', '2100826', 'reply', '2021-01-21 06:42:15');


 

select * from todos where del_yn = 'n' and bbs_eq = 284;

update todos set del_yn='y'  where idx = 202;



INSERT INTO table1 (id, value) VALUES (3, 300);


SELECT 
	seq, 
	CASE
		WHEN (u.seq BETWEEN 1 AND 3) THEN 'A'
		WHEN (u.seq BETWEEN 4 AND 6) THEN 'B'
        ELSE 'C'
	END AS case_result
FROM `user` u;

select * from todossss;

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

