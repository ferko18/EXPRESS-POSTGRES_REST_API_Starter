CREATE TABLE "users" (
	"user_id" serial NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "task" (
	"task_id" serial NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"duedate" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "task_pk" PRIMARY KEY ("task_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "envitee" (
	"envitee_id" serial NOT NULL,
	"user_id" int NOT NULL,
	"task_id" int NOT NULL,
	CONSTRAINT "envitee_pk" PRIMARY KEY ("envitee_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "task_owner" (
	"owner_id" serial NOT NULL,
	"user_id" int NOT NULL,
	"task_id" int NOT NULL,
	CONSTRAINT "task_owner_pk" PRIMARY KEY ("owner_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "agenda" (
	"agenda_id" serial NOT NULL,
	"task_id" int NOT NULL,
	CONSTRAINT "agenda_pk" PRIMARY KEY ("agenda_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "envitee" ADD CONSTRAINT "envitee_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "envitee" ADD CONSTRAINT "envitee_fk1" FOREIGN KEY ("task_id") REFERENCES "task"("task_id");

ALTER TABLE "task_owner" ADD CONSTRAINT "task_owner_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "task_owner" ADD CONSTRAINT "task_owner_fk1" FOREIGN KEY ("task_id") REFERENCES "task"("task_id");

ALTER TABLE "agenda" ADD CONSTRAINT "agenda_fk0" FOREIGN KEY ("task_id") REFERENCES "task"("task_id");

--create select function 
CREATE OR REPLACE FUNCTION getTask()
RETURNS SETOF task AS $$
BEGIN
  RETURN QUERY SELECT * FROM task;
END
$$ LANGUAGE plpgsql;

--getUser 
CREATE OR REPLACE FUNCTION getUser()
RETURNS SETOF users AS $$
BEGIN
  RETURN QUERY SELECT * FROM users;
END
$$ LANGUAGE plpgsql;



--how to run the function 
SELECT * FROM fx();