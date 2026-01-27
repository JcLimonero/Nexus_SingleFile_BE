-- Vista para obtener idClient (HeaderClient.Id) por ndDMS y IdAgency.
-- Usada por repair-client-relation para actualizar File.IdClient.
CREATE OR REPLACE VIEW view_client_relations AS
	select
	    `hc`.`IdClient` as `IdClient`,
	    `hc`.`Id` as `IdHeaderClient`,
	    `ctr`.`IdTotalDealer` as `ndDMS`,
	    `ctr`.`IdAgency` as `IdAgency`,
	    c.razonsocial
	from
	    ((`single_file`.`headerclient` `hc`
	join `single_file`.`client_total_relation` `ctr` on
	    ((`hc`.`Id` = `ctr`.`idHeaderClient`)))
	join `single_file`.`client` `c` on
	    ((`c`.`Id` = `hc`.`IdClient`)));
