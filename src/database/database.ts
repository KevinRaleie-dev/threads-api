import { User } from "../entities/User";
import { createConnection } from "typeorm"

export const connection = async () => {

    try {
        await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'marketplace',
            entities: [User],
            synchronize: true,
            logging: false
        });
        
    } catch (error) {
        console.log(`Database error: ${error.message}`);
    }
}