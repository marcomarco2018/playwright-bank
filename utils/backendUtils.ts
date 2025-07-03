import { APIRequestContext, expect } from "@playwright/test";





export class BackendUtils {


    static async createNewUserByAPI( request: APIRequestContext, user: any) {

        const email = (user.email.split('@')[0] + Date.now().toString() + '@' + user.email.split('@')[1]);
        const response = await request.post('http://localhost:4000/api/auth/signup', {

            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: email,
                password: user.password,
                
            }
        })

        expect(response.status()).toBe(201);
        return { email: email, password: user.password };

        
    }


}
    
