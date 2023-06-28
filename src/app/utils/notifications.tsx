export function playNotificationSound() {
    const audio = new Audio("/audios/receive.mp3"); // Reemplaza "/path/to/notification-sound.mp3" con la ruta a tu archivo de sonido de notificación

    audio.play();
}