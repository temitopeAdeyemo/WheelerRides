  CREATE TYPE deliveryMethods AS ENUM ('Home Delivery', 'Pick Up');
  CREATE TYPE paymentStatuss AS ENUM ('Not Paid Or Unsuccessful', 'Successful');
  CREATE TABLE Car(id SERIAL PRIMARY KEY NOT NULL,
                    carname int not null,
                    brandname varchar(30) NOT NULL,
  					manufacturer varchar(30) NOT NULL,
  				  	caryear varchar(30) NOT NULL,
   				  	pictures varchar(30) NOT NULL,
  					rentperday 	Date NOT NULL,
  				 	fueltype Date NOT NULL,
  					geartype varchar(30) NOT NULL,
  				  	availability boolean DEFAULT FALSE,
                    );
