import { useState } from "react";
import { dbService, storageService } from "fbase"
import { v4 as uuidv4 } from "uuid";
import { addDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory = ({ userObj }) => {
	const [nweet, setNweet] = useState("");
	const [attachment, setAttachment] =useState("");
	
	const onSubmit = async (event) => {
		event.preventDefault();
		/* await addDoc(collection(dbService, "nweets"), {
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
		});
		setNweet(""); */
		if (nweet === "") {
			return;
		}
		
		let attachmentUrl = "";
		if( attachment !== "" ) {
			const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			const response = await uploadString(attachmentRef, attachment, "data_url");
			console.log(getDownloadURL(response.ref));
			attachmentUrl = await getDownloadURL(response.ref);

		}
		const nweetObj = {
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl
		}
		await addDoc(collection(dbService, "nweets"),(nweetObj));
		setNweet("");
		setAttachment("");
		//const message = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';

	};
	
	const onChange = (event) => {
		event.preventDefault();
		const {
			target: { value },
		} = event;
		setNweet(value);
	};
	
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};
	
	const onClearAttachment = () => setAttachment("");
	
	return (
		<form onSubmit={onSubmit} className="factoryForm">
			<div className="factoryInput__container">
				<input
					value={nweet}
					onChange={onChange}
					type="text"
					placeholder="write something"
					maxLength={120}
				/>
				<input type="submit" value="&rarr;" className="factoryInput__arrow" />
			</div>
			<label htmlFor="attach-file" className="factoryInput__label">
				<span>Add photos</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>
			<input 
				id="attach-file"
				type="file" 
				accept="image/*" 
				onChange={onFileChange}
				style={{
				opacity: 0,
				}}	
			/>
			{attachment && (
				<div className="factoryForm__attachment">	
					<img 
						src={attachment}
						style={{
							backgroundImage: attachment,
						}}		
					/>
					<div className="factoryForm__clear" onClick={onClearAttachment}>
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			)}
		</form>	
	);
};

export default NweetFactory;