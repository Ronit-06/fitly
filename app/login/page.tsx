require('dotenv').config();

export default function login(){
    console.log(process.env.MONGODB_URI)
    return(
        <h1>Login Pagee</h1>
        
    )
}

