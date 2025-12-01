import React, { useEffect, useRef, useState } from 'react'

import Button from './Button'
import './ImageUpload.css'
const ImageUpload = props => {
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState();

	const filePickerRef = useRef();

	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
		console.log('fileReader', fileReader)
		console.log('fileReader.result', fileReader.result)
		console.log('file', file)
	}, [file])

	const pickedHandler = event => {
		console.log(event.target)
		let pickedFile;
		let fileIsValid = isValid;
		if (event.target.files && event.target.files.length === 1) {
			pickedFile = event.target.files[0];
			setFile(pickedFile); 
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}
		props.onInput(props.id, pickedFile, fileIsValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	return (
		<div className='form-control'>
			<input
				id={props.id}
				style={{ display: 'none' }}
				type="file"
				ref={filePickerRef}
				onChange={pickedHandler}
				accept='.jpeg, .png, .jpg'
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="preview" />}
					{!previewUrl && <p>Please select an image</p>}
				</div>
				<Button type='button' onClick={pickImageHandler}>Select Image</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	)
}

export default ImageUpload;
