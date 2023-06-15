export interface UserData{
    id:number;
    firstname:string;
    lastname:string;
    email:string;
    username:string;
    password:string;
    confirm_password:string;
}
export interface GroceryItem{
    productId: any,
    description: string,
    name: string,
    quantity:number,
    total:number, 
    imageURL: string,
    price: number,
    IsDeleted: boolean,
    userId: any,
    categoryId: number
}

