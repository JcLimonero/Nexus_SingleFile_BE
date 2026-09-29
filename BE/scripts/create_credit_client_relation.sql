-- Relaciones de crédito entre un cliente principal y clientes relacionados.
-- Única por agencia + principal + relacionado.

CREATE TABLE IF NOT EXISTS Credit_Client_Relation (
    Id BIGINT NOT NULL AUTO_INCREMENT,
    IdAgency INT NOT NULL,
    IdClientPrincipal INT NOT NULL,
    IdAgencyRelacionado INT NOT NULL,
    IdClientRelacionado INT NOT NULL,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Id),
    UNIQUE KEY uq_credit_client_relation (IdAgency, IdClientPrincipal, IdAgencyRelacionado, IdClientRelacionado),
    KEY idx_credit_relation_principal (IdAgency, IdClientPrincipal),
    KEY idx_credit_relation_relacionado (IdAgencyRelacionado, IdClientRelacionado)
);
