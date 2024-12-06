import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast_error, toast_success } from "../../backend/toast";
import { checkUsername, checkEmail, createAccount } from "../../backend/backend";
import { checkPassword } from "../../backend/utils";

import Carousel from "../custom components/Carousel/Carousel";
import Input from "../custom components/Input/Input";
import Card from "../custom components/Card/Card";
import Button from "../custom components/Button/CButton";

import './UserCreationStyles.css';

export default function UserCreation(){
    const[username, setUsername] = useState('');
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[password, setPassword] = useState('');
    const[email, setEmail] = useState('');
    const[isLoading, setIsLoading] = useState(false);
    const carouselRef = useRef();

    const navigate = useNavigate();

    const onClickEvent = async() => {
        setIsLoading(true)
        const isPasswordValid = handlePassword();
        if(isPasswordValid){
            try{
            const res = await createAccount(username, password, firstName, lastName, email);
            if(res !== null){
                navigate('/');
                toast_success('Account successfully created!')
                setIsLoading(false)
            }
            }catch(err){
                setIsLoading(false)
            }
        }
    }
    const handleNext = () => {
        if (carouselRef.current) {
          carouselRef.current.nextSlide(); 
        }
      };
    
      const handlePrev = () => {
        if (carouselRef.current) {
          carouselRef.current.prevSlide(); 
        }
      };

      const handleUsername = async() => {
        setIsLoading(true)
        if(username === ''){
            toast_error('username cannot be empty');
            setIsLoading(false)
            return;
        }else if(username.replaceAll(' ', "").length < username.length){
            toast_error('username cannot contain any spaces');
            setIsLoading(false);
            return;
        }
        const condition = await checkUsername(username);
        console.log(condition)
        if(condition === null){
            setIsLoading(false)
            return;
        }
        if(condition){
            setIsLoading(false)
            handleNext();
        }else if (!condition){
            setIsLoading(false)
            toast_error('Username in use, please use another username')
        }
      }

      const handleName = () => {
        if(firstName !== '' && lastName !== ''){
            handleNext();
        }else{
            toast_error('Names cannot be empty!');
        }
      }

      const handleEmail = async() => {
        if(email === ''){
            toast_error('Please enter an email')
            return;
        }
        setIsLoading(true);
        const condition = await checkEmail(email);
        if(condition === null){
            setIsLoading(false)
            return;
        }
        if(condition){
            setIsLoading(false)
            handleNext();
        }else{
            setIsLoading(false)
            toast_error('email unavailable, please login or choose a different email')
        }
      }

      const handlePassword = () => {
        setIsLoading(true)
        const isPasswordUsable = checkPassword(password);
        if(isPasswordUsable){
            setIsLoading(false)
            return true;
        }else{
            setIsLoading(false)
            toast_error('Password needs to be 8 characters or more')
            return false;
        }
      }

    return (
        <div className="CreationContainer">
            <span>Create a new account</span>
            <Card className="column-center gap20">
                <Carousel ref={carouselRef}>
                <div className="CarouselContent column-center gap20">
                    <p>What should we call you?</p>
                    <Input
                        placeholder='First Name'
                        setText={setFirstName}
                        value = {firstName}
                        inputStyle = "Outline"
                        className='width80'
                    /><Input
                    placeholder='Last Name'
                    setText={setLastName}
                    value = {lastName}
                    inputStyle = "Outline"
                    className='width80'
                />
                    <Button
                        onClick={() => handleName()}
                        Title={"Next"}
                        ButtonType={'Solid'}
                        isLoading={isLoading}
                    />
                </div>

                <div className="CarouselContent column-center gap20">
                    <p>Select a username for your account!</p>
                    <Input
                        placeholder='Username'
                        setText={setUsername}
                        value = {username}
                        inputStyle = "Outline"
                        className='width80'
                    />
                    <Button
                        onClick={handleUsername}
                        Title={"Next"}
                        ButtonType={'Solid'}
                        isLoading={isLoading}
                    />
                    <Button
                        onClick={handlePrev}
                        Title={"Back"}
                        ButtonType={'Solid'}
                    />
                </div>

                <div className="CarouselContent column-center gap20">
                    <p>Now enter an email for the account</p>
                    <Input
                        placeholder='Email'
                        setText={setEmail}
                        value={email}
                        type='email'
                        inputStyle="Outline"
                        className="width80"
                    />
                    <Button
                        onClick={handleEmail}
                        Title={"Next"}
                        ButtonType={'Solid'}
                        isLoading={isLoading}
                    />
                    <Button
                        onClick={handlePrev}
                        Title={"Back"}
                        ButtonType={'Solid'}
                    />
                </div>

                <div className="CarouselContent column-center gap20">
                    <p>...and a password to access the account</p>
                    <Input
                        placeholder='Password'
                        setText={setPassword}
                        value={password}
                        type='password'
                        inputStyle="Outline"
                        className="width80"
                    />
                    <Button
                        Title={"Create Account"}
                        onClick={onClickEvent}
                        ButtonType={'Solid'}
                        className="width80"
                        isLoading={isLoading}
                    />
                </div>
                </Carousel>

                <Button 
                Title={"Back to Login"}
                onClick={() => navigate('/')}
                ButtonType="Text"
                className='width80'
                />
            </Card>
        </div>
    )
}