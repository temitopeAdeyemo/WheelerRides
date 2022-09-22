 CREATE TABLE Payment(id SERIAL PRIMARY KEY NOT NULL,
                    	Rentals_id int not null, foreign key (Rentals_id) references Rentals(id), 
                    	reference_code varchar(30) NOT NULL,
  					amount int NOT NULL,
  				  	paymentdate date NOT NULL);