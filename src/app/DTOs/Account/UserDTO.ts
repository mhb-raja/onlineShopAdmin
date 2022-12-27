export interface LoginDTO {
    email: string;
    password: string;
}

export interface UserMiniDTO{
    
}

export interface UserDTO extends LoginDTO {
    id: number;
    firstname: string;
    lastname: string;
    mobile: string;
    address: string;
}

export interface loggedInUserDTO extends UserDTO
{
    token:string;
    expireTime :number
}
