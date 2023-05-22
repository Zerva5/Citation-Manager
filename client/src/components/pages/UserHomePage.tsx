import { User } from "../../DataClasses";


export default function UserHomePage({user}: {user: User}) {

    return(
        <div>
            <h1>Home Page</h1>
            <h2>Welcome {user.name}</h2>
        </div>

    );

}