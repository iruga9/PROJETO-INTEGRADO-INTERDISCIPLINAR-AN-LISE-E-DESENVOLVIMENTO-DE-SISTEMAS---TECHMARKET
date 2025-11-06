DROP DATABASE IF EXISTS TechMarket;
CREATE DATABASE TechMarket;
use TechMarket;

DROP TABLE IF EXISTS Contas;
CREATE TABLE Contas (
    id_conta INT AUTO_INCREMENT PRIMARY KEY,
    nome_conta VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS Transacoes;
CREATE TABLE Transacoes (
    id_transacao INT AUTO_INCREMENT PRIMARY KEY,
    id_conta INT NOT NULL,
    tipo ENUM('CREDITO','DEBITO') NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    data_transacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conta) REFERENCES Contas(id_conta),
    INDEX idx_conta_data (id_conta, data_transacao)
);


INSERT INTO Contas (nome_conta) VALUES
('João Silva'),
('Maria Oliveira');

INSERT INTO Transacoes (id_conta, tipo, valor, data_transacao) VALUES
(1, 'CREDITO', 500.00, '2025-10-01 10:00:00'),
(1, 'DEBITO', 200.00, '2025-10-05 15:00:00'),
(1, 'CREDITO', 300.00, '2025-10-10 09:30:00'),
(1, 'DEBITO', 100.00, '2025-10-15 14:45:00'),
(1, 'CREDITO', 700.00, '2025-10-20 08:00:00'),
(2, 'CREDITO', 1000.00, '2025-10-02 12:00:00'),
(2, 'DEBITO', 500.00, '2025-10-07 16:30:00'),
(2, 'CREDITO', 200.00, '2025-10-12 11:00:00');


DELIMITER // 

DROP procedure if exists EP_ExtratoConta;
CREATE PROCEDURE EP_ExtratoConta(
    in p_id_conta INT,
    in p_data_inicio DATE
)
BEGIN
	DECLARE saldo_atual DECIMAL(15,2);

select sum(case
		when tipo='CREDITO' then valor
        else -valor
		end)
INTO saldo_atual
FROM Transacoes
where id_conta=p_id_conta;

select 
	p_id_conta as 'ID_conta',
    saldo_atual as 'Saldo_Atual';
    

select 
	id_transacao as 'ID_Transacao',
    tipo as 'Tipo_Transacao',
    valor as 'Valor_transacao',
    data_transacao as 'Data_Transacao'
FROM Transacoes
where id_conta =p_id_conta
 and data_transacao >= p_data_inicio
order by data_transacao desc
limit 10;

END //
DELIMITER ;

CALL EP_ExtratoConta(1,DATE_SUB(CURDATE(),INTERVAL 30 DAY));
CALL EP_ExtratoConta(2,'2025-10-01');