// src/components/UserModal.tsx
import React, { useState, useEffect } from "react";
import "./UserModal.css";

interface UserInfo {
  fullName: string;
  position: string;
  photo: string; // URL або base64 рядок для фотографії
  background: string; // URL або base64 рядок для фонового зображення
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  setUserInfo,
}) => {
  const [fullName, setFullName] = useState<string>(userInfo.fullName);
  const [position, setPosition] = useState<string>(userInfo.position);
  const [photo, setPhoto] = useState<string>(userInfo.photo);
  const [background, setBackground] = useState<string>(userInfo.background);

  useEffect(() => {
    // Оновлюємо локальний стан при зміні userInfo
    setFullName(userInfo.fullName);
    setPosition(userInfo.position);
    setPhoto(userInfo.photo);
    setBackground(userInfo.background);
  }, [userInfo]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (fullName.trim() === "" || position.trim() === "") {
      alert("Повне ім’я та посада не можуть бути порожніми");
      return;
    }
    setUserInfo({ fullName, position, photo, background });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content user-modal-content"
        onClick={(e) => e.stopPropagation()} // Запобігає закриттю при кліку всередині модалки
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Інформація про користувача</h2>
        <div className="user-form">
          <label htmlFor="fullName">Повне ім’я:</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label htmlFor="position">Посада:</label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <label htmlFor="photo">Фотографія:</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />

          {photo && (
            <div className="photo-preview">
              <img src={photo} alt="User Preview" />
            </div>
          )}

          <label htmlFor="background">Фонове зображення:</label>
          <input
            id="background"
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
          />

          {background && (
            <div className="background-preview">
              <img src={background} alt="Background Preview" />
            </div>
          )}

          <button className="save-user-button" onClick={handleSubmit}>
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
