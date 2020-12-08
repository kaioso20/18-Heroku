--## drop tablE if exists TB_HEROIS;
create table TB_HEROIS(
    ID bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    NOME TEXT NOT NULL,
    PODER TEXT NOT NULL
);

--create
INSERT INTO TB_HEROIS(nome, poder) VALUES ('Flash', 'Velocidade');
INSERT INTO TB_HEROIS(nome, poder) VALUES ('Aquaman', 'Falar com os animais');
INSERT INTO TB_HEROIS(nome, poder) VALUES ('Batman', 'Dinheiro');

--read
select * from TB_HEROIS;
select * from TB_HEROIS where nome = 'Flash';

--update
update TB_HEROIS 
set nome = 'Goku', poder = 'Deus' 
where nome= 'Flash';

update TB_HEROIS 
set nome = 'Flash', poder = 'Velocidade' 
where nome= 'Goku';

--delete
delete from TB_HEROIS where id=2;