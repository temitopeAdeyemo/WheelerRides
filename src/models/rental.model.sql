  CREATE TYPE deliveryMethods AS ENUM ('Home Delivery', 'Pick Up');
  CREATE TYPE paymentStatuss AS ENUM ('Not Paid Or Unsuccessful', 'Successful');
  CREATE TABLE Rentals(id SERIAL PRIMARY KEY NOT NULL,
                    Car_id int not null, 
                    user_mongodb_id varchar(30) NOT NULL,
  					firstName varchar(30) NOT NULL,
  				  	lastName varchar(30) NOT NULL,
   				  	email varchar(30) NOT NULL,
  					pickUpDate 	Date NOT NULL,
  				 	returnDate Date NOT NULL,
  					deliveryType deliveryMethodEnum DEFAULT 'Home Delivery' NOT NULL,
  				  	reference_code varchar(30) DEFAULT 'No Payment yet.',
   				  	totalAmount varchar(30) NOT NULL,
 					paymentStatus paymentStatusEnum,
  				 	transactionDate varchar(30) DEFAULT now() NOT NULL
                      );