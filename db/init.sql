begin;

create table apps(
    id                      serial  not null primary key,
    package_name            text    not null unique,
    csm_url                 text    not null unique,
    playstore_url           text    not null unique,
    any_good                text    not null,
    need_to_know            text    not null,
    age_rating              text    not null,
    min_age                 integer not null,
    one_liner               text    not null,
    rating                  integer not null
);

create table guide_types(
    id              serial          not null primary key,
    guide_name      text            not null unique,
    guide_label     text            not null unique
);

create table parent_guides(
    id              serial          not null unique,
    guide_type      text            not null references guide_types(id),
    apps_id         serial          not null references apps(id),
    score           integer         not null,
    description     text            not null,
    primary key(guide_type)
);

insert into table guide_type(guide_name, guide_label) values ('Ease of Play','playability');
insert into table guide_type(guide_name, guide_label) values ('Violence & Scariness','violence');
insert into table guide_type(guide_name, guide_label) values ('Sexy Stuff', 'sex');
insert into table guide_type(guide_name, guide_label) values ('Language', 'language');
insert into table guide_type(guide_name, guide_label) values ('Consumerism','consumerism');
insert into table guide_type(guide_name, guide_label) values ('Drinking, Drugs, & Smoking', 'drugs');




commit;