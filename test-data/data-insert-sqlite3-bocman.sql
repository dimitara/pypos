--initialize data in empty database
--sqlite> .read data-insert-sqlite3.sql

insert into pos_table (number, nickname, taken) values (1, 'Ботев', 0);
insert into pos_table (number, nickname, taken) values (2, 'Вазов', 0);
insert into pos_table (number, nickname, taken) values (3, 'Яворов', 0);
insert into pos_table (number, nickname, taken) values (4, 'Славейков', 0);
insert into pos_table (number, nickname, taken) values (5, 'Радичков', 0);
insert into pos_table (number, nickname, taken) values (6, 'Димов', 0);
insert into pos_table (number, nickname, taken) values (7, 'Йовков', 0);
insert into pos_table (number, nickname, taken) values (8, 'Вапцаров', 0);
insert into pos_table (number, nickname, taken) values (9, 'Далчев', 0);
insert into pos_table (number, nickname, taken) values (10, 'Талев', 0);
insert into pos_table (number, nickname, taken) values (11, 'Лилиев', 0);
insert into pos_table (number, nickname, taken) values (12, 'Пасков', 0);

insert into pos_categoryType (name) values ('bar');
insert into pos_categoryType (name) values ('kuh');
insert into pos_categoryType (name) values ('ska');

insert into pos_category (name, neatName, [order], categoryType_id) values ('Супи', 'soups', 1, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Салати', 'salads', 2, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Предястия', 'appetizer', 3, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Скара', 'grill', 4, 3);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Ястия', 'meals', 5, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Безалкохолни', 'alc-free', 6, 1);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Напитки', 'drinks', 7, 1);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Бира и вино', 'beer', 8, 1);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Алкохол', 'alcohol', 9, 1);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Десерти', 'desserts', 10, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Специални', 'specials', 11, 2);
insert into pos_category (name, neatName, [order], categoryType_id) values ('Хляб', 'bread', 12, 3);

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Минерална вода', 'малка', 6, 1.19, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Минерална вода', 'голяма', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кока кола', '330ml', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Фанта', '330ml', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Спрайт', '330ml', 6, 1.99, 2, -1, 1); 
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Тоник', '330ml', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Сода', '330ml', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Капи', '330ml', 6, 1.99, 2, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Студен чай', '500ml', 6, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Айрян с кимион', '500ml', 6, 1.99, 2, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Айрян', '500ml', 6, 1.99, 2, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Шейк банан', '500ml', 6, 1.99, 2, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Фрапе бяло', '500ml', 6, 1.99, 2, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Фрапе черно', '500ml', 6, 1.99, 2, -1, 1);        


insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Зеленчукова крем', '', 1, 2.99, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Таратор', '', 1, 2.99, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Рибена', '', 1, 3.49, 3, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Шкембе', '', 1, 1.99, 4, -1, 1);

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Папията', 'домати, песто, моцарела', 2, 3.49, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Гьозум', 'домати белени, джоджен пасиран', 2, 3.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Печени чушки', 'чесън и копър', 2, 3.49, 3, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Боцмана', 'варен боб, пресен лук', 2, 1.99, 4, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Снежанка', '', 2, 1.99, 5, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кьопоолу', '', 2, 1.99, 6, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Шопска', '', 2, 1.99, 7, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Гръцка', '', 2, 1.99, 8, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Мешана', '', 2, 1.99, 9, -1, 1);

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Брускета', 'босилек и домат', 3, 2.99, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Брускета', 'авокадо и чесън', 3, 2.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Румънска бобена разядка', '', 3, 2.99, 3, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Хумус', '', 3, 2.99, 4, -1, 1);    


insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Телешки стек', '', 4, 12.99, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Телешки шашлик', '', 4, 12.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Телешки дроб', '', 4, 12.99, 3, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Свински дроб', '', 4, 12.99, 4, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Ребърца', '', 4, 12.99, 5, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Вратна пържола', '', 4, 12.99, 6, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Свинско филе', '', 4, 12.99, 7, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кюфтета', 'с кайма от месо', 4, 12.99, 8, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кебапчета', 'с кайма от месо', 4, 12.99, 9, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пилешки крилца', '', 4, 12.99, 10, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пилешко филе', '', 4, 12.99, 11, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пилешка пържола', '', 4, 12.99, 12, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Мешана скара', '', 4, 12.99, 13, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Тиквички', 'с чеснов сос', 4, 12.99, 14, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Зеленчуков шашлик', '', 4, 12.99, 15, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Патладжан', 'с чеснов сос', 4, 12.99, 16, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Ципура', '', 4, 12.99, 17, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Скумрия', '', 4, 12.99, 18, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Лаврак', '', 4, 12.99, 19, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Чернокоп', '', 4, 12.99, 20, -1, 1);                    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Калмари цели', '', 4, 12.99, 21, -1, 1);                    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пъстърва', '', 4, 12.99, 22, -1, 1);                    

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пържени картофи', '', 5, 1.19, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пържени картофи', 'със сирене', 5, 1.19, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Попчета', '', 5, 1.19, 3, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Сафрид', '', 5, 1.19, 4, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Скариди', '', 5, 1.19, 5, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Задушени миди', '', 5, 1.19, 6, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Фритата', '', 5, 1.19, 7, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Тортия', 'с лук и картофи', 5, 1.19, 8, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Тортия', 'с патладжан', 5, 1.19, 9, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Сирене', 'натюр', 5, 1.19, 10, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Сос за риба', '', 5, 1.19, 11, -1, 1);            

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Чай', '', 7, 1.19, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кафе', '', 7, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Капучино', '', 7, 1.49, 3, -1, 1);

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бургаско', '', 8, 1.19, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Каменица', '', 8, 1.19, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Каменица лайм', '', 8, 1.19, 3, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Каменица грейпфрут', '', 8, 1.19, 4, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Старопрамен', '', 8, 1.19, 5, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бекс', '', 8, 1.19, 6, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бяло вино', 'бутилка', 8, 1.19, 7, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Розе', 'бутилка', 8, 1.19, 8, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Червено вино', 'бутилка', 8, 1.19, 9, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бяло наливно', 'чаша', 8, 1.19, 10, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бяло наливно', 'кана', 8, 1.19, 11, -1, 1);                    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Розе наливно', 'чаша', 8, 1.19, 12, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Розе наливно', 'кана', 8, 1.19, 13, -1, 1);                    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Червено наливно', 'чаша', 8, 1.19, 14, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Червено наливно', 'кана', 8, 1.19, 15, -1, 1);

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бургаска', 'обикновена', 9, 1.19, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бургаска', 'мускатова', 9, 1.99, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Бургас', '63', 9, 1.49, 3, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Водка', 'българска', 9, 1.49, 4, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Водка', 'ABSOLUT', 9, 1.49, 5, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Джин', 'български', 9, 1.49, 6, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Джин', 'Gordons', 9, 1.49, 7, -1, 1);        
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Мастика', '', 9, 1.49, 8, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Мента', '', 9, 1.49, 9, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кампари', '', 9, 1.49, 10, -1, 1);            
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Текила внос', '', 9, 1.49, 11, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Узо Пломари', '', 9, 1.49, 12, -1, 1);                
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Перно', '', 9, 1.49, 13, -1, 1);         
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Уиски', 'Jameson', 9, 1.49, 14, -1, 1);         
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Уиски', 'Jack Daniels', 9, 1.49, 15, -1, 1);             
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Уиски', 'Johnnie Walker', 9, 1.49, 16, -1, 1);             

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Крем супа', 'детско', 11, 1.29, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Пилешки хапки', 'корнфлейкс', 11, 1.29, 2, -1, 1);    
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Кашкавал пане', '', 11, 1.29, 3, -1, 1);        

insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Питка', 'на жар', 12, 1.29, 1, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Питка', 'със зехтин и самардала', 12, 0.19, 2, -1, 1);
insert into pos_product (name, description, category_id, price, [order], availability, available) values ('Филийка', '', 12, 1.29, 3, -1, 1);
