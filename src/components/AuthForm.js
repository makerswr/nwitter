import { authService } from "fbase";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,		
} from "firebase/auth";


const AuthForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(false);
	const [error, setError] = useState("");
	
	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let data;
			
			if (newAccount) {
				//create newAccount
				data = await createUserWithEmailAndPassword(authService, email, password);
			} else {
				// log in
				data =  await signInWithEmailAndPassword(authService, email, password);
			}
		} catch (error) {
			if(error.code === "auth/email-already-in-use"){
				setError("이미 가입된 아이디니까 바꿔 ㅋ");
				alert("fuck");
			}
			else {
				setError(error.code);				
			}
		}
	};
	
	const toggleAccount = () => setNewAccount((prev) => !prev);
	
	return (
		<>
			<form onSubmit={onSubmit}>
				<input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
				<input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
				<input type="submit" value={newAccount ? "Create Account": "Log In"} />
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Sign In" : "Create Account"}
			</span>
		</>
	);	
};

export default AuthForm;