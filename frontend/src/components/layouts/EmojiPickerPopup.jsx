import React, { useState, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = useCallback((emojiData) => {
        onSelect(emojiData?.imageUrl || "");
        setIsOpen(false);
    }, [onSelect]);

    const handleToggle = useCallback((e) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    }, []);

    const handleClose = useCallback((e) => {
        e.stopPropagation();
        setIsOpen(false);
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={handleToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleToggle(e)}
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-12 h-12" />
                    ) : (
                        <LuImage />
                    )}
                </div>
                <p className="text-sm text-gray-600">
                    {icon ? "Change Icon" : "Pick Icon"}
                </p>
            </div>
            
            {isOpen && (
                <div className="relative z-50">
                    <button 
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={handleClose}
                        aria-label="Close emoji picker"
                    >
                        <LuX size={16} />
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={300}
                            height={350}
                            previewConfig={{
                                showPreview: false
                            }}
                            skinTonesDisabled
                            searchDisabled
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;