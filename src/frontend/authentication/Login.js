import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import Card from "../custom components/Card/Card";
import Button from "../custom components/Button/CButton";
import Input from "../custom components/Input/Input";
import { login } from "../../backend/backend";
import { useUser } from "../contexts/Context";
import { toast_error } from "../../backend/toast";
import './Login.css'

export default function Login() {
    const navigate = useNavigate();
    const[username, setUserName] = useState('');
    const[password, setPassword] = useState('')
    const[isLoading, setIsLoading] = useState(false);

    const { setUserData } = useUser()
    
    const onClickEvent = async() => {
        const user = await login(username, password);
        if(user!= null){
            setUserData(user);
            navigate('/dashboard');
        }else{
            toast_error('failed to login')
        }
    }

    return (
        <div className="LoginContainer">
            <Card className="column-center gap10">
                <span>Welcome</span>
                <Input
                    placeholder='Username'
                    setText={setUserName}
                    value={username}
                    type='email'
                    inputStyle="Outline"
                    className="width80"
                />

                <Input
                    placeholder='Password'
                    setText={setPassword}
                    value={password}
                    type='password'
                    inputStyle="Outline"
                    className="width80"
                />
                <Button
                Title={"Login"}
                onClick={onClickEvent}
                ButtonType='Outline'
                className="width60"
                isLoading={isLoading}
                />
                <Button 
                Title={"No Account?"}
                onClick={() => navigate('/newuser')}
                isLoading={isLoading}
                ButtonType='Text'
                className="width60"
                />
            </Card>
        </div>
    )
}