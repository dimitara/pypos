





    ----POSTGRES

insert into pos_table (number, nickname, taken) values (1, 'Ботев', 'F');
insert into pos_table (number, nickname, taken) values (2, 'Вазов', 'F');
insert into pos_table (number, nickname, taken) values (3, 'Яворов', 'F');
insert into pos_table (number, nickname, taken) values (4, 'Славейков', 'F');
insert into pos_table (number, nickname, taken) values (5, 'Радичков', 'F');
insert into pos_table (number, nickname, taken) values (6, 'Димов', 'F');
insert into pos_table (number, nickname, taken) values (7, 'Йовков', 'F');
insert into pos_table (number, nickname, taken) values (8, 'Вапцаров', 'F');
insert into pos_table (number, nickname, taken) values (9, 'Далчев', 'F');
insert into pos_table (number, nickname, taken) values (10, 'Талев', 'F');

insert into pos_categoryType (name) values ('bar');
insert into pos_categoryType (name) values ('kuh');
insert into pos_categoryType (name) values ('ska');

insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Супи', 'soups', 1, 2);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Салати', 'salads', 2, 2);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Ястия', 'meals', 3, 2);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Скара', 'drinks', 4, 3);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Напитки', 'drinks', 5, 1);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Десерти', 'desserts', 6, 2);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Други', 'others', 7, 2);
insert into pos_category (name, "neatName", "order", "categoryType_id") values ('Специални', 'specials', 8, 2);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Рибена', '3 вида риба, люта', 1, 2.99, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Пилешка', 'застроена', 1, 2.99, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Шкембе', '', 1, 3.49, 3, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Таратор', 'орехи, чесън', 1, 1.99, 4, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Шопска', 'лук, печени чушки', 2, 3.49, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Миди', 'задушени миди с лук', 2, 3.99, 2, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Снежанка', 'чесън', 2, 3.49, 3, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Зеле и моркови', 'орехи, чесън', 2, 1.99, 4, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Сафрид', 'пържен', 3, 4.49, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Барбун', 'пържен', 3, 5.99, 4, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Цаца', 'пържена', 3, 2.99, 5, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Паламуд', 'на скара', 4, 12.99, 2, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Чернокоп', 'на скара', 4, 12.99, 3, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Бургаско', '300ml', 5, 1.19, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Бургаско', '500ml', 5, 1.99, 2, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Кола', '330ml', 5, 1.49, 3, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Кафе', 'Лаваца', 5, 1.49, 4, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Сладолед', 'със смокини', 6, 3.49, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Шоколадова торта', 'с орехи', 6, 2.99, 2, -1);

insert into pos_product (name, description, category_id, price, "order", availability) values ('Хляб - питка', 'домашен', 7, 1.29, 1, -1);
insert into pos_product (name, description, category_id, price, "order", availability) values ('Хляб - филийка', 'препечена', 7, 0.19, 2, -1);