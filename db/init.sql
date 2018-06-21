begin;

create table app_infos(
    id                  serial          not null primary key,
    app_name            text,
    age_rating          text,
    csm_rating          int,
    one_liner           text,
    csm_uri             text,
    play_store_url      text,
    app_package_name    text,
); 

create table guidance_categories(
    id                  serial      not null primary key,
    title               text        not null unique
);

create table app_guidances(
    guidance_id         serial      not null,
    app_id              serial      not null references app_infos(id),
    category            serial      not null references guidance_categories(title),
    age_rating          int         not null,
    description         text        not null
);

insert into guidance_categories(id, title)
    values(0, 'playability');

insert into guidance_categories(id, title)
    values(1, 'violence');

insert into guidance_categories(id, title)
    values(2, 'sex');

insert into guidance_categories(id, title)
    values(3, 'language');

insert into guidance_categories(id, title)
    values(4, 'consumerism');

insert into guidance_categories(id, title)
    values(5, 'drugs');

insert into guidance_categories(id, title)
    values(6, 'educational');

commit;
