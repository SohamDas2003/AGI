"use client";

import React, { useState, useEffect } from "react";

interface TextTypeProps {
	text: string[];
	typingSpeed?: number;
	pauseDuration?: number;
	showCursor?: boolean;
	cursorCharacter?: string;
	className?: string;
}

const TextType: React.FC<TextTypeProps> = ({
	text,
	typingSpeed = 100,
	pauseDuration = 2000,
	showCursor = true,
	cursorCharacter = "|",
	className = "",
}) => {
	const [currentTextIndex, setCurrentTextIndex] = useState(0);
	const [currentCharIndex, setCurrentCharIndex] = useState(0);
	const [isTyping, setIsTyping] = useState(true);
	const [showCursorBlink, setShowCursorBlink] = useState(true);

	useEffect(() => {
		if (text.length === 0) return;

		const currentText = text[currentTextIndex];

		if (isTyping) {
			if (currentCharIndex < currentText.length) {
				const timeout = setTimeout(() => {
					setCurrentCharIndex(currentCharIndex + 1);
				}, typingSpeed);
				return () => clearTimeout(timeout);
			} else {
				// Finished typing current text, pause before next
				const timeout = setTimeout(() => {
					setIsTyping(false);
					setCurrentCharIndex(0);
					setCurrentTextIndex((prevIndex) => (prevIndex + 1) % text.length);
				}, pauseDuration);
				return () => clearTimeout(timeout);
			}
		} else {
			// Start typing next text
			const timeout = setTimeout(() => {
				setIsTyping(true);
			}, 100);
			return () => clearTimeout(timeout);
		}
	}, [
		currentTextIndex,
		currentCharIndex,
		isTyping,
		text,
		typingSpeed,
		pauseDuration,
	]);

	// Cursor blinking effect
	useEffect(() => {
		if (!showCursor) return;

		const interval = setInterval(() => {
			setShowCursorBlink((prev) => !prev);
		}, 500);

		return () => clearInterval(interval);
	}, [showCursor]);

	if (text.length === 0) return null;

	const displayText =
		text[currentTextIndex]?.substring(0, currentCharIndex) || "";

	return (
		<span className={className}>
			{displayText}
			{showCursor && (
				<span
					className={`${
						showCursorBlink ? "opacity-100" : "opacity-0"
					} transition-opacity duration-100`}>
					{cursorCharacter}
				</span>
			)}
		</span>
	);
};

export default TextType;
